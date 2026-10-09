// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

const RULE = 'no-unnecessary-type-assertion';
const ASSERTIONS = ['TSAsExpression', 'TSTypeAssertion'];

/**
 * typescript-eslint 8 added a second check to no-unnecessary-type-assertion:
 * an `x as T` is reported as unnecessary when the place it is passed to would
 * accept `x` as it is ("the receiver accepts the original type"), and the
 * autofix deletes the assertion. That is unsound when the assertion also
 * drives inference around it: in
 *
 *   const { validators } = found || { validators: {} as ValPoints };
 *
 * deleting `as ValPoints` leaves `validators` typed `{}`, and every use of it
 * after that is an unresolved type. It also deletes assertions kept on
 * purpose for another environment's typings (a Ledger transport under
 * esm.sh). Measured across the consumers before this was added: 45 such
 * reports, the first of them breaking the types of api-derive.
 *
 * This keeps the rule as it was before that check: an assertion to the type
 * the expression already has is still reported and fixed, and so are non-null
 * assertions the receiver makes unnecessary. Only the contextual report on
 * `as` / `<T>` assertions is dropped.
 *
 * @template {object} P
 * @param {P} plugin the @typescript-eslint plugin
 * @returns {P}
 */
export function withoutContextualAssertions (plugin) {
  const rules = /** @type {Record<string, import('eslint').Rule.RuleModule>} */ (/** @type {{ rules: unknown }} */ (plugin).rules);
  const rule = rules[RULE];

  return /** @type {P} */ ({
    ...plugin,
    rules: {
      ...rules,
      [RULE]: {
        ...rule,
        /** @param {import('eslint').Rule.RuleContext} context */
        create (context) {
          const filtered = Object.create(context, {
            report: {
              value: (/** @type {import('eslint').Rule.ReportDescriptor} */ descriptor) => {
                if (
                  'messageId' in descriptor &&
                  descriptor.messageId === 'contextuallyUnnecessary' &&
                  'node' in descriptor &&
                  ASSERTIONS.includes(descriptor.node.type)
                ) {
                  return;
                }

                context.report(descriptor);
              }
            }
          });

          return rule.create(filtered);
        }
      }
    }
  });
}
