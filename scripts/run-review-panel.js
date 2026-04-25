#!/usr/bin/env node
/**
 * run-review-panel.js — Peppi Basics v2 Review Panel Orchestrator
 *
 * Architecture: pure Node.js, S3 attachment workflow (Varianta B: 1 upload per reviewer)
 *
 * Flow per reviewer (parallel across 6):
 *   Step A: POST /rest/uploads/batch_create_upload_urls  → presigned S3 form + file_uuid
 *   Step B: POST card.html to S3 as multipart/form-data
 *   Step D: POST /rest/sse/attachment_processing/subscribe → wait for processing-done
 *   Step E: POST /rest/sse/perplexity_ask with reviewer-prompt + params.attachments
 *
 * TODO: Varianta A optimisation — single upload shared across all 6 ask calls.
 *       Blocked on: unknown S3 URL expiry and whether backend binds s3_object_url to a
 *       specific request. Implement as optimisation once Varianta B is stable in production.
 *
 * Auth: PERPLEXITY_SESSION_COOKIE from .env (cookie string, no x-csrf-token needed)
 *
 * Usage:
 *   node run-review-panel.js --package <slug> [--reviewers <csv-slugs>]
 *
 * @see docs/api-research/perplexity-upload-protocol.md
 * @see docs/api-research/production-panel-spec.md
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import { uploadAttachment, SUPPORTED_BLOCK_USE_CASES } from './lib/perplexity-upload.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── .env loader ─────────────────────────────────────────────────────────────

const envPath = join(ROOT, '.env');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '').trim();
  }
}

// ─── Panel config ─────────────────────────────────────────────────────────────

const PANEL = [
  { slug: 'claude-sonnet-46',    model_preference: 'claude46sonnetthinking', identify_as: 'Claude Sonnet 4.6 (Thinking)' },
  { slug: 'gpt-54',              model_preference: 'gpt54',                  identify_as: 'GPT-5.4' },
  { slug: 'gemini-31-pro-high',  model_preference: 'gemini31pro_high',       identify_as: 'Gemini 3.1 Pro Thinking (Perplexity)' },
  { slug: 'grok',                model_preference: 'grok',                   identify_as: 'Grok 4.1' },
  { slug: 'nemotron-3-super',    model_preference: 'nv_nemotron_3_super',    identify_as: 'Nemotron 3 Super' },
  { slug: 'sonar-deep-research', model_preference: 'pplx_alpha',             identify_as: 'Sonar Deep Research' },
];

const ASK_ENDPOINT      = 'https://www.perplexity.ai/rest/sse/perplexity_ask';
const SETTINGS_ENDPOINT = 'https://www.perplexity.ai/rest/user/settings';
const CONFIG_ENDPOINT   = 'https://www.perplexity.ai/rest/models/config?config_schema=v1';
const SUSPICIOUS_SHORT  = 1500; // chars — flag review as suspiciously short

// ─── CLI ─────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag) => {
    const i = args.findIndex(a => a === flag || a.startsWith(flag + '='));
    if (i === -1) return null;
    if (args[i].includes('=')) return args[i].split('=').slice(1).join('=');
    return args[i + 1] ?? null;
  };
  return {
    packageSlug: get('--package'),
    reviewerFilter: get('--reviewers')?.split(',').map(s => s.trim()) ?? null,
  };
}

// ─── Session ─────────────────────────────────────────────────────────────────

function getSession() {
  const cookies = process.env.PERPLEXITY_SESSION_COOKIE;
  if (!cookies) {
    throw new Error(
      'PERPLEXITY_SESSION_COOKIE is not set.\n' +
      'Add it to .env in peppi-basics root:\n' +
      '  PERPLEXITY_SESSION_COOKIE=<your cookie string>'
    );
  }
  return { cookies };
}

// ─── Preflight ────────────────────────────────────────────────────────────────

async function preflight(session) {
  const required = [
    'claude46sonnetthinking', 'gpt54', 'gemini31pro_high',
    'grok', 'nv_nemotron_3_super', 'pplx_alpha',
  ];
  const headers = {
    'cookie': session.cookies,
    'origin': 'https://www.perplexity.ai',
    'referer': 'https://www.perplexity.ai/',
  };

  const [settings, config] = await Promise.all([
    fetch(SETTINGS_ENDPOINT, { headers }).then(r => r.json()),
    fetch(CONFIG_ENDPOINT, { headers }).then(r => r.json()),
  ]);

  const plan   = settings?.subscription_status ?? settings?.plan ?? '(unknown)';
  const agRes  = settings?.agentic_research ?? settings?.agentic_research_enabled ?? 0;
  const qcBefore = settings?.query_count_copilot ?? settings?.copilot_query_count ?? '?';

  if (agRes === 1 || agRes === true) {
    console.warn('[preflight] WARN: agentic_research is ON — may inflate query cost');
  }

  const modelIds = Object.keys(config?.model_configs ?? config?.models ?? config ?? {});
  const missing  = required.filter(m => !modelIds.includes(m));
  if (missing.length > 0) {
    throw new Error(`[preflight] MISSING models in catalog: ${missing.join(', ')} — STOP`);
  }

  console.log(
    `[preflight] plan=${plan} | agentic_research=${agRes} | ` +
    `query_count_before=${qcBefore} | models OK (${required.length}/${required.length})`
  );
  return { qcBefore };
}

// ─── SSE parser ───────────────────────────────────────────────────────────────

function parseSSEAnswer(rawText) {
  let finalAnswer = '';
  let displayModel = null;

  for (const line of rawText.split('\n')) {
    if (!line.startsWith('data: ')) continue;
    try {
      const obj = JSON.parse(line.slice(6));
      if (obj.display_model) displayModel = obj.display_model;
      if (obj.model_preference && !displayModel) displayModel = obj.model_preference;

      // Schematized API: extract from blocks.markdown_block (progress === 'DONE')
      if (obj.blocks) {
        for (const block of obj.blocks) {
          if (block.markdown_block?.progress === 'DONE' && block.markdown_block.answer) {
            finalAnswer = block.markdown_block.answer;
          }
        }
      }
      // Fallback: incremental text accumulator (non-schematized or partial)
      if (obj.text && !finalAnswer) finalAnswer = obj.text;
    } catch (_) {}
  }

  return { answer: finalAnswer, displayModel: displayModel ?? '(unknown)' };
}

// ─── Reviewer call (Step E) ───────────────────────────────────────────────────

async function callReviewer(session, reviewer, queryStr, s3ObjectUrl) {
  const label = `[${reviewer.slug}]`;
  const startMs = Date.now();

  const body = {
    query_str: queryStr,
    params: {
      attachments: s3ObjectUrl ? [s3ObjectUrl] : [],
      language: 'en-US',
      timezone: 'Europe/Prague',
      search_focus: 'internet',
      sources: ['web'],
      frontend_uuid: randomUUID(),
      mode: 'copilot',
      model_preference: reviewer.model_preference,
      is_related_query: false,
      is_sponsored: false,
      frontend_context_uuid: randomUUID(),
      prompt_source: 'user',
      query_source: 'home',
      is_incognito: false,
      time_from_first_type: 849.6,
      local_search_enabled: false,
      use_schematized_api: true,
      send_back_text_in_streaming_api: false,
      supported_block_use_cases: SUPPORTED_BLOCK_USE_CASES,
      client_coordinates: null,
      mentions: [],
      dsl_query: queryStr,
      skip_search_enabled: true,
      is_nav_suggestions_disabled: false,
      source: 'default',
      always_search_override: false,
      override_no_search: false,
      should_ask_for_mcp_tool_confirmation: true,
      browser_agent_allow_once_from_tooltip: false,
      force_enable_browser_agent: false,
      supported_features: ['browser_agent_permission_banner_v1.1'],
      extended_context: false,
      version: '2.18',
      rum_session_id: randomUUID(),
    },
  };

  console.log(`${label} Step E: streaming...`);

  const resp = await fetch(ASK_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cookie': session.cookies,
      'origin': 'https://www.perplexity.ai',
      'referer': 'https://www.perplexity.ai/',
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`${label} Step E HTTP ${resp.status} — ${text.slice(0, 200)}`);
  }

  const rawText = await resp.text();
  const { answer, displayModel } = parseSSEAnswer(rawText);
  const durationMs = Date.now() - startMs;
  const flag = answer.length < SUSPICIOUS_SHORT ? 'SUSPICIOUS_SHORT' : 'none';

  console.log(
    `${label} Step E: done | ${durationMs}ms | ${answer.length} chars | ` +
    `display_model=${displayModel} | flag=${flag}`
  );

  return { answer, displayModel, durationMs, flag };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { packageSlug, reviewerFilter } = parseArgs();
  if (!packageSlug) {
    console.error('Usage: node run-review-panel.js --package <slug> [--reviewers <csv>]');
    process.exit(1);
  }

  const session    = getSession();
  const packageDir = join(ROOT, 'review-packages', packageSlug);

  if (!existsSync(packageDir)) {
    console.error(`Package not found: ${packageDir}`);
    process.exit(1);
  }

  // Load package files
  const promptPath = join(packageDir, 'reviewer-prompt.md');
  const cardPath   = join(packageDir, 'card.html');

  if (!existsSync(promptPath)) {
    console.error(`reviewer-prompt.md not found in ${packageDir}`);
    process.exit(1);
  }

  const reviewerPrompt = readFileSync(promptPath, 'utf8');
  const hasCard = existsSync(cardPath);

  if (!hasCard) {
    console.log('[main] card.html not found — falling back to inline mode (no S3 attachment)');
  } else {
    const cardBytes = readFileSync(cardPath).length;
    console.log(`[main] card.html found: ${(cardBytes / 1024).toFixed(1)} kB → will upload as S3 attachment`);
  }

  // Filter panel
  const activePanel = reviewerFilter
    ? PANEL.filter(r => reviewerFilter.some(f =>
        f === r.slug || f === r.model_preference || f === r.identify_as
      ))
    : PANEL;

  if (activePanel.length === 0) {
    console.error(`No matching reviewers for filter: ${reviewerFilter.join(', ')}`);
    process.exit(1);
  }

  console.log(`[main] Package: ${packageSlug} | Reviewers (${activePanel.length}): ${activePanel.map(r => r.slug).join(', ')}`);

  // Preflight
  await preflight(session);

  // Output dir
  const ts = new Date().toISOString().replace(/:/g, '').replace(/\..+/, 'Z');
  const runDir = join(packageDir, '_submissions', `run-${ts}`);
  mkdirSync(runDir, { recursive: true });
  console.log(`[main] Output dir: ${runDir}`);

  const wallStart = Date.now();

  // Run all reviewers in parallel (Varianta B: 1 upload per reviewer)
  const results = await Promise.allSettled(
    activePanel.map(async (reviewer) => {
      const label = `[${reviewer.slug}]`;
      let s3ObjectUrl = null;

      // Steps A + B + D: upload card.html (if present)
      if (hasCard) {
        console.log(`${label} Step A: batch_create_upload_url...`);
        const upload = await uploadAttachment(session, cardPath);
        s3ObjectUrl = upload.s3_object_url;
        console.log(`${label} Step A+B+D: OK`);
      }

      // Step E: ask call
      const { answer, displayModel, durationMs, flag } = await callReviewer(
        session, reviewer, reviewerPrompt, s3ObjectUrl
      );

      // Write output file
      const md = [
        `# Review by ${reviewer.identify_as}`,
        '',
        `**Model preference (API):** \`${reviewer.model_preference}\``,
        `**Display model (response):** \`${displayModel}\``,
        `**Duration:** ${durationMs} ms`,
        `**Answer length:** ${answer.length} chars`,
        `**Flag:** ${flag}`,
        `**Timestamp:** ${new Date().toISOString()}`,
        `**Mode:** ${s3ObjectUrl ? 'S3 attachment' : 'inline (no card.html)'}`,
        '',
        '---',
        '',
        answer,
      ].join('\n');

      const outPath = join(runDir, `${reviewer.slug}.md`);
      writeFileSync(outPath, md, 'utf8');
      console.log(`${label} written → ${reviewer.slug}.md (${answer.length} chars)`);

      return { slug: reviewer.slug, chars: answer.length, flag, durationMs };
    })
  );

  const wallMs = Date.now() - wallStart;

  // Summary
  console.log(`\n[main] Walltime: ${(wallMs / 1000).toFixed(1)}s`);

  let passed = 0;
  for (const r of results) {
    if (r.status === 'fulfilled') {
      const v = r.value;
      const ok = v.flag === 'none';
      if (ok) passed++;
      console.log(`  ${ok ? '✅' : '⚠️ '} ${v.slug}: ${v.chars} chars (${v.flag}) in ${(v.durationMs / 1000).toFixed(1)}s`);
    } else {
      console.log(`  ❌ FAILED: ${r.reason?.message ?? r.reason}`);
    }
  }

  console.log(`\n[main] ${passed}/${activePanel.length} reviewers passed`);
  console.log(`[main] Results: ${runDir}`);
}

main().catch(e => { console.error('[fatal]', e.message); process.exit(1); });
