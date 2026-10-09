#!/usr/bin/env node
// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Renames rules in eslint-disable / eslint-enable comments for the 0.86
// toolchain (eslint 10, typescript-eslint 8, @stylistic, import-x).
//
// A disable comment that names a rule which no longer exists under that name
// disables nothing: eslint reports it as unused and `--fix` deletes it, after
// which the rule it was meant to silence applies. Run this before the first
// lint on 0.86, in the repository root:
//
//   pezkuwi-dev-migrate-eslint10           # rewrite tracked files
//   pezkuwi-dev-migrate-eslint10 --check   # report, change nothing (exit 1 if anything would change)
//
// It also rewrites such comments inside string literals, which is how code
// generators emit them, and the rule keys of the repository's own
// eslint.config.* ('import/extensions': 'off'). A rule that became several
// is reported for a hand edit there, and the tool then exits 1.

import stylisticPlugin from '@stylistic/eslint-plugin';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import importPlugin from 'eslint-plugin-import-x';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const STYLISTIC = new Set(Object.keys(stylisticPlugin.rules));
const IMPORT_X = new Set(Object.keys(importPlugin.rules));

/** @type {Map<string, string[]>} */
const RENAME = new Map();

// Core rules eslint 10 deprecated, with the successor it names itself. The
// rule metadata (meta.deprecated.replacedBy) is only exposed here, so this
// reads it rather than keeping a hand-written copy that could drift.
// eslint-disable-next-line @typescript-eslint/no-deprecated
for (const [name, rule] of builtinRules) {
  const replacedBy = rule.meta?.deprecated && typeof rule.meta.deprecated === 'object'
    ? rule.meta.deprecated.replacedBy
    : undefined;

  if (replacedBy?.length === 1) {
    const [{ plugin, rule: next }] = replacedBy;

    if (next?.name) {
      RENAME.set(name, [plugin?.name === '@stylistic/eslint-plugin' ? `@stylistic/${next.name}` : next.name]);
    }
  }
}

// typescript-eslint 8 removed its formatting rules; they live in @stylistic.
for (const name of ['block-spacing', 'brace-style', 'comma-dangle', 'comma-spacing', 'func-call-spacing', 'indent', 'key-spacing', 'keyword-spacing', 'lines-around-comment', 'lines-between-class-members', 'member-delimiter-style', 'no-extra-parens', 'no-extra-semi', 'object-curly-spacing', 'padding-line-between-statements', 'quotes', 'semi', 'space-before-blocks', 'space-before-function-paren', 'space-infix-ops', 'type-annotation-spacing']) {
  const next = name === 'func-call-spacing' ? 'function-call-spacing' : name;

  if (STYLISTIC.has(next)) {
    RENAME.set(`@typescript-eslint/${name}`, [`@stylistic/${next}`]);
  }
}

// Other typescript-eslint 8 removals and renames.
RENAME.set('@typescript-eslint/ban-types', ['@typescript-eslint/no-empty-object-type', '@typescript-eslint/no-unsafe-function-type', '@typescript-eslint/no-wrapper-object-types']);
RENAME.set('@typescript-eslint/no-empty-interface', ['@typescript-eslint/no-empty-object-type']);
RENAME.set('@typescript-eslint/no-loss-of-precision', ['no-loss-of-precision']);
RENAME.set('@typescript-eslint/no-throw-literal', ['@typescript-eslint/only-throw-error']);
RENAME.set('@typescript-eslint/no-var-requires', ['@typescript-eslint/no-require-imports']);
RENAME.set('deprecation/deprecation', ['@typescript-eslint/no-deprecated']);

