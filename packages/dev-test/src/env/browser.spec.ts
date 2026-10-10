// Copyright 2017-2026 @pezkuwi/dev-test authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { browser } from './browser.js';

const all = browser();

describe('browser', () => {
  it('contains window', () => {
    expect(all.window).toBeDefined();
  });

  it('contains a crypto implementation', () => {
    expect(all.crypto).toBeTruthy();
    expect(typeof all.crypto.getRandomValues).toBe('function');
  });

  it('contains the top-level objects', () => {
    expect(all.document).toBeDefined();
    expect(all.navigator).toBeDefined();
  });

  it('contains HTML*Element', () => {
    expect(typeof all.HTMLElement).toBe('function');
  });

  it('contains the DOM node hierarchy', () => {
    const div = document.createElement('div');

    expect(div).toBeInstanceOf(Element);
    expect(div).toBeInstanceOf(Node);
    expect(document.createTextNode('text')).toBeInstanceOf(Text);
    expect(document.createDocumentFragment()).toBeInstanceOf(DocumentFragment);
    expect(document.createElementNS('http://www.w3.org/2000/svg', 'svg')).toBeInstanceOf(SVGElement);
    expect(div.attachShadow({ mode: 'open' })).toBeInstanceOf(ShadowRoot);
    expect(document).toBeInstanceOf(Document);
  });

  it('contains the UI event constructors', () => {
    const div = document.createElement('div');

    expect(() => div.dispatchEvent(new MouseEvent('click'))).not.toThrow();
    expect(() => div.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))).not.toThrow();
    expect(new FocusEvent('focus')).toBeInstanceOf(UIEvent);
  });

  it('contains getComputedStyle and the observers', () => {
    const div = document.createElement('div');

    div.style.display = 'none';
    document.body.appendChild(div);

    expect(getComputedStyle(div).display).toBe('none');
    expect(() => new MutationObserver(() => undefined).observe(div, { childList: true })).not.toThrow();
    expect(() => new ResizeObserver(() => undefined).observe(div)).not.toThrow();

    div.remove();
  });

  it('dispatches the global CustomEvent and Event on window', () => {
    expect(() => window.dispatchEvent(new CustomEvent('custom', { detail: 1 }))).not.toThrow();
    expect(() => window.dispatchEvent(new Event('plain'))).not.toThrow();
  });
});
