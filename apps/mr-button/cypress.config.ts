import { defineConfig } from 'cypress';
import { nxComponentTestingPreset } from '@nrwl/angular/plugins/component-testing';

export default defineConfig({
  component: nxComponentTestingPreset(__filename),
  viewportHeight: 720,
  viewportWidth: 1280,
});
