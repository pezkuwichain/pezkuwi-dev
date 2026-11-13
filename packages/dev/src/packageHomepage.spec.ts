// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@pezkuwi/dev-test/globals.d.ts" />

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const UTIL = pathToFileURL(path.join(process.cwd(), 'packages/dev/scripts/util.mjs')).href;
const REPO = 'https://git.example.org/owner/repo';

// util.mjs is plain ESM outside the TypeScript build, so it is called the way
// pezkuwi-dev-build-ts calls it: from node.
function homepage (dir: string | null, current?: string): string {
  const code = `import { packageHomepage } from ${JSON.stringify(UTIL)};
process.stdout.write(packageHomepage(${JSON.stringify(REPO)}, ${JSON.stringify(dir)}, ${current === undefined ? 'undefined' : JSON.stringify(current)}));`;

  return execFileSync(process.execPath, ['--input-type=module', '-e', code], { encoding: 'utf8' });
}

describe('packageHomepage', (): void => {
  it('derives the homepage when there is none', (): void => {
    expect(homepage('api')).toBe(`${REPO}/tree/master/packages/api#readme`);
    expect(homepage(null)).toBe(`${REPO}#readme`);
  });

  it('rewrites a homepage inside the repository', (): void => {
    expect(homepage('api', `${REPO}/tree/main/packages/api#readme`)).toBe(`${REPO}/tree/master/packages/api#readme`);
    expect(homepage(null, `${REPO}#readme`)).toBe(`${REPO}#readme`);
    expect(homepage(null, REPO)).toBe(`${REPO}#readme`);
  });

  it('keeps a homepage outside the repository', (): void => {
    expect(homepage('api', 'https://developers.example.org/modules/api.html')).toBe('https://developers.example.org/modules/api.html');
    expect(homepage(null, 'https://developers.example.org/')).toBe('https://developers.example.org/');
  });

  it('does not take a sibling repository for this one', (): void => {
    expect(homepage('api', `${REPO}-docs`)).toBe(`${REPO}-docs`);
  });
});
