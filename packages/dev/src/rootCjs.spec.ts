// Copyright 2017-2026 @pezkuwi/dev authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type * as testRoot from './root.js';

// NOTE We don't use ts-expect-error here since the build folder may or may
// not exist (so the error may or may not be there)
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore This should only run against the compiled ouput, where this should exist
import testRootBuild from '../build/cjs/root.js';
import { runTests } from './rootTests.js';

/**
 * The CommonJS build is untyped until it is built, and lint runs both before
 * and after the build. Casting from unknown here is needed either way, so the
 * outcome does not depend on whether build/ exists.
 */
function asRoot (build: unknown): typeof testRoot {
  return build as typeof testRoot;
}

runTests(asRoot(testRootBuild));
