import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-config-prettier'

// Слои FSD сверху вниз. Слой может импортировать только из нижележащих (и из себя).
const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

/** Типы слоёв строго ниже переданного. */
function below(layer) {
  return FSD_LAYERS.slice(FSD_LAYERS.indexOf(layer) + 1)
}

export default tseslint.config(
  // Игнорируем сборку и сгенерированные файлы
  {
    ignores: [
      'dist',
      'node_modules',
      'src/routeTree.gen.ts',
      'src/shared/api/supabase/database.types.ts',
    ],
  },

  // Базовые + строгие TS-правила (с проверкой типов) для исходников
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      boundaries,
    },
    settings: {
      // Резолвер алиасов @/* — без него boundaries не видит цель импорта
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
      'boundaries/include': ['src/**/*'],
      // Слайсовые слои (pages/widgets/features/entities) описаны как `*/**`:
      // каждый слайс — отдельный элемент. Импорт ВНУТРИ слайса считается внутренним
      // и не проверяется; импорт между слайсами одного слоя — уже нарушение.
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'routes', pattern: 'src/routes/**' },
        { type: 'pages', pattern: 'src/pages/*/**', capture: ['slice'] },
        { type: 'widgets', pattern: 'src/widgets/*/**', capture: ['slice'] },
        { type: 'features', pattern: 'src/features/*/**', capture: ['slice'] },
        { type: 'entities', pattern: 'src/entities/*/**', capture: ['slice'] },
        { type: 'shared', pattern: 'src/shared/**' },
      ],
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Контроль границ слоёв FSD (eslint-plugin-boundaries v7)
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          // Только импорт ВНИЗ по слоям. Правила «свой слой разрешён» НЕТ:
          // внутрислайсовые импорты внутренние (не проверяются), а между
          // слайсами одного слоя — запрещены (cross-slice import).
          policies: [
            // app и routes — верх композиции
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { type: ['routes', ...below('app')] } } },
            },
            {
              from: { element: { type: 'routes' } },
              allow: { to: { element: { type: below('app') } } },
            },
            {
              from: { element: { type: 'pages' } },
              allow: { to: { element: { type: below('pages') } } },
            },
            {
              from: { element: { type: 'widgets' } },
              allow: { to: { element: { type: below('widgets') } } },
            },
            {
              from: { element: { type: 'features' } },
              allow: { to: { element: { type: below('features') } } },
            },
            {
              from: { element: { type: 'entities' } },
              allow: { to: { element: { type: below('entities') } } },
            },
            // Импорт ВНУТРИ своего слайса разрешён (тот же слой + совпадающий slice)
            ...['pages', 'widgets', 'features', 'entities'].map((layer) => ({
              from: { element: { type: layer } },
              allow: {
                to: {
                  element: {
                    type: layer,
                    captured: { slice: '{{ from.captured.slice }}' },
                  },
                },
              },
            })),
          ],
        },
      ],

      // Небольшие послабления строгого пресета под реальный код
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],
    },
  },

  // Route-файлы TanStack и обёртки shadcn/ui легитимно экспортируют не только компоненты
  {
    files: ['src/routes/**/*.tsx', 'src/shared/ui/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // Конфиги в корне — без проверки типов, node-окружение
  {
    files: ['*.{js,ts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Prettier отключает форматные правила ESLint — идёт последним
  prettier,
)
