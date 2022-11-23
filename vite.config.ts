import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  resolve: {
    /* @angular/material is using "style" as a Custom Conditional Cxport to expose prebuilt styles etc... */
    conditions: ['style'],
  },
});
