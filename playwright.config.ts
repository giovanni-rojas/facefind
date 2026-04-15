import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 60_000,
    expect: {
        timeout: 30_000,
    },
    retries: 1,
    use: {
        baseURL: 'https://giovanni-rojas.github.io/facefind/',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },
});