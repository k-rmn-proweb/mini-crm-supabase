# Конвенции проекта

Правила кода и архитектуры. Документ живой — дополняется по мере проработки слоёв.

## Общее

- **FSD**, зависимости строго вниз: `app → routes → pages → widgets → features → entities → shared`.
  Контроль — ESLint (`boundaries/dependencies`), **slice-aware**: разрешён импорт только вниз по
  слоям + внутри своего слайса. Между слайсами одного слоя (`entities/deal → entities/client`) —
  ошибка (в т.ч. через относительный путь). Кросс-сущностная связка — на верхнем слое (widget/page).
- Публичный API каждого слайса — `index.ts` (barrel). Наружу импортируем только через него.
- TypeScript strict, без `any` без явного обоснования.
- Серверное состояние — только TanStack Query; клиентское UI-состояние — только Zustand. Не смешивать.

## Декларации типов (module augmentation, ambient)

`declare module` / ambient-декларации **не пишем инлайн** в компонентах и модулях —
выносим в отдельные `*.d.ts`, и они подчиняются тому же слоевому правилу, что и код:

- Аугментация, завязанная на слой (напр. TanStack Router `Register` через `typeof router`) →
  в этом слое: `src/app/register.d.ts`.
- Глобальные ambient без владельца (типы ассетов `*.svg?raw`, расширение `import.meta.env`) → `shared`.
- Файл `.d.ts` попадает в program через tsconfig `include` — импортировать его не нужно,
  аугментация применяется глобально (проверено: типобезопасность `Link to` работает).

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

- Куда axios? В свой сегмент `shared/api/http/` (`client.ts` c `axios.create` и интерцепторами,
  плюс `index.ts`), а не отдельным файлом рядом с supabase. В текущем проекте axios не нужен —
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

**`shared/hooks`** — переиспользуемые generic React-хуки без домена (`useDebouncedValue`,
`useMediaQuery` и т.п.). Отдельный сегмент shared, НЕ в `lib` (там только библиотечные обёртки)
и НЕ в `utils` (там чистые функции без React). Импорт — `@/shared/hooks`.

Правило разграничения: «чистая функция без React и инфраструктуры» → `utils`;
«generic React-хук» → `hooks`; «обёртка/интеграция/конфиг вокруг библиотеки» → `lib`.

**Query-ключи и эндпоинты — НЕ в shared.** Они привязаны к ресурсу → живут в его сущности.
См. раздел «Data-access» ниже. `shared/api` остаётся только под транспорт.

> shadcn ждёт `cn` по алиасу `utils` в `components.json` → указывает на `@/shared/utils/cn`.
> Сгенерированные компоненты импортируют `@/shared/utils/cn`; при рефакторинге меняем на barrel `@/shared/utils`.

## Структура слайса (entities / features) и data-access

Единый источник правды по ресурсу — его **сущность**. Централизация пер-ресурсная,
не глобальная: и read, и write определяются один раз в `entities/<entity>`,
а `features` их только используют. Так эндпоинты и ключи не разбросаны по слоям.

```
entities/client/
  api/                    # определения БЕЗ React
    keys.ts               #   clientKeys — фабрика query-ключей (единственное определение)
    api.ts                #   эндпоинты: fetchClients, fetchClientById, createClient,
                          #     updateClient, deleteClient — чистые async, сырые supabase-запросы
    dto.ts                #   CreateClientDto, UpdateClientDto, response-типы
  model/                  # React / логика
    types.ts              #   доменный тип Client, ClientStatus (выводится из Tables<'clients'>)
    useClientsQuery.ts    #   read-хуки (keys + api)
    useClientQuery.ts
  index.ts                # публичный API сущности (один на слайс)

features/client-create-edit/
  model/
    useCreateClient.ts    # useMutation → client.api.createClient + инвалидация нужных ключей
    useUpdateClient.ts
  lib/
    schema.ts             # Zod-схема формы (резолвится в CreateClientDto)
    consts.ts
  ui/
    ClientFormDialog.tsx  # форма + диалог, зовёт хук из model
  index.ts

features/client-delete/    # отдельное действие (как в PRD)
  model/  useDeleteClient.ts
  ui/     ConfirmDeleteDialog.tsx
  index.ts
```

**Сегменты — `api` vs `model`:**

- `api/` = **определения без React**: ключи, сырые request-функции, DTO/response-типы.
- `model/` = **React/логика**: доменные типы, query/mutation-хуки, сторы.
- Read-хук → `entities/<e>/model`; mutation-хук → `features/<action>/model`. Оба в `model` своего слайса.

**Типы — где:**

| Тип                                              | Место                                   |
| ------------------------------------------------ | --------------------------------------- |
| DB Row / Insert / Update (генерённые)            | `shared/api/supabase/database.types.ts` |
| Доменный `Client`, `ClientStatus`                | `entities/client/model/types.ts`        |
| `CreateClientDto` / `UpdateClientDto` / response | `entities/client/api/dto.ts`            |
| Кросс-сущностная склейка (client+deals)          | виджет/страница, что композирует        |

Тип живёт в самом низком слайсе, который им владеет; все выше импортируют его вниз.
Доменные типы деривим из генерённых (`Tables<'clients'>`), не пишем вручную. Эндпоинт
по умолчанию возвращает доменный тип — верхние слои не трогают сырые Row.

**Почему mutation-хуки в features, а НЕ в entities (ключевое):**

В FSD слайсы одного слоя не импортируют друг друга (`entities/deal` ↛ `entities/client`).
А мутация часто инвалидирует ключи **нескольких** сущностей. `feature` может импортировать
несколько entities (импорт вниз) и дёрнуть `dealKeys` + `clientKeys`; мутация внутри
`entities/deal` до `clientKeys` не дотянулась бы. Поэтому ключи+read-хуки — в сущности,
mutation-хуки — в фиче. Кросс-сущностные read (дашборд) — в `widgets/dashboard-*`
(виджет импортит несколько entities); агрегаты из entity-запросов, инвалидация
entity-ключей освежает и дашборд.

**Именование слайсов и файлов:**

- Фича именуется **действием**, не существительным: `client-create-edit`, `client-delete`
  (не `features/client` — доменное существительное = entity).
- `index.ts` — **только на уровне слайса**. Сегменты (`api/model/ui/lib`) barrel'ов не имеют,
  внутри слайса — относительные импорты.
- Файлы: компоненты — `PascalCase.tsx` (`ClientFormDialog.tsx`); хуки — по имени хука
  (`useClientsQuery.ts`); определения/утилиты — `lowercase` (`keys.ts`, `api.ts`, `dto.ts`, `schema.ts`).
- Определение эндпоинта и ключа — один раз, в сущности; дубликатов в фичах нет.
  Ключи — фабрика-объект (`clientKeys.all / lists() / list(filters) / details() / detail(id)`).
