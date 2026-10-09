// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@pezkuwi/dev-test/globals.d.ts" />

import type { Linter } from 'eslint';

import { ESLint } from 'eslint';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// Loaded by path: the config directory is plain JavaScript outside this
// package's TypeScript root.
const PROCESSOR = path.join(process.cwd(), 'packages/dev/config/eslint.directives.js');

const SOURCE = `const a = 1;
// eslint-disable-next-line no-console
const b = 2;

function f () {
  // eslint-disable-next-line no-console
  return a + b;
}

f(); // eslint-disable-line no-console
/* eslint-disable-next-line no-console */ export const c = 3;
// eslint-disable-next-line no-alert, no-console
console.log(c);
`;

const FIXED = `const a = 1;
const b = 2;

function f () {
  return a + b;
}

f();
export const c = 3;
// eslint-disable-next-line no-console
console.log(c);
`;

async function fix (processor?: Linter.Processor): Promise<string> {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'directives-'));

  try {
    fs.writeFileSync(path.join(dir, 'sample.js'), SOURCE);

    const eslint = new ESLint({
      cwd: dir,
      fix: true,
      overrideConfig: [{
        files: ['**/*.js'],
        linterOptions: { reportUnusedDisableDirectives: 'error' },
        ...(processor ? { processor } : {}),
        rules: { 'no-alert': 'error', 'no-console': 'error' }
      }],
      overrideConfigFile: true
    });
    const [result] = await eslint.lintFiles(['sample.js']);

    return result.output ?? SOURCE;
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

describe('directiveLines', (): void => {
  it('removes an unused directive with its line or the space around it', async (): Promise<void> => {
    const { directiveLines } = await import(PROCESSOR) as { directiveLines: Linter.Processor };

    expect(await fix(directiveLines)).toEqual(FIXED);
  });

  it('is needed: core leaves a space where each comment was', async (): Promise<void> => {
    expect((await fix()).split('\n')).toEqual([
      'const a = 1;',
      ' ',
      'const b = 2;',
      '',
      'function f () {',
      '   ',
      '  return a + b;',
      '}',
      '',
      'f();  ',
      '  export const c = 3;',
      '// eslint-disable-next-line no-console',
      'console.log(c);',
      ''
    ]);
  });
});
