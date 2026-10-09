// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

import JSON5 from 'json5';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const FIXME = {
  // This is in the new 6.0.0 and we should switch this on
  // at some point. For a first iteration we keep as-is
  '@typescript-eslint/prefer-nullish-coalescing': 'off'
};

/**
 * Returns a copyright header pattern (using tsconfig.base.json)
 *
 * @returns {string}
 */
function getHeaderPattern () {
  const tsPath = path.join(process.cwd(), 'tsconfig.base.json');

  if (!fs.existsSync(tsPath)) {
    throw new Error(`Unable to load ${tsPath}`);
  }

  const tsConfig = JSON5.parse(fs.readFileSync(tsPath, 'utf-8'));

  if (!tsConfig?.compilerOptions?.paths) {
    throw new Error(`Unable to extract compilerOptions.paths structure from ${tsPath}`);
  }

  const paths = Object.keys(tsConfig.compilerOptions.paths);

  if (!paths.length) {
    throw new Error(`No keys found in compilerOptions.paths from ${tsPath}`);
  }

  const packages = paths.reduce((packages, k) => {
    const [pd, pk] = k.split('/');

    if (pd !== '@pezkuwi' || !pk) {
      throw new Error(`Non @pezkuwi path in ${tsPath}`);
    }

    return packages.length
      ? `${packages}|${pk}`
      : pk;
  }, '');
  const fullyear = new Date().getFullYear();
  const years = [];

  for (let i = 17, last = fullyear - 2000; i < last; i++) {
    years.push(`${i}`);
  }

  return ` Copyright 20(${years.join('|')})(-${fullyear})? @pezkuwi/(${packages})( authors & contributors)?`;
}

export const overrideAll = {
  ...FIXME,
  '@stylistic/arrow-parens': ['error', 'always'],
  '@stylistic/brace-style': ['error', '1tbs'],
  '@stylistic/function-call-argument-newline': ['error', 'consistent'],
  '@stylistic/indent': ['error', 2],
  '@stylistic/no-extra-semi': 'error',
  '@stylistic/object-curly-newline': ['error', {
    ExportDeclaration: { minProperties: 2048 },
    ImportDeclaration: { minProperties: 2048 },
    ObjectPattern: { minProperties: 2048 }
  }],
  '@stylistic/padding-line-between-statements': [
    'error',
    { blankLine: 'always', next: '*', prev: ['const', 'let', 'var'] },
    { blankLine: 'any', next: ['const', 'let', 'var'], prev: ['const', 'let', 'var'] },
    { blankLine: 'always', next: 'block-like', prev: '*' },
    { blankLine: 'always', next: '*', prev: 'block-like' },
    { blankLine: 'always', next: 'function', prev: '*' },
    { blankLine: 'always', next: '*', prev: 'function' },
    { blankLine: 'always', next: 'try', prev: '*' },
    { blankLine: 'always', next: '*', prev: 'try' },
    { blankLine: 'always', next: 'return', prev: '*' },
    { blankLine: 'always', next: 'import', prev: '*' },
    { blankLine: 'always', next: '*', prev: 'import' },
    { blankLine: 'any', next: 'import', prev: 'import' }
  ],
  '@stylistic/semi': ['error', 'always'],
  '@stylistic/spaced-comment': ['error', 'always', {
    block: {
      // pure export helpers
      markers: ['#__PURE__']
    },
    line: {
      // TS reference types
      markers: ['/ <reference']
    }
  }],
  '@stylistic/type-annotation-spacing': 'error',
  // the next 2 enforce isolatedModules & verbatimModuleSyntax
  '@typescript-eslint/consistent-type-exports': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  '@typescript-eslint/dot-notation': 'error',
  '@typescript-eslint/no-deprecated': 'error',
  '@typescript-eslint/no-non-null-assertion': 'error',
  // standard's options for the core rule, which the TypeScript preset turns off
  // in favour of this one (with defaults that reject a && b() and a ? b() : c())
  '@typescript-eslint/no-unused-expressions': ['error', {
    allowShortCircuit: true,
    allowTaggedTemplates: true,
    allowTernary: true
  }],
  // ts itself checks and ignores those starting with _, align the linting
  '@typescript-eslint/no-unused-vars': ['error', {
    args: 'all',
    argsIgnorePattern: '^_',
    caughtErrors: 'all',
    caughtErrorsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    vars: 'all',
    varsIgnorePattern: '^_'
  }],
  curly: ['error', 'all'],
  'default-param-last': 'off', // conflicts with TS version
  'dot-notation': 'off', // conflicts with TS version
  'func-style': ['error', 'declaration', {
    allowArrowFunctions: true
  }],
  // this does help with declarations, but also
  // applies to invocations, which is an issue...
  // '@stylistic/function-paren-newline': ['error', 'never'],
  'header/header': ['error', 'line', [
    { pattern: getHeaderPattern() },
    ' SPDX-License-Identifier: Apache-2.0'
  ], 2],
  'import-newlines/enforce': ['error', {
    forceSingleLine: true,
    items: 2048
  }],
  'import-x/export': 'error',
  'import-x/extensions': ['error', 'ignorePackages', {
    cjs: 'always',
    js: 'always',
    json: 'always',
    jsx: 'never',
    mjs: 'always',
    ts: 'never',
    tsx: 'never'
  }],
  'import-x/first': 'error',
  'import-x/newline-after-import': 'error',
  'import-x/no-duplicates': 'error',
  'import-x/order': 'off', // conflicts with simple-import-sort
  'no-unused-vars': 'off',
  'no-use-before-define': 'off',
  'simple-import-sort/exports': 'error',
  'simple-import-sort/imports': ['error', {
    groups: [
      ['^\u0000'], // all side-effects (0 at start)
      ['\u0000$', '^@pezkuwi.*\u0000$', '^\\..*\u0000$'], // types (0 at end)
      // ['^node:'], // node
      ['^[^/\\.]'], // non-pezkuwi
      ['^@pezkuwi'], // pezkuwi
      ['^\\.\\.(?!/?$)', '^\\.\\./?$', '^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'] // local (. last)
    ]
  }],
  'sort-destructure-keys/sort-destructure-keys': ['error', {
    caseSensitive: true
  }],
  'sort-keys': 'error'
};

