// Copyright 2017-2026 @pezkuwi/dev-test authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-var */

import type { expect } from './env/expect.js';
import type { jest } from './env/jest.js';
import type { lifecycle } from './env/lifecycle.js';
import type { Describe, It } from './env/suite.js';

type Expect = ReturnType<typeof expect>;

type Jest = ReturnType<typeof jest>;

type Lifecycle = ReturnType<typeof lifecycle>;

declare global {
  var after: Lifecycle['after'];
  var afterAll: Lifecycle['afterAll'];
  var afterEach: Lifecycle['afterEach'];
  var before: Lifecycle['before'];
  var beforeAll: Lifecycle['beforeAll'];
  var beforeEach: Lifecycle['beforeEach'];
  var describe: Describe;
  var expect: Expect['expect'];
  var it: It;
  var jest: Jest['jest'];
}

export {};
