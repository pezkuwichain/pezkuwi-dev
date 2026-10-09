// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { fixupPluginRules } from '@eslint/compat';
import eslintJs from '@eslint/js';
import stylisticPlugin from '@stylistic/eslint-plugin';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
// @ts-expect-error No definition for this one
import headerPlugin from 'eslint-plugin-header';
// @ts-expect-error No definition for this one
import importNewlinesPlugin from 'eslint-plugin-import-newlines';
import importPlugin from 'eslint-plugin-import-x';
import jestPlugin from 'eslint-plugin-jest';
import nPlugin from 'eslint-plugin-n';
// @ts-expect-error No definition for this one
import promisePlugin from 'eslint-plugin-promise';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
// @ts-expect-error No definition for this one
import sortDestructureKeysPlugin from 'eslint-plugin-sort-destructure-keys';
import globals from 'globals';

import { overrideAll, overrideJs, overrideJsx, overrideSpec } from './eslint.rules.js';
import { standardRules } from './eslint.standard.js';

/**
 * eslint-plugin-header declares no options schema, and eslint 9+ rejects
 * options for a rule without one. `schema: false` is how a rule says it
 * validates its own options; the rule itself is unchanged.
 */
const headerPluginFixed = {
  ...headerPlugin,
  rules: {
    header: {
      ...headerPlugin.rules.header,
      meta: { ...headerPlugin.rules.header.meta, schema: false }
    }
  }
};

const EXT_JS = ['.cjs', '.js', '.mjs'];
const EXT_TS = ['.ts', '.tsx'];
const EXT_ALL = [...EXT_JS, ...EXT_TS];

/**
 * @internal
 * Converts a list of EXT_* defined above to globs
 * @param {string[]} exts
 * @returns {string[]}
 */
function extsToGlobs (exts) {
  return exts.map((e) => `**/*${e}`);
}

export default [
  {
    ignores: [
      '**/.github/',
      '**/.vscode/',
      '**/.yarn/',
      '**/build/',
      '**/build-*/',
      '**/coverage/',
      '**/cjs/**',
      // Build output files (generated from src/)
      'packages/*/*.d.ts',
      'packages/*/*.js',
      'packages/*/*.mjs',
      'packages/*/*.cjs',
      'packages/*/rootJs/**',
      'packages/*/rootTests.*',
      'packages/*/browser.*',
      'packages/*/node.*',
      'packages/*/types.*',
      'packages/*/env/**'
    ]
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        project: './tsconfig.eslint.json',
        sourceType: 'module',
        warnOnUnsupportedTypeScriptVersion: false
      }
    },
    plugins: {
      '@stylistic': stylisticPlugin,
      '@typescript-eslint': tsPlugin,
      // eslint-plugin-header reports at the first token after the leading
      // comments, so a generated file's /* eslint-disable */ covers it; the
      // maintained fork reports at line 1 instead. The compat layer supplies the
      // context methods eslint 10 removed; headerPluginFixed, the options schema.
      header: fixupPluginRules(headerPluginFixed),
      'import-newlines': importNewlinesPlugin,
      'import-x': importPlugin,
      n: nPlugin,
      promise: promisePlugin,
      'simple-import-sort': simpleImportSortPlugin,
      'sort-destructure-keys': sortDestructureKeysPlugin
    },
    settings: {
      'import-x/extensions': EXT_ALL,
      'import-x/parsers': {
        '@typescript-eslint/parser': EXT_TS,
        espree: EXT_JS
      },
      'import-x/resolver': {
        node: {
          extensions: EXT_ALL
        },
        typescript: {
          project: './tsconfig.eslint.json'
        }
      }
    }
  },
  {
    files: extsToGlobs(EXT_ALL),
    rules: {
      ...eslintJs.configs.recommended.rules,
      ...standardRules,
      ...tsPlugin.configs['recommended-type-checked'].rules,
      ...tsPlugin.configs['stylistic-type-checked'].rules,
      ...overrideAll
    }
  },
  {
    files: extsToGlobs(EXT_JS),
    rules: {
      ...overrideJs
    }
  },
  {
    files: [
      '**/*.tsx',
      '**/use*.ts'
    ],
    plugins: {
      // eslint-plugin-react still calls context methods eslint 10 removed
      // (getFilename and others); the compat layer provides them.
      react: fixupPluginRules(reactPlugin),
      'react-hooks': reactHooksPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...overrideJsx
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: [
      '**/*.spec.ts',
      '**/*.spec.tsx'
    ],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    plugins: {
      jest: jestPlugin
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      ...overrideSpec
    },
    settings: {
      jest: {
        version: 27
      }
    }
  }
];