export const overrideJsx = {
  '@stylistic/jsx-closing-bracket-location': ['warn', 'tag-aligned'],
  '@stylistic/jsx-first-prop-new-line': ['warn', 'multiline-multiprop'],
  '@stylistic/jsx-max-props-per-line': ['warn', {
    maximum: 1,
    when: 'always'
  }],
  '@stylistic/jsx-newline': ['error', {
    prevent: true
  }],
  '@stylistic/jsx-props-no-multi-spaces': 'error',
  '@stylistic/jsx-quotes': ['error', 'prefer-single'],
  '@stylistic/jsx-sort-props': ['warn', {
    noSortAlphabetically: false
  }],
  '@stylistic/jsx-tag-spacing': ['error', {
    afterOpening: 'never',
    beforeClosing: 'never',
    beforeSelfClosing: 'always',
    closingSlash: 'never'
  }],
  // swap from recommended warning to error
  'react-hooks/exhaustive-deps': 'error',
  'react/jsx-fragments': 'error',
  'react/jsx-no-bind': 'error',
  'react/prop-types': 'off' // this is a completely broken rule
};

export const overrideJs = {
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-require-imports': 'off',
  '@typescript-eslint/no-unsafe-argument': 'off',
  '@typescript-eslint/no-unsafe-assignment': 'off',
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  '@typescript-eslint/no-unsafe-return': 'off',
  '@typescript-eslint/restrict-plus-operands': 'off',
  '@typescript-eslint/restrict-template-expressions': 'off'
};

export const overrideSpec = {
  // in the specs we are a little less worried about
  // specific correctness, i.e. we can have dangling bits
  '@typescript-eslint/no-unsafe-call': 'off',
  '@typescript-eslint/no-unsafe-member-access': 'off',
  'jest/expect-expect': ['warn', {
    assertFunctionNames: ['assert', 'expect']
  }]
};
