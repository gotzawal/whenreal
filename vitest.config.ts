import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
    resolve: {
        alias: {
            '@orillusion/core': resolve(__dirname, './src/index.ts'),
            '@orillusion': resolve(__dirname, './packages'),
        },
    },
    test: {
        include: ['test/unit/**/*.test.ts'],
        testTimeout: 30000,
        browser: {
            enabled: true,
            provider: playwright({
                launch: {
                    args: ['--no-sandbox'],
                },
            }),
            headless: true,
            instances: [
                { browser: 'chromium' },
            ],
        },
    },
})
