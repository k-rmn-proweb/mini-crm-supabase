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
    ignores: ['dist', 'node_modules', 'src/routeTree.gen.ts'],
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
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**' },
        { type: 'routes', pattern: 'src/routes/**' },
        { type: 'pages', pattern: 'src/pages/**' },
        { type: 'widgets', pattern: 'src/widgets/**' },
        { type: 'features', pattern: 'src/features/**' },
        { type: 'entities', pattern: 'src/entities/**' },
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
          policies: [
            // app и routes — верх композиции, импортируют всё
            {
              from: { element: { type: 'app' } },
              allow: { to: { element: { type: FSD_LAYERS } } },
            },
            {
              from: { element: { type: 'routes' } },
              allow: { to: { element: { type: FSD_LAYERS } } },
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
            // Импорт внутри своего слоя разрешён
            {
              from: { element: { type: '*' } },
              allow: {
                to: { element: { type: '*', captured: { $eq: ['{{ from.element.type }}'] } } },
              },
            },
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
