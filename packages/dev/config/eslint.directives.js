// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

/** @type {Map<string, string>} */
const sources = new Map();

/**
 * Widens the fix eslint core gives an unused disable directive.
 *
 * Core removes only the comment and puts a single space in its place
 * (lib/linter/apply-disable-directives.js), so --fix turns
 *
 *   const a = 1;
 *   // eslint-disable-next-line no-console
 *   const b = 2;
 *
 * into a whitespace-only line between the two statements, which the layout
 * rules then leave behind as a blank line. Measured on the consumers after the
 * eslint 10 move: 23 such lines in api alone, each removed by hand.
 *
 * Only a fix that removes a whole directive comment is changed: alone on its
 * line, the line goes; after code, the space before it goes; before code, the
 * space after it goes. Removing one rule name out of several is left as core
 * makes it, as is every message with a rule id.
 *
 * @param {import('eslint').Linter.LintMessage} message
 * @param {string} text the source the message was produced from
 * @returns {import('eslint').Linter.LintMessage}
 */
function widenDirectiveFix (message, text) {
  if (message.ruleId !== null || message.fix?.text.trim() !== '') {
    return message;
  }

  let [start, end] = message.fix.range;

  if (!/^\/[/*]/.test(text.slice(start, end))) {
    return message;
  }

  const lineStart = text.lastIndexOf('\n', start - 1) + 1;
  const newline = text.indexOf('\n', end);
  const lineEnd = newline === -1 ? text.length : newline;
  const aloneBefore = text.slice(lineStart, start).trim() === '';
  const aloneAfter = text.slice(end, lineEnd).trim() === '';

  if (aloneBefore && aloneAfter) {
    return { ...message, fix: { range: [lineStart, newline === -1 ? text.length : newline + 1], text: '' } };
  } else if (aloneBefore) {
    while (end < lineEnd && /[ \t]/.test(text[end] ?? '')) {
      end++;
    }
  } else {
    while (start > lineStart && /[ \t]/.test(text[start - 1] ?? '')) {
      start--;
    }
  }

  return { ...message, fix: { range: [start, end], text: '' } };
}

/** @type {import('eslint').Linter.Processor} */
export const directiveLines = {
  meta: { name: '@pezkuwi/dev/directive-lines' },
  postprocess (lists, filename) {
    const text = sources.get(filename) ?? '';

    sources.delete(filename);

    return lists.flat().map((m) => widenDirectiveFix(m, text));
  },
  preprocess (text, filename) {
    sources.set(filename, text);

    return [text];
  },
  supportsAutofix: true
};
