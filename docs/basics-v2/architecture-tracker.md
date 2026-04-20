# Peppi Basics v2.0 — Architecture Decisions Tracker

D-decisions D1–D60+ průběžně doplňované napříč sessions.

Tento soubor Robinson nebo Claude průběžně aktualizuje. Nepřepisovat automaticky.

---

## Disaster Recovery & Backup Strategy (2026-04-20)

### Tabulka backup stavu

| Co | Primární | Sekundární/Backup | Poslední ověření |
|---|---|---|---|
| Peppi kód (repo) | lokální | GitHub (lucierobinson/peppi, privátní) | 2026-04-20 |
| Peppi data (recepty, 89ks) | Neon (automatické backupy) | — | Neon managed |
| Peppi fotky (recept hero images) | pCloud /RobinsonWebs/Peppi/recipe-* | — | průběžně |
| CIA B&P PDF | lokální `research-library/03-open-access-books/` | pCloud `/RobinsonWebs/Peppi/reference-library/cia-baking-pastry-3rd-edition.pdf` | 2026-04-20 |
| FCI Pastry Arts EPUB | lokální | pCloud `/RobinsonWebs/Peppi/reference-library/fci-classic-pastry-arts-2009.epub` | 2026-04-20 |
| Rinsky Companion PDF | lokální | pCloud `/RobinsonWebs/Peppi/reference-library/pastry-chefs-companion-rinsky-2008.pdf` | 2026-04-20 |
| Research-library markdown (index, content maps, eval) | lokální + GitHub | — | GitHub push 2026-04-20 |
| Peppi Claude skills (`peppi/.claude/skills/`) | GitHub (součást repa) | — | GitHub push 2026-04-20 |
| Globální Claude skills (`~/.claude/skills/`) | lokální | pCloud `/RobinsonWebs/Peppi/claude-skills-backup/claude-skills-global-20260420.tgz` | 2026-04-20 |
| Design files (peppi-design/) | lokální + GitHub | — | GitHub push 2026-04-20 |

### Policy

1. **Kód** → GitHub (privátní repo, pushovat při každé distribuci session deliverables).
2. **Data (Neon)** → managed automatický backup.
3. **Fotky** → pCloud (aktuální praxe).
4. **Referenční knihy (copyright)** → pCloud, NIKDY GitHub (ani privátní) — prevence precedentu i vůči GitHub security incidents.
5. **Globální skills** → pCloud tarball snapshot při každém větším milníku. Manuálně před velkými změnami.
6. **Conversation history (claude.ai)** → závisí na Anthropic; handovery v repu jsou canonical zdroj architektury.

### D-decision D61 (Disaster Recovery Baseline)

Robinson ztratil-li by dnes MacBook:
- **Peppi kód**: bez ztráty (GitHub)
- **Peppi data**: bez ztráty (Neon)
- **Peppi fotky**: bez ztráty (pCloud)
- **Referenční knihy**: bez ztráty (pCloud — 3 soubory, 131 MB celkem)
- **Skills**: Peppi skills bez ztráty (GitHub); globální skills bez ztráty (pCloud snapshot 2026-04-20)

**Mezera:** žádná známá. Claude conversation history je Anthropic-managed — architektonický obsah duplikován v handovers (`docs/basics-v2/handovers/`).

### Další akce

- Quarterly reminder: refresh globální skills snapshot do pCloudu (nový tarball s aktuálním datem).
- Při zásadních změnách v `.claude/skills/` (globální i Peppi): ručně re-run disaster recovery backup prompt.

---

## D-decision D62: pCloud folder rename Peppulka → Peppi (2026-04-20)

**Kontext:** Projekt byl přejmenován z Peppulka na Peppi dne 15. 3. 2026. Rename pokryl kód, Vercel, Neon, GitHub repo, ale **přeskočil pCloud storage složku** `/RobinsonWebs/Peppulka/`. Audit 20. 4. 2026 to identifikoval jako historickou mezeru.

**Rozhodnutí:** Přejmenovat pCloud složku `Peppulka` → `Peppi`.

**Důvody:**
1. Rename z 15. 3. měl být kompletní — pCloud byl opomenut, ne záměrně ponechán
2. Peppi Next.js aplikace používá `PCLOUD_ROOT_FOLDER_ID=30530940214` (numerické ID), ne textové jméno — rename folder API zachová ID, kód zůstane funkční
3. Kognitivní konzistence — všechna nová dokumentace (content maps, disaster recovery, handovery) mluví o `/RobinsonWebs/Peppi/`

**Ponecháno beze změny:**
- `peppulka-old/` PHP archiv (legacy)
- `src/middleware.ts` redirect `peppulka.nechcito.eu` → `peppi.nechcito.eu` (záměrný UX)
- Josefinin UI display name "Peppulka" (záměrný, viz rename plán z 15. 3.)
- Otesánek `peppulka/` PHP aplikace (oddělený projekt, jiný pCloud folder ID)

**Post-rename ověření:**
- pCloud folder ID `30530940214` zachováno
- peppi.nechcito.eu smoke test prošel (45 receptů, 21 pCloud obrázků HTTP 200)
- Content maps, architecture-tracker updatovány
