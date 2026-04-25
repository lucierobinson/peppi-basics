/**
 * perplexity-upload.js — Perplexity S3 attachment upload protocol
 *
 * Implements the 4-step upload flow observed via DevTools HAR capture (2026-04-25).
 * Protocol documented in: docs/api-research/perplexity-upload-protocol.md
 *
 * Step A: POST /rest/uploads/batch_create_upload_urls → presigned S3 form + file_uuid
 * Step B: POST to S3 as multipart/form-data (presigned POST, NOT PUT)
 * Step D: POST /rest/sse/attachment_processing/subscribe → wait for processing-done SSE
 *
 * Auth: cookie-only (no x-csrf-token needed).
 * Node.js 18+ native fetch + FormData — no external dependencies.
 */

import { readFileSync } from 'fs';
import { basename } from 'path';
import { randomUUID } from 'crypto';

// ─── Constants (verbatim from HAR capture 2026-04-25) ────────────────────────

export const SUPPORTED_BLOCK_USE_CASES = [
  "answer_modes",
  "media_items",
  "knowledge_cards",
  "inline_entity_cards",
  "place_widgets",
  "finance_widgets",
  "prediction_market_widgets",
  "sports_widgets",
  "flight_status_widgets",
  "news_widgets",
  "shopping_widgets",
  "jobs_widgets",
  "search_result_widgets",
  "inline_images",
  "inline_assets",
  "placeholder_cards",
  "diff_blocks",
  "inline_knowledge_cards",
  "entity_group_v2",
  "refinement_filters",
  "canvas_mode",
  "maps_preview",
  "answer_tabs",
  "price_comparison_widgets",
  "preserve_latex",
  "generic_onboarding_widgets",
  "in_context_suggestions",
  "pending_followups",
  "inline_claims",
  "unified_assets",
  "workflow_steps",
  "background_agents",
];

const BATCH_CREATE_URL   = 'https://www.perplexity.ai/rest/uploads/batch_create_upload_urls?version=2.18&source=default';
const SUBSCRIBE_URL      = 'https://www.perplexity.ai/rest/sse/attachment_processing/subscribe';
const SUBSCRIBE_TIMEOUT  = 30_000; // ms — throw if processing not confirmed in time

// ─── Internal helpers ────────────────────────────────────────────────────────

function makePerplexityHeaders(session) {
  return {
    'content-type': 'application/json',
    'cookie': session.cookies,
    'origin': 'https://www.perplexity.ai',
    'referer': 'https://www.perplexity.ai/',
    'x-app-apiclient': 'default',
    'x-app-apiversion': '2.18',
    'x-perplexity-request-endpoint': BATCH_CREATE_URL,
    'x-perplexity-request-reason': 'ask-input-inner-home',
    'x-perplexity-request-try-number': '1',
  };
}

// ─── Step A ──────────────────────────────────────────────────────────────────

/**
 * Step A: batch create upload URLs.
 * Returns presigned S3 form fields + Perplexity file_uuid + s3_object_url.
 * @param {{ cookies: string }} session
 * @param {{ filename: string, file_size: number }} fileMeta
 * @returns {Promise<{ s3_bucket_url: string, s3_object_url: string, fields: object, file_uuid: string }>}
 */
