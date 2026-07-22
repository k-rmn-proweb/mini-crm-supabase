# Конвенции проекта

Правила кода и архитектуры. Документ живой — дополняется по мере проработки слоёв.

## Общее

- **FSD**, зависимости строго вниз: `app → routes → pages → widgets → features → entities → shared`. Контроль — ESLint (`boundaries/dependencies`).
- Публичный API каждого слайса — `index.ts` (barrel). Наружу импортируем только через него.
- TypeScript strict, без `any` без явного обоснования.
- Серверное состояние — только TanStack Query; клиентское UI-состояние — только Zustand. Не смешивать.

## `shared/ui`

Каждый компонент — самодостаточная папка со своим публичным API.

**Структура** (папка — lowercase, компонент — PascalCase):

```
shared/ui/button/
  Button.tsx    # сам компонент
  variants.ts   # cva-варианты:  export const buttonVariants = cva(...)
  types.ts      # пропсы:        export type ButtonProps (выводит VariantProps из variants.ts)
  index.ts      # barrel слайса: реэкспорт Button, buttonVariants, type ButtonProps
```

- `Button.tsx` импортирует варианты и типы из соседних файлов (`./variants`, `./types`).
- Простые компоненты без вариантов могут не иметь `variants.ts`; без доп. пропсов — `types.ts` опционален. Но `Component.tsx` + `index.ts` — всегда.

**Импорт в остальном коде — через общий barrel:**

```ts
import { Button } from '@/shared/ui'
```

`shared/ui/index.ts` реэкспортит каждый компонент одной строкой:

```ts
export * from './button'
```

**Добавление компонента shadcn/ui:**

1. `pnpm dlx shadcn@latest add <name>` — CLI создаёт плоский `src/shared/ui/<name>.tsx`.
2. Вручную разнести его на `Component.tsx` / `variants.ts` / `types.ts` / `index.ts` по структуре выше.
3. Добавить `export * from './<name>'` в `src/shared/ui/index.ts`.
