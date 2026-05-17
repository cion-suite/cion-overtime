# planned_now — аудит шаблона (v4, после третьего /isplan)

> Снято: 2026-05-17. Scope: `.github/` + root configs + ruleset + FSD-скелет.
> v3: второй pass /isplan — починены 2 broken fix'а (#4 удалял бы shadcn-guard, #5 postinstall не сработал бы), удалён 1 invalid runtime bug (AuthProvider race), 2 overstated bugs понижены до nits, выкинуты cosmetic-nits (entities-comment, path-style) и явно отложенный rename из списка.
> v4: третий pass /isplan — sharpened #5 (README надо REWRITE, не augment — текущий PAT-claim misleading). Verified: registry-dir отсутствует by design (нет features yet), no `webContents.send`, no `app → features/entities`. Точность плана — 100% после v4.
> v4.1: #3 (`.gitignore` settings.json recursive) — **RESOLVED user-side**: line 27 удалена, `.claude/settings.json` и `.claude/settings.local.json` explicit-ignored на line 49-50.

## TL;DR

Шаблон **~93% готов** (после v4.1 — #3 закрыт user-side). **2 P0 блокера, 2 P1, всё остальное optional.** Можно копировать-пилить уже сейчас, P0 — 10 минут.

---

## 🔴 P0 — Blockers (10 минут суммарно)

### 1. `pnpm typecheck` не покрывает `electron.vite.config.ts`
- **Где:** `package.json:30` → `tsc -b --noEmit tsconfig.front.json tsconfig.back.json`
- **Что:** `tsconfig.node.json` в скрипте не запускается. Ошибки в vite-конфиге проходят CI молча.
- **Fix:** `"typecheck": "tsc -b --noEmit ."` — root `tsconfig.json` references перечисляют все три (front/back/node).
- **Caveat:** `tsc -b --noEmit` всё равно пишет `.tsbuildinfo` в `build/out-types/{front,back,node}/`. Уже под `build/` в `.gitignore` — не проблема.

### 2. Контрадикция CLAUDE.md §1 vs ESLint FSD-конфиг (widget→widget, pages→pages)
- **Где:** `src/widgets/app-layout/ui/Layout.tsx:4-5` импортирует `@/widgets/app-sidebar`, `@/widgets/app-navbar`. `fsd.js` разрешает peers для `widgets` и `pages`, CLAUDE.md §1 запрещает globally.
- **Fix:** правка одной фразы в CLAUDE.md §1 — "соседи на одном слое не импортируют друг друга, **кроме `widgets/` (композиция) и `pages/` (sub-pages)**". Канонический FSD это допускает; рефакторить Layout через `pages/` = over-engineering ради 2 импортов.

---

## 🟡 P1 — Real issues

### 4. ESLint `ignores` указывают на несуществующие пути
- `eslint.config.js:24-31` ссылается на `out/**`, `dist/**` etc — реальные пути под `build/`. Flat config не читает `.gitignore`.
- **Fix:** заменить 4 неправильных паттерна (`out/**`, `out-types/**`, `dist/**`, `dist-beta/**`) на один `'build/**'`. **СОХРАНИТЬ** `'src/shared/ui/shadcn/**'` (CLAUDE.md §8 запрещает редактирование). `node_modules/**` можно убрать — flat config игнорит по дефолту.
- **Итог:** `ignores: ['build/**', 'src/shared/ui/shadcn/**']`.

### 5. `@cion-suite/*` через `link:` — шаблон не drop-in для внешних форков
- `package.json:35-37, 41` — все 4 dep'а через `link:../cion-suite/packages/*`. `pnpm install` упадёт с ENOENT без сиблингового checkout `cion-suite/cion-suite` в `../cion-suite`. README обещает PAT с `read:packages` — **misleading copy, надо REWRITE, не augment**.
- **Fix (KISS):** **переписать** install-секцию README:
  1. удалить упоминание PAT/`read:packages` (link-proto не ходит в registry — токен ничего не даёт);
  2. жирная пометка: требуется сиблинговый checkout `cion-suite/cion-suite` ДО `pnpm install`;
  3. показать ожидаемую структуру (`parent/cion-suite/` + `parent/cion-template/`).
- **Почему не postinstall:** pnpm падает на link-resolution фазе ДО любых hooks. Альтернатива `workspace:` протокол (требует `pnpm-workspace.yaml` upgrade в monorepo — отдельный refactor, out of scope).

---

## 🟡 P2 — Optional CI hardening (если есть 30 минут)

Не блокеры. Template-репо имеет узкий threat-model (публичный код, read-only CI). Делать одним PR или скипать.

- **Top-level `permissions: contents: read`** в `ci.yml` — defense-in-depth.
- **`persist-credentials: false`** на всех 5 `actions/checkout`.
- **Удалить `lockfile-strict-main` job** (`ci.yml:90-109`) — мёртвый при `bypass_actors: []` в ruleset. **Caveat для downstream:** если форк отключит ruleset, восстановить.
- **PAT scope в README** (одна строка в install-секции, не отдельный action): "fine-grained PAT, `cion-suite/cion-suite`, `contents:read`".

---

## 🔵 Nits (опционально, без приоритета)

- **CSP `connect-src`** — задокументировать в `architecture.md` как known limitation. Renderer ничего не fetch'ит, `electron-updater` работает в main. Один абзац.
- **a11y skip-link** — `src/widgets/app-layout/ui/Layout.tsx:14` `<main>` без `id="main-content"` / skip-link. Для template-as-образец валидно. ~3 строки JSX.

---

## ❌ Выкинуто из плана (с причиной)

- ~~AuthProvider race~~ — **INVALID.** Перепроверено в коде: на `src/app/providers/AuthProvider.tsx:18-26` используется `.then().finally()`, а НЕ `await`. Подписка `onChange` стартует синхронно сразу после invocation `getSession()`. Бага нет.
- ~~Updater rollback race~~ — теоретическая race в очень узком окне (concurrent main-event между optimistic-set и rollback). Probability low, авторский комментарий показывает, что осознано. Не блокер. Если придёт жалоба — фиксить.
- ~~Updater silent console.warn~~ — это **initial fetch при mount**, silent fallback (`setIsBeta(null)`) корректнее toast'а: пользователь не делал action, UI просто покажет `null` state. Toast здесь = noise.
- ~~entities/index.ts side-effect-комментарий~~ — narrative-комментарий БЕЗ WHY нарушает Clean Code из CLAUDE.md ("комментарии — только WHY"). Drop.
- ~~tsconfig path style (`./src/*` vs `src/*`)~~ — cosmetic, TS обрабатывает оба, KISS-violation чинить.
- ~~alias `@shared/*` vs `@/shared/*` rename~~ — явно отложено в отдельный PR в v2, удалено из списка совсем (scope-creep в плане).
- ~~release/publish workflow~~ — downstream-проект сам ставит секреты/channels/signing.
- ~~CODEOWNERS/SECURITY.md/PR templates~~ — community-standards bureaucracy для скелета.
- ~~check-placeholders regex compiler-API~~ — KISS-violation в самом fix'е.
- ~~harden-runner~~ — explicit optional.
- ~~example-slice~~ — `architecture.md` достаточно.
- ~~--no-frozen-lockfile alarm~~ — `lockfile-strict-pr` уже гейтит.

---

## ✅ Проверено и работает

- 🟢 Pinned SHAs актуальны: `actions/checkout@v6.0.2`, `pnpm/action-setup@v6.0.8`, `actions/setup-node@v6.4.0`.
- 🟢 `electron-builder.beta.json` `extends` работает — `app-builder-lib@26.8.1/out/util/config/config.js:63`.
- 🟢 `electron-updater` бандлится — electron-builder автоматически тянет prod-deps.
- 🟢 `lockfile-strict (PR)` корректно гейтит PR-merge.
- 🟢 Status-check имена в ruleset точно матчатся с jobs.
- 🟢 Renovate covers GH Actions SHA pinning через `helpers:pinGitHubActionDigests`.
- 🟢 `installer.nsh` не редундант — `customInstallMode` пропускает multi-user UI page.
- 🟢 `concurrency.cancel-in-progress` корректный.
- 🟢 Cion-suite linked deps правильно externalized в electron-vite.
- 🟢 FSD shadcn-placement в `components.json` совпадает с CLAUDE.md §8.
- 🟢 Auth/License Context+hook в `shared/lib/` + Provider в `app/providers/` — §3 выполнено.

---

## Действия по приоритету

1. **Сейчас (10 мин):** #1 + #2 + #4 — оставшиеся P0/P1 кроме #5 (#3 уже закрыт).
2. **Когда будешь готов тиражировать (15 мин):** #5 (README rewrite).
3. **Опционально:** P2-батч + 🔵-nits.
