import { defineConfig } from 'vite';
import swc from 'unplugin-swc';
import { swcAngularUnpluginOptions } from '@jscutlery/swc-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/whiskmate',

  plugins: [
    swc.vite(swcAngularUnpluginOptions()),
    nxViteTsPaths(),
    nxCopyAssetsPlugin(['*.md']),
  ],
});
