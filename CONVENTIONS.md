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

## `shared/api`

Только **транспорт и конфигурация клиентов** (низкий уровень). Бизнес-запросы
(список клиентов, сделок и т.п.) сюда НЕ кладём — они живут в `entities/*/api`.

Каждый клиент/транспорт — отдельный сегмент-папка, без плоской свалки файлов:

```
shared/api/
  supabase/
    client.ts          # createClient instance
    database.types.ts  # сгенерированные типы БД (Supabase CLI)
    index.ts           # barrel сегмента
  http/                # пример: если понадобится REST-клиент (axios)
    client.ts          #   axios.create + интерцепторы
    index.ts
  index.ts             # общий barrel: export * from './supabase'
```

- Куда axios? В свой сегмент `shared/api/http/` (`client.ts` c `axios.create` и интерцепторами
  + `index.ts`), а не отдельным файлом рядом с supabase. В текущем проекте axios не нужен —
  транспорт это Supabase JS-клиент, данные ходят через TanStack Query.
- Импорт в остальном коде — через общий barrel: `import { supabase } from '@/shared/api'`.

## `shared/utils` vs `shared/lib`

Разделяем по природе кода — utils отдельно от «библиотечных» модулей.

**`shared/utils`** — чистые функции-хелперы: без сайд-эффектов, без привязки к домену
и React. Форматтеры, `cn`, гварды, парсеры, хелперы строк/чисел/массивов.

```
shared/utils/
  cn.ts        # export function cn(...)
  format.ts    # (пример) formatCurrency, formatDate — при росте → папка format/
  index.ts     # общий barrel: export * from './cn'
```

- Группа утилит — файл; когда файл разрастается — промоутим в папку-сегмент
  (`format/format-currency.ts`, `format/format-date.ts`, `format/index.ts`).
- Импорт — через barrel: `import { cn } from '@/shared/utils'`.

**`shared/lib`** — «библиотечные» модули посложнее: обёртки над сторонними либами,
фабрики, интеграции, сконфигурированные инстансы. Тоже сегментировано по папкам
(`shared/lib/<name>/index.ts`), не свалкой. Создаётся, когда появляется первый такой модуль.

Правило разграничения: «чистая функция без зависимостей от инфраструктуры» → `utils`;
«обёртка/интеграция/конфигурация вокруг библиотеки» → `lib`.

> shadcn ждёт `cn` по алиасу `utils` в `components.json` → указывает на `@/shared/utils/cn`.
> Сгенерированные компоненты импортируют `@/shared/utils/cn`; при рефакторинге меняем на barrel `@/shared/utils`.
