import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: false,
  dts: true,
  minify: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  platform: 'neutral'
});
