// Copyright 2017-2026 @pezkuwi/dev-test authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createHash } from 'node:crypto';
import { createServer } from 'node:http';

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

  it('opens a WebSocket and exchanges a message', async () => {
    // the smallest server that completes the RFC 6455 handshake and sends one text frame
    const server = createServer();
    // an upgraded socket leaves the server's tracking, so it is closed here
    const sockets: { destroy: () => void }[] = [];

    server.on('upgrade', (req, socket) => {
      sockets.push(socket);

      const accept = createHash('sha1')
        .update(`${String(req.headers['sec-websocket-key'])}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
        .digest('base64');

      socket.write(`HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`);
      socket.write(Buffer.from([0x81, 0x02, 0x68, 0x69]));
    });

    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));

    const { port } = server.address() as { port: number };
    const ws = new WebSocket(`ws://127.0.0.1:${port}`);

    try {
      const received = await new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('no message within 5s')), 5_000);

        ws.onmessage = (event) => {
          clearTimeout(timer);
          resolve(String(event.data));
        };

        ws.onerror = () => {
          clearTimeout(timer);
          reject(new Error('WebSocket error'));
        };
      });

      expect(received).toBe('hi');
    } finally {
      ws.close();
      sockets.forEach((socket) => socket.destroy());
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
