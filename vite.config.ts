import { defineConfig } from 'vite';
import { ViteAngularPlugin } from '@nxext/angular/plugins/vite-plugin-angular';

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