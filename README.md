# cion-overtime

Cion Overtime — учёт переработок: добавление дней, авто-списание FIFO, история. Electron desktop app на Cion Suite packages.

> **Для CI:** добавь в Settings → Secrets → Actions секрет
> `CION_SUITE_PAT` — fine-grained PAT с правом `Contents: Read` на
> репо `cion-suite/cion-suite`. Без него CI-checkout сиблингового
> приватного monorepo упадёт.

## Requirements

- **Node.js** ≥ 24
- **pnpm** ≥ 11

## Install

> ⚠️ **Не drop-in.** Зависимости `@cion-suite/*` подключены через
> `link:../cion-suite/packages/*` в `package.json` (пакеты дорабатываются
> in-place). Без сиблингового checkout'а monorepo `cion-suite/cion-suite`
> команда `pnpm install` упадёт на link-resolution фазе с `ENOENT`.

**1. Склонируй оба репо рядом** — родительская папка должна содержать
ОБА директория на одном уровне:

```
parent/
├── cion-suite/        # https://github.com/cion-suite/cion-suite (monorepo с пакетами)
└── cion-overtime/     # этот репо
```

**2. Установи зависимости monorepo** (один раз):

```bash
cd ../cion-suite
pnpm install
pnpm build      # сбилдить @cion-suite/* пакеты
```

**3. Install + dev:**

```bash
cd ../cion-overtime
pnpm install
pnpm dev
```

## Commands

```bash
pnpm dev          # electron-vite dev (main + preload + renderer)
pnpm build        # electron-vite build (build/out/)
pnpm preview      # preview production-сборки
pnpm dist         # build + electron-builder (local, no publish)
pnpm release      # build + electron-builder --publish always (CI: tag v* → GitHub release)
pnpm typecheck    # tsc front + back
pnpm lint         # ESLint + FSD boundaries
pnpm ship         # typecheck + lint + build (pre-flight)
pnpm check:placeholders  # ensure appId/pkg metadata replaced (auto-run by dist / release)
```

Дополнительно — slash-команды Claude Code: `/ship` (pre-flight),
`/isgood` (adversarial review diff'а), `/notes` (changelog), `/shadcn`
(UI-решения). См. `.claude/commands/`.

## Структура

```
app/        # Electron main + preload (composition root, IPC handlers, окна)
src/        # Renderer (React 19, FSD)
  app/      #   providers, routes, styles
  pages/    #   route-level wrappers
  widgets/  #   композиция features+entities
  features/ #   user-сценарии
  entities/ #   доменные сущности
  shared/   #   ui/lib/api/config (renderer-only)
shared/     # Cross-process типы (IPC contracts, event payloads)
build/      # Иконки + output electron-vite/electron-builder
docs/       # architecture.md, planned_now.md
```

Детально — `docs/architecture.md`.

## Native modules

Нативные модули (`keytar`, `better-sqlite3`, …): после `pnpm add` запусти
`npx electron-builder install-app-deps`, чтобы пересобрать под ABI Electron'а.

## Dependencies updates

Renovate (`renovate.json`) автоматически открывает PR на обновления зависимостей.

## Документация

- `CLAUDE.md` — стиль работы и критические правила для агентов.
- `docs/architecture.md` — устройство скелета + inlined FSD-стандарт.
- `docs/planned_now.md` — текущий план шлифовки (может быть пустым).
