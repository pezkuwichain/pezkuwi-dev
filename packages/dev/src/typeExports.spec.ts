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
const WRAPPER = path.join(process.cwd(), 'packages/dev/config/eslint.typeExports.js');

// only types, but loading it has an effect the importer relies on
const TYPES = `export interface Partial { name: string }

(globalThis as Record<string, unknown>)['registered'] = true;
`;

const SOURCE = `export * from './types.js';
`;

interface Result { fixed: string; messages: { fix: boolean; line: number; messageId: string; suggestions: number }[] }

async function lint (plugin: ESLintType.Plugin): Promise<Result> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'type-exports-'));

  try {
    fs.writeFileSync(path.join(dir, 'tsconfig.json'), JSON.stringify({ compilerOptions: { module: 'esnext', moduleResolution: 'bundler', strict: true, target: 'es2022' }, include: ['*.ts'] }));
    fs.writeFileSync(path.join(dir, 'types.ts'), TYPES);
    fs.writeFileSync(path.join(dir, 'index.ts'), SOURCE);

    const options = (fix: boolean): ESLintType.Options => ({
      cwd: dir,
      fix,
      overrideConfig: [{
        files: ['**/*.ts'],
        languageOptions: {
          parser: tsParser,
          parserOptions: { project: './tsconfig.json', tsconfigRootDir: dir }
        },
        plugins: { '@typescript-eslint': plugin },
        rules: { '@typescript-eslint/consistent-type-exports': 'error' }
      }],
      overrideConfigFile: true
    });
    const [reported] = await new ESLint(options(false)).lintFiles(['index.ts']);
    const [fixed] = await new ESLint(options(true)).lintFiles(['index.ts']);

    return {
      fixed: fixed.output ?? SOURCE,
      messages: reported.messages.map(({ fix, line, messageId, suggestions }) => ({ fix: !!fix, line, messageId: messageId ?? '', suggestions: suggestions?.length ?? 0 }))
    };
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

describe('withoutExportAllFix', (): void => {
  it('keeps the report on a types-only export *, offers the change only as a suggestion', async (): Promise<void> => {
    const { withoutExportAllFix } = await import(WRAPPER) as { withoutExportAllFix: (p: ESLintType.Plugin) => ESLintType.Plugin };

    expect(await lint(withoutExportAllFix(tsPlugin as unknown as ESLintType.Plugin))).toEqual({
      fixed: SOURCE,
      messages: [{ fix: false, line: 1, messageId: 'typeOverValue', suggestions: 1 }]
    });
  });

  it('is needed: the plugin as published rewrites it to export type *, which no longer loads the module', async (): Promise<void> => {
    expect(await lint(tsPlugin as unknown as ESLintType.Plugin)).toEqual({
      fixed: "export type * from './types.js';\n",
      messages: [{ fix: true, line: 1, messageId: 'typeOverValue', suggestions: 0 }]
    });
  });
});
