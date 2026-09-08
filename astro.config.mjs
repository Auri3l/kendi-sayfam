// @ts-check
import { defineConfig } from 'astro/config';
import process from 'node:process';

// https://astro.build/config
export default defineConfig({
  site: 'https://auri3l.github.io',
  base: process.env.SITE_BASE || '/kendi-sayfam',
  trailingSlash: 'always'
});
