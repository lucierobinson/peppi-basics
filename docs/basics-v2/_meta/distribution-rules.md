# Distribuční pravidla pro `_inbox/` → `docs/basics-v2/` + `_handoff/`

Verze 3 (po session #4 + handoff mechanika, 2026-04-20).

Claude Code při každé distribuci provede **tři fáze**:
1. Distribuce inboxu (pattern match + sanitizace)
2. Commit v Git
3. Handoff refresh (vyprázdnění + naplnění `_handoff/` pro další session)

## Fáze 1: Sanitizace jmen souborů PŘED matchováním

Před regex matchem vždy strip následující artefakty z jména souboru:

1. **Finder duplicate suffix** — `(\d+)` před příponou:
   - `foo (1).md` → `foo.md`
   - Regex substituce: `s/ \(\d+\)(\.[^.]+)$/$1/`

2. **Whitespace trim** — leading/trailing spaces ve jménu.

## Fáze 1: Pattern matching tabulka

**Všechny verze ve jménu i cíli mají prefix `v`.** DIFF-SUMMARY má `v` prefix u OBOU verzí.

| Regex | Capture | Primární cíl | Další akce |
|---|---|---|---|
| `^peppi-basics-v2-writer-prompt-F2-v(.+)\.md$` | `$1` = verze | `docs/basics-v2/prompts/F2-writer/archive/v$1.md` | Kopie → `current.md` |
| `^peppi-basics-v2-researcher-prompt-F1-v(.+)\.md$` | `$1` = verze | `docs/basics-v2/prompts/F1-researcher/archive/v$1.md` | Kopie → `current.md` |
| `^peppi-basics-v2-hydrator-prompt-F0-v(.+)\.md$` | `$1` = verze | `docs/basics-v2/prompts/F0-hydrator/archive/v$1.md` | Kopie → `current.md` |
| `^peppi-basics-v2-auditor-prompt-F3-v(.+)\.md$` | `$1` = verze | `docs/basics-v2/prompts/F3-auditor/archive/v$1.md` | Kopie → `current.md` |
| `^peppi-basics-v2-formatter-prompt-F4-v(.+)\.md$` | `$1` = verze | `docs/basics-v2/prompts/F4-formatter/archive/v$1.md` | Kopie → `current.md` |
| `^HANDOVER-F2-v(.+)-session(\d+)\.md$` | `$1`/`$2` | `docs/basics-v2/handovers/archive/session-<$2 zero-padded 2>.md` | Kopie → `docs/basics-v2/handovers/current.md` |
| `^DIFF-SUMMARY-v(.+)-to-v(.+)\.md$` | `$1`/`$2` | `docs/basics-v2/diff-summaries/v$1-to-v$2.md` | — |
| `^REVIEW-PROMPT-v(.+)\.md$` | `$1` | `docs/basics-v2/reviews/v$1-cold-read/review-prompt.md` | Mkdir parent |
| `^pilot-verdict-(.+?)-v(.+)\.md$` | `$1`/`$2` | `docs/basics-v2/pilots/$1/verdict-v$2.md` | Mkdir parent |
| `^WriterDraft-(.+?)-v(.+)\.json$` | `$1`/`$2` | `docs/basics-v2/pilots/$1/writerdraft-v$2.json` | Mkdir parent |
| `^ResearchBrief-(.+?)-v(.+)\.json$` | `$1`/`$2` | `docs/basics-v2/pilots/$1/researchbrief-v$2.json` | Mkdir parent |

## Fáze 1: Collision policy

- `current.md` se VŽDY přepíše bez zálohy (archiv drží historii).
- Archivní soubory: pokud cíl existuje, přidat sufix `.duplicate-YYYYMMDD-HHMMSS` a nahlásit, **S JEDNOU VÝJIMKOU**: pokud Robinson uploaduje update existujícího souboru (typicky handover s frontmatterem přidaným ex-post), přepiš bez sufixu. Rozlišení: pokud handover nebo prompt file se stejným version tagem už v archivu existuje a Robinson posílá update, **přepiš**. Pokud jde o jiný typ souboru, **sufixuj**. Pragmaticky: pro HANDOVER a prompt files default = přepis; pro DIFF-SUMMARY a pilot files default = sufix.

## Fáze 1: Unknown file policy

Soubor neodpovídající žádnému patternu po sanitizaci zůstává v `_inbox/` a nahlásí se Robinsonovi.

## Fáze 2: Commit

Automatický commit s conventional commits message. Robinson NEROZHODUJE o commit message. Formát:

```
docs(basics-v2): distribute session #N deliverables

- <list toho, co bylo distribuováno, 1-3 bullets>
```

Pokud pre-commit hook selže, zobraz Robinsonovi output a skonči bez commitu — tohle je jediný případ, kdy je rozhodnutí na Robinsonovi.

## Fáze 3: Handoff refresh

Po úspěšném commitu:

### 3a) Přečti YAML frontmatter z nejnovějšího handoveru

Nejnovější handover = `docs/basics-v2/handovers/current.md`.

Parse YAML frontmatter (mezi prvními dvěma `---` řádky). Extrahuj:
- `session` (int)
- `phase` (string)
- `recommended_variant` (string nebo null)
- `recommended_command` (string nebo null)
- `handoff_files` (list absolutních cest vůči repo rootu)
- `handoff_notes` (multiline string, optional)

**Pokud handover NEMÁ frontmatter** (starší handover): nahlas Robinsonovi, že handoff refresh se přeskakuje, a pokračuj. Nevytvářej `_handoff/` obsah naslepo.

### 3b) Vyprázdni `_handoff/` (kromě .gitignore)

```bash
find _handoff -mindepth 1 ! -name '.gitignore' -delete
```

### 3c) Nakopíruj soubory z `handoff_files` do `_handoff/`

Každý soubor zkopíruj s **zachováním původního názvu** (ne jako `current.md`, ale jako původní filename z archivu nebo z posledního distribučního patternu). Příklad:

- `docs/basics-v2/handovers/current.md` → do handoff jako `HANDOVER-F2-v<verze>-session<N>.md` (název odvodit z frontmatteru nebo z git log — nejlépe číst ze souboru, který je `handovers/archive/session-<zero-padded>.md`)
- `docs/basics-v2/prompts/F2-writer/current.md` → do handoff jako `peppi-basics-v2-writer-prompt-F2-v<verze>.md` (verze odvodit z git log posledního archivu v `prompts/F2-writer/archive/` — nejnovější soubor dle mtime)

**Pragmatičtější varianta, pokud je odvození názvu komplikované:** pro každý soubor v `handoff_files` zkopíruj pod původním názvem, ale pokud je to `current.md`, odvoď název z nejnovějšího archivního souboru ve stejné archive složce (nejnovější dle mtime). Pokud ani to nejde, použij `current.md` jako fallback a připoj před něj parent folder název (např. `handovers_current.md`, `F2-writer_current.md`) — aby Robinson na Claude.ai viděl, co je co.

### 3d) Vytvoř `_handoff/README.md`

```markdown
# Handoff pro Session #<N>

**Otevři novou konverzaci na claude.ai (Opus) a uploaduj VŠECHNY soubory z této složky.**

Pak napiš: `<recommended_command z frontmatteru>`

## Soubory v této složce

<list všech souborů kromě README a .gitignore>

## Kontext

- Fáze: <phase z frontmatteru>
- Doporučená varianta: <recommended_variant>

<handoff_notes z frontmatteru, pokud existují>

---

Připraveno: YYYY-MM-DD HH:MM (Claude Code po Session #<N-1> distribuci)
```

### 3e) Commit handoff refresh

`_handoff/` je git-ignored, takže se nic necommituje. Ale pokud se aktualizoval `distribution-rules.md` nebo přibyl `.gitignore`, ty součástí předchozího commitu jsou.

## Final report pro Robinsona

Česky, stručně:

```
Session #<N-1> distribuce hotová. Session #<N> připravena v _handoff/.

Commit(y):
<výstup git log --oneline -3>

Pro spuštění Session #<N>:
1. Otevři Finder → Desktop → "peppi-handoff"
2. Drag&drop všech souborů do claude.ai
3. Napiš: <recommended_command>
```

**Žádné otázky, žádný git status, žádné „commit je na tobě".**
