// Copyright 2017-2026 @pezkuwi/dev-test authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { mock } from 'node:test';

describe('mock.module', () => {
  it('replaces a module loaded after the mock is registered', async () => {
    mock.module('node:os', { namedExports: { platform: () => 'mocked' } });

    const { platform } = await import('node:os');

    expect(platform()).toBe('mocked');
  });
});
