// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://serafim.app',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
