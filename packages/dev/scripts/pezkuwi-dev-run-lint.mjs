#!/usr/bin/env node
// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

import process from 'node:process';
import yargs from 'yargs';

import { __dirname, execPm, GITHUB_REPO, logBin } from './util.mjs';

logBin('pezkuwi-dev-run-lint');

// Since yargs can also be a promise, we just relax the type here completely
const argv = await yargs(process.argv.slice(2))
  .options({
    'skip-eslint': {
      description: 'Skips running eslint',
      type: 'boolean'
    },
    'skip-tsc': {
      description: 'Skips running tsc',
      type: 'boolean'
    }
  })
  .strict()
  .argv;

if (!argv['skip-eslint']) {
  // We don't want to run with fix on CI
  const extra = GITHUB_REPO
    ? ''
    : '--fix';

  execPm(`pezkuwi-exec-eslint ${extra} ${process.cwd()}`);
}

if (!argv['skip-tsc']) {
  // The root tsconfig.build.json has `files: []` and only references the
  // packages, so `tsc --project` on it checks no file at all. --build follows
  // the references; it cannot be combined with --noEmit, so it writes the
  // declarations the build would. Previous build output is removed first, since
  // package configs without an `include` would otherwise pick it up as source.
  execPm('pezkuwi-dev-clean-build');
  execPm('pezkuwi-exec-tsc --build tsconfig.build.json --pretty');
}
