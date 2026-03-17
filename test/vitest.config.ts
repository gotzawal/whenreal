import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import { playwright } from '@vitest/browser-playwright'

const root = resolve(__dirname, '..')

export default defineConfig({
    resolve: {
        alias: {
            '@orillusion/core': resolve(root, './src/index.ts'),
            '@orillusion': resolve(root, './packages'),
        },
    },
    test: {
        include: ['unit/**/*.test.ts'],
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
