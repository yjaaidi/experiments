import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    /* Angular's TestBed automatic tear down doesn't work without "vitest" globals
     * because Angular can't hook into vitest tear down.
     * In case you want to disable globals, you will have to add the following block to test-setup.ts:
     *
     * import { afterEach } from 'vitest';
     *
     * afterEach(() => {
     *  getTestBed().resetTestingModule();
     * });
     *
     * This also allows Jest & Vitest compatibility. */
    globals: true,
  },
});
