// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

const RULE = 'consistent-type-exports';

/**
 * consistent-type-exports reports an `export * from './x'` whose module only
 * exports types, and its autofix turns it into `export type * from './x'`.
 * That changes what runs: `export *` loads the module, `export type *` is
 * erased, so a module that only exports types but registers something when it
 * loads (a Handlebars partial, an interface augmentation) silently stops being
 * loaded. Measured on the consumers: the api typegen lost its `docs` partial
 * this way and the build failed only at template time.
 *
 * Named re-exports do not have this problem: under verbatimModuleSyntax a
 * type re-exported without `type` is already a compile error (TS1205).
 *
 * This keeps the report as it is and moves the `export *` fix into a
 * suggestion, so --fix no longer applies it and an editor still offers it.
 * Whoever accepts it decides whether the module needs a side-effect import.
 *
 * @template {object} P
 * @param {P} plugin the @typescript-eslint plugin
 * @returns {P}
 */
export function withoutExportAllFix (plugin) {
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
                if ('node' in descriptor && descriptor.node.type === 'ExportAllDeclaration' && descriptor.fix) {
                  const { fix, ...rest } = descriptor;

                  context.report({
                    ...rest,
                    suggest: [{ desc: 'Use `export type *` (the module is no longer loaded: add a side-effect import if it registers anything)', fix }]
                  });

                  return;
                }

                context.report(descriptor);
              }
            }
          });

          return rule.create(filtered);
        },
        meta: { ...rule.meta, hasSuggestions: true }
      }
    }
  });
}
