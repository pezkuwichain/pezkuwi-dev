// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@pezkuwi/dev-test/globals.d.ts" />

import type { ESLint as ESLintType } from 'eslint';

import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { ESLint } from 'eslint';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Loaded by path: the config directory is plain JavaScript outside this
// package's TypeScript root.
const WRAPPER = path.join(process.cwd(), 'packages/dev/config/eslint.typeAssertion.js');

const SOURCE = `interface ValPoints { [id: string]: number }

declare const found: { validators: ValPoints } | undefined;
declare const text: string;
declare function take (value: string): void;

// contextual: the assertion types \`validators\` below
const { validators } = found || { validators: {} as ValPoints };

export const first = validators['a'];

// unchanged: the expression already has this type
export const same = text as string;

let target: string | undefined;

// contextual non-null: assigning to it needs no assertion
target! = text;

take(target ?? '');
`;

async function lint (plugin: ESLintType.Plugin): Promise<string[]> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'type-assertion-'));

  try {
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true, target: 'es2022' }, include: ['*.ts'] }));
    fs.writeFileSync(path.join(dir, 'sample.ts'), SOURCE);

    const eslint = new ESLint({
      cwd: dir,
      overrideConfig: [{
        files: ['**/*.ts'],
        languageOptions: {
          parser: tsParser,
          parserOptions: { project: './tsconfig.json', tsconfigRootDir: dir }
        },
        plugins: { '@typescript-eslint': plugin },
        rules: { '@typescript-eslint/no-unnecessary-type-assertion': 'error' }
      }],
      overrideConfigFile: true
    });
    const [result] = await eslint.lintFiles(['sample.ts']);

    return result.messages.map(({ line, messageId }) => `${line}:${messageId ?? ''}`);
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

describe('withoutContextualAssertions', (): void => {
  it('drops the contextual report on an assertion, keeps the others', async (): Promise<void> => {
    const { withoutContextualAssertions } = await import(WRAPPER) as { withoutContextualAssertions: (p: ESLintType.Plugin) => ESLintType.Plugin };

    expect(await lint(withoutContextualAssertions(tsPlugin as unknown as ESLintType.Plugin))).toEqual([
      '13:unnecessaryAssertion',
      '18:contextuallyUnnecessary'
    ]);
  });

  it('is needed: the plugin as published reports the assertion that types validators', async (): Promise<void> => {
    expect(await lint(tsPlugin as unknown as ESLintType.Plugin)).toEqual([
      '8:contextuallyUnnecessary',
      '13:unnecessaryAssertion',
      '18:contextuallyUnnecessary'
    ]);
  });
});
