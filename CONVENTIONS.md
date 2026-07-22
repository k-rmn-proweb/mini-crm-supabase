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
фабрики, интеграции, сконфигурированные инстансы. Сегментировано по папкам
(`shared/lib/<name>/index.ts`), не свалкой.

```
shared/lib/
  react-query/
    client.ts   # сконфигурированный queryClient (new QueryClient({...}))
    index.ts
  index.ts      # общий barrel: export * from './react-query'
```

- `queryClient` живёт здесь (сконфигурированный инстанс библиотеки), а НЕ в `app`.
  Слой `app` отвечает только за разводку провайдеров (`QueryClientProvider`) и импортит
  клиент из `@/shared/lib`. Плюс: инстанс доступен любому слою (напр., императивная инвалидация),
  тогда как из `app` нижние слои импортировать не могут (границы FSD).

Правило разграничения: «чистая функция без зависимостей от инфраструктуры» → `utils`;
«обёртка/интеграция/конфигурация вокруг библиотеки» → `lib`.

**Query-ключи и эндпоинты — НЕ в shared.** Они привязаны к ресурсу → живут в его сущности.
См. раздел «Data-access» ниже. `shared/api` остаётся только под транспорт.

> shadcn ждёт `cn` по алиасу `utils` в `components.json` → указывает на `@/shared/utils/cn`.
> Сгенерированные компоненты импортируют `@/shared/utils/cn`; при рефакторинге меняем на barrel `@/shared/utils`.

## Data-access: эндпоинты, ключи, хуки (entities + features)

Единый источник правды по ресурсу — его **сущность**. Централизация пер-ресурсная,
не глобальная: и read, и write определяются один раз в `entities/<entity>/api`,
а `features` их только используют. Так эндпоинты и ключи не разбросаны по слоям.

```
entities/client/api/
  client.keys.ts      # фабрика query-ключей (единственное определение ключей клиента)
  client.api.ts       # ВСЕ эндпоинты клиента: fetchClients, fetchClientById,
                      #   createClient, updateClient, deleteClient
                      #   — чистые async-функции: возвращают данные, кидают ошибку.
                      #   Единственное место сырых supabase-запросов клиента.
  client.queries.ts   # read-хуки: useClientsQuery, useClientQuery (keys + api)
  index.ts            # публичный API: keys, api-методы, read-хуки

features/client-create-edit/api/
  use-create-client.ts  # useMutation → client.api.createClient + инвалидация client.keys
  use-update-client.ts
  index.ts
```

**Разделение ответственности:**

- `entities/<entity>/api` = **data-access слой ресурса**: ключи + все эндпоинты (read и write) + read-хуки.
- `features/<action>/api` = **оркестрация действия пользователя**: mutation-хук (вызвать эндпоинт
  из сущности + инвалидировать нужные ключи + тост + связка с формой). Фича НЕ переопределяет
  эндпоинты и ключи — импортирует готовые из `@/entities/<entity>`.
- Границы FSD целы: `features → entities` разрешён; сущность про фичи не знает.

**Почему mutation-хуки в features, а НЕ в entities (ключевое):**

В FSD слайсы одного слоя не импортируют друг друга (`entities/deal` ↛ `entities/client`).
А мутация часто инвалидирует ключи **нескольких** сущностей. `feature` может импортировать
несколько entities (импорт вниз) и дёрнуть `dealKeys` + `clientKeys`; мутация внутри
`entities/deal` до `clientKeys` не дотянулась бы. Поэтому:

- **Ключи и read-хуки** — в сущности (read трогает только свои ключи → cross-import не нужен).
- **Mutation-хуки** — в фиче (импортит ключи нескольких entities для инвалидации).

Примеры:
- `client-delete` (каскад в БД сносит deals+activities) → фича инвалидирует `clientKeys`,
  `dealKeys`, `activityKeys` (импорт трёх entities вниз — ок).
- Кросс-сущностные read (дашборд) — в `widgets/dashboard-*` (виджет импортит несколько entities).
  Агрегаты выводятся из entity-запросов → инвалидация entity-ключей освежает и дашборд;
  отдельные «dashboard-ключи» не нужны.

**Правила:**

- Определение эндпоинта и ключа — один раз, в сущности. Дубликатов в фичах быть не должно.
- `*.api.ts` — только транспорт-вызовы, без React и без query-кеша (чистые функции).
  Кеш/хуки — в `*.queries.ts` (read) и в фичах (write).
- Файлы — kebab-case (`client.api.ts`, `use-create-client.ts`). Ключи — фабрика-объект
  (`clientKeys.all / lists() / list(filters) / details() / detail(id)`).
