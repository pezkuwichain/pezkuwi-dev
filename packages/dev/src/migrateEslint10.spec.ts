// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@pezkuwi/dev-test/globals.d.ts" />

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SCRIPT = path.join(process.cwd(), 'packages/dev/scripts/pezkuwi-dev-migrate-eslint10.mjs');

// Spelt so that the tool, run on this repository, does not rewrite its own
// fixture: the source never contains the directive it is testing.
const D = 'eslint-' + 'disable';

const BEFORE = `/* ${D} quotes */
/* ${D} quote-props */
// ${D}-next-line deprecation/deprecation
// ${D}-next-line import/export -- types and values share the name
// ${D}-next-line @typescript-eslint/no-empty-interface,no-use-before-define
// ${D}-next-line indent, @typescript-eslint/indent
// ${D}-next-line react/jsx-max-props-per-line
const header = '/* ${D} quotes */';
/* ${D} */
// ${D}-next-line @typescript-eslint/no-explicit-any
`;

const AFTER = `/* eslint-disable @stylistic/quotes */
/* eslint-disable @stylistic/quote-props */
// eslint-disable-next-line @typescript-eslint/no-deprecated
// eslint-disable-next-line import-x/export -- types and values share the name
// eslint-disable-next-line @typescript-eslint/no-empty-object-type, no-use-before-define
// eslint-disable-next-line @stylistic/indent
// eslint-disable-next-line @stylistic/jsx-max-props-per-line
const header = '/* eslint-disable @stylistic/quotes */';
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
`;

function inRepo (content: string, args: string[] = []): { out: string; code: number; file: string } {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'migrate-eslint10-'));
  const file = path.join(dir, 'sample.ts');

  try {
    fs.writeFileSync(file, content);
    execFileSync('git', ['init', '-q'], { cwd: dir });
    execFileSync('git', ['add', 'sample.ts'], { cwd: dir });

    let code = 0;
    let out = '';

    try {
      out = execFileSync(process.execPath, [SCRIPT, ...args], { cwd: dir, encoding: 'utf-8' });
    } catch (error) {
      code = (error as { status: number }).status;
      out = (error as { stdout: string }).stdout;
    }

    return { code, file: fs.readFileSync(file, 'utf-8'), out };
  } finally {
    fs.rmSync(dir, { force: true, recursive: true });
  }
}

describe('pezkuwi-dev-migrate-eslint10', (): void => {
  it('renames rules in disable comments, and in strings that emit them', (): void => {
    const { file, out } = inRepo(BEFORE);

    expect(file).toEqual(AFTER);
    expect(out.includes('rewrote 8 directive(s) in 1 file(s)')).toEqual(true);
  });

  it('leaves current rule names and bare disables alone', (): void => {
    const { file, out } = inRepo(AFTER);

    expect(file).toEqual(AFTER);
    expect(out.includes('rewrote 0 directive(s) in 0 file(s)')).toEqual(true);
  });

  it('--check reports and changes nothing, exiting 1 when there is work', (): void => {
    const { code, file } = inRepo(BEFORE, ['--check']);

    expect(file).toEqual(BEFORE);
    expect(code).toEqual(1);
  });
});
