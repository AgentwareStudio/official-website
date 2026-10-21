import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Multi-page build: every page in every locale has its own HTML entry (written by tools/gen_html.py),
// so any static server (python -m http.server, nginx, GitHub Pages) can serve /ja/learn/ etc. directly.
const entries: string[] = JSON.parse(readFileSync(resolve(__dirname, 'tools/entries.json'), 'utf-8'));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(entries.map((e) => [e.replace(/\/?index\.html$|\.html$/, '').replace(/\//g, '_') || 'home', resolve(__dirname, e)])),
    },
  },
});