// The react formatting rules config/eslint.rules.js (overrideJsx) now takes
// from @stylistic; keep this list in step with it. (The config is not
// imported here: loading it reads the repository's tsconfig.base.json.)
for (const name of ['jsx-closing-bracket-location', 'jsx-first-prop-new-line', 'jsx-max-props-per-line', 'jsx-newline', 'jsx-props-no-multi-spaces', 'jsx-sort-props', 'jsx-tag-spacing']) {
  if (STYLISTIC.has(name)) {
    RENAME.set(`react/${name}`, [`@stylistic/${name}`]);
  }
}

/**
 * @param {string} name
 * @returns {string[]}
 */
function rename (name) {
  if (RENAME.has(name)) {
    return /** @type {string[]} */ (RENAME.get(name));
  } else if (name.startsWith('import/') && IMPORT_X.has(name.slice(7))) {
    return [`import-x/${name.slice(7)}`];
  }

  return [name];
}

// eslint-disable, eslint-disable-line, eslint-disable-next-line, eslint-enable
// followed by a rule list, optionally ending in `-- description`.
const DIRECTIVE = /(eslint-(?:disable(?:-next-line|-line)?|enable))([ \t]+)([^\n*'"`]*?)([ \t]*(?:--[^\n*]*)?)(?=\*\/|\n|$|['"`])/g;

const files = execFileSync('git', ['ls-files', '-z', '--', '*.ts', '*.tsx', '*.js', '*.jsx', '*.mjs', '*.cjs', '*.cts', '*.mts'], { encoding: 'utf-8' })
  .split('\0')
  .filter((f) => f && !/(^|\/)(node_modules|build|build-[^/]+)\//.test(f));
const check = process.argv.includes('--check');
let changedFiles = 0;
let changedComments = 0;
let changedKeys = 0;
/** @type {string[]} */
const manual = [];

// Rule keys in a repository's own eslint config ('import/extensions': 'off'),
// quoted or not. Only in eslint.config.* files, where such a key is a rule.
const CONFIG_FILE = /(^|\/)eslint\.config\.[cm]?[jt]s$/;
const CONFIG_KEY = /(^|[{,\s])(['"]?)([@a-z][\w@/-]*)\2(\s*:)/g;

/**
 * @param {string} file
 * @param {string} src
 * @returns {string}
 */
function renameConfigKeys (file, src) {
  return src.replace(CONFIG_KEY, (/** @type {string} */ all, /** @type {string} */ pre, /** @type {string} */ _quote, /** @type {string} */ name, /** @type {string} */ colon) => {
    const next = rename(name);

    if (next.length === 1 && next[0] === name) {
      return all;
    } else if (next.length !== 1) {
      // one rule became several: the value has to be repeated for each, by hand
      manual.push(`${file}: '${name}' is now ${next.join(', ')}`);

      return all;
    }

    changedKeys++;

    return `${pre}'${next[0]}'${colon}`;
  });
}

for (const file of files) {
  const src = fs.readFileSync(file, 'utf-8');
  const out = src.replace(DIRECTIVE, (/** @type {string} */ all, /** @type {string} */ kind, /** @type {string} */ gap, /** @type {string} */ list, /** @type {string} */ tail) => {
    if (!list.trim()) {
      return all;
    }

    const names = list.split(',').map((n) => n.trim()).filter(Boolean);
    const next = [...new Set(names.flatMap(rename))];

    if (next.join(',') === names.join(',')) {
      return all;
    }

    changedComments++;

    return `${kind}${gap}${next.join(', ')}${tail}`;
  });

  const outKeys = CONFIG_FILE.test(file)
    ? renameConfigKeys(file, out)
    : out;

  if (outKeys !== src) {
    changedFiles++;

    if (check) {
      console.log(`would change: ${file}`);
    } else {
      fs.writeFileSync(file, outKeys);
    }
  }
}

for (const line of manual) {
  console.log(`by hand: ${line}`);
}

console.log(`${check ? 'would rewrite' : 'rewrote'} ${changedComments} directive(s) and ${changedKeys} config key(s) in ${changedFiles} file(s)`);

if ((check && changedFiles) || manual.length) {
  process.exit(1);
}
