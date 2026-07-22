import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-config-prettier'

// FSD layers top to bottom. A layer may import only from the layers below it (and from itself).
const FSD_LAYERS = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

/** Layer types strictly below the given one. */
function below(layer) {
  return FSD_LAYERS.slice(FSD_LAYERS.indexOf(layer) + 1)
}

export default tseslint.config(
  // Ignore build output and generated files
  {
    ignores: [
      'dist',
      'node_modules',
      'src/routeTree.gen.ts',
      'src/shared/api/supabase/database.types.ts',
    ],
  },

  // Base + strict TS rules (type-checked) for the source files
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
      // Resolver for @/* aliases — without it boundaries can't see the import target
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
      },
      'boundaries/include': ['src/**/*'],
      // Sliced layers (pages/widgets/features/entities) are described as `*/**`:
      // each slice is a separate element. An import WITHIN a slice is treated as internal
      // and is not checked; an import between slices of the same layer is a violation.
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

      // FSD layer-boundary enforcement (eslint-plugin-boundaries v7)
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          // Downward imports only. There is NO "own layer is allowed" rule:
          // intra-slice imports are internal (not checked), and imports between
          // slices of the same layer are forbidden (cross-slice import).
          policies: [
            // app and routes — the top of the composition
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
            // Imports WITHIN a slice are allowed (same layer + matching slice)
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

      // Small relaxations of the strict preset to fit the real code
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowBoolean: true },
      ],
      // '' (empty string) must fall through to the fallback → keep || for strings
      '@typescript-eslint/prefer-nullish-coalescing': [
        'error',
        { ignorePrimitives: { string: true } },
      ],
      // () => setState(x) in handlers/setters is a normal React pattern
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
      // No forced `void` before promises and no errors on async handlers
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
    },
  },

  // TanStack route files, shadcn/ui wrappers and context providers (provider + hooks in one file)
  {
    files: ['src/routes/**/*.tsx', 'src/shared/ui/**/*.tsx', 'src/**/*-context.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },

  // TanStack beforeLoad guards throw redirect() — not an Error, but a router signal
  {
    files: ['src/routes/**'],
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
    },
  },

  // Root config files — no type-checking, node environment
  {
    files: ['*.{js,ts}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Prettier disables ESLint's formatting rules — must come last
  prettier,

  // curly doesn't conflict with Prettier, but eslint-config-prettier turns it off —
  // re-enable it AFTER prettier: always use braces in if/else/for/while
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      curly: ['error', 'all'],
    },
  },
)