export async function batchCreateUploadUrl(session, fileMeta) {
  const clientUuid = randomUUID();

  const resp = await fetch(BATCH_CREATE_URL, {
    method: 'POST',
    headers: makePerplexityHeaders(session),
    body: JSON.stringify({
      files: {
        [clientUuid]: {
          filename: fileMeta.filename,
          content_type: '',       // empty — Perplexity detects type server-side
          source: 'default',
          file_size: fileMeta.file_size,
          force_image: false,
          skip_parsing: false,
        },
      },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Step A failed: HTTP ${resp.status} — ${text.slice(0, 200)}`);
  }

  const json = await resp.json();
  const result = json.results?.[clientUuid];

  if (!result || result.error) {
    throw new Error(`Step A: unexpected response — ${JSON.stringify(json).slice(0, 300)}`);
  }
  if (result.rate_limited) {
    throw new Error('Step A: rate limited by Perplexity uploads endpoint');
  }

  return {
    s3_bucket_url: result.s3_bucket_url,
    s3_object_url: result.s3_object_url,
    fields: result.fields,
    file_uuid: result.file_uuid,
  };
}

// ─── Step B ──────────────────────────────────────────────────────────────────

/**
 * Step B: POST file to S3 as multipart/form-data (AWS presigned POST, NOT PUT).
 * Field order must follow the policy in this exact sequence.
 * @param {string} s3_bucket_url
 * @param {object} fields  — presigned form fields from Step A response
 * @param {Buffer} fileBuffer
 * @param {string} filename
 * @returns {Promise<void>}
 */
export async function uploadFileToS3(s3_bucket_url, fields, fileBuffer, filename) {
  const form = new FormData();

  // S3 presigned POST requires fields in policy-defined order (file must be last)
  const fieldOrder = [
    'acl',
    'Content-Type',
    'tagging',
    'x-amz-meta-is_text_only',
    'key',
    'AWSAccessKeyId',
    'x-amz-security-token',
    'policy',
    'signature',
  ];
  for (const key of fieldOrder) {
    if (fields[key] !== undefined) form.append(key, fields[key]);
  }
  form.append('file', new Blob([fileBuffer]), filename);

  const resp = await fetch(s3_bucket_url, {
    method: 'POST',
    body: form,
    // No Perplexity auth — S3 is authenticated via policy/signature in form fields
  });

  if (resp.status !== 204 && resp.status !== 200) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Step B failed: HTTP ${resp.status} — ${text.slice(0, 200)}`);
  }
}

// ─── Step D ──────────────────────────────────────────────────────────────────

/**
 * Step D: subscribe to attachment processing SSE, resolve when backend confirms done.
 * @param {{ cookies: string }} session
 * @param {string} file_uuid  — Perplexity UUID from Step A response
 * @returns {Promise<{ processed_uuid: string, s3_url: string | null }>}
 */
export async function waitForAttachmentProcessing(session, file_uuid) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUBSCRIBE_TIMEOUT);

  try {
    const resp = await fetch(SUBSCRIBE_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'cookie': session.cookies,
        'origin': 'https://www.perplexity.ai',
        'referer': 'https://www.perplexity.ai/',
      },
      body: JSON.stringify({ file_uuids: [file_uuid] }),
      signal: controller.signal,
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`Step D failed: HTTP ${resp.status} — ${text.slice(0, 200)}`);
    }

    const text = await resp.text();
    for (const line of text.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      try {
        const data = JSON.parse(line.slice(6));
        if (data.success === false) {
          throw new Error(`Step D: Perplexity reported processing failure for file_uuid=${file_uuid}`);
        }
        if (data.s3_url) {
          return { processed_uuid: file_uuid, s3_url: data.s3_url };
        }
      } catch (e) {
        if (e.message.startsWith('Step D:')) throw e;
        // ignore JSON parse errors on non-data lines
      }
    }

    // end_of_stream received but no s3_url — treat as success (s3_url from Step A is canonical)
    return { processed_uuid: file_uuid, s3_url: null };
  } finally {
    clearTimeout(timeout);
  }
}

// ─── High-level ──────────────────────────────────────────────────────────────

/**
 * Upload a file end-to-end: Step A + Step B + Step D.
 * Returns s3_object_url (use as params.attachments[0] in ask call).
 * @param {{ cookies: string }} session
 * @param {string} filePath  — absolute path to file
 * @returns {Promise<{ s3_object_url: string, processed_uuid: string }>}
 */
export async function uploadAttachment(session, filePath) {
  const fileBuffer = readFileSync(filePath);
  const filename   = basename(filePath);

  const stepA = await batchCreateUploadUrl(session, {
    filename,
    file_size: fileBuffer.length,
  });

  await uploadFileToS3(stepA.s3_bucket_url, stepA.fields, fileBuffer, filename);

  const stepD = await waitForAttachmentProcessing(session, stepA.file_uuid);

  return {
    s3_object_url: stepA.s3_object_url,
    processed_uuid: stepD.processed_uuid,
  };
}
