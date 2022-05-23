import { ViteAngularPlugin } from '@nxext/angular-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  plugins: [
    ViteAngularPlugin({
      target: 'es2020',
    }),
  ],
  resolve: {
    preserveSymlinks: true,
  },
});