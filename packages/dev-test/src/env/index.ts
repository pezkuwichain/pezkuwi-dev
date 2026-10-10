// Copyright 2017-2026 @pezkuwi/dev-test authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { browser, BROWSER_OVERRIDES } from './browser.js';
import { expect } from './expect.js';
import { jest } from './jest.js';
import { lifecycle } from './lifecycle.js';
import { suite } from './suite.js';

/**
 * Exposes the jest-y environment via globals.
 */
export function exposeEnv (isBrowser: boolean): void {
  [expect, jest, lifecycle, suite, isBrowser && browser].forEach((env) => {
    env && Object
      .entries(env())
      .forEach(([key, fn]) => {
        if (isBrowser && BROWSER_OVERRIDES.includes(key)) {
          (globalThis as Record<string, unknown>)[key] = fn;
        } else {
          globalThis[key as 'undefined'] ??= fn;
        }
      });
  });
}
