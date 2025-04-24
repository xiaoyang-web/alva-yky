import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  dts: true,
  minify: true,
  format: ['esm', 'cjs'],
  outDir: 'dist',
  platform: 'neutral'
});
