import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
    testDir: './test/browser',
    timeout: 60000,
    retries: 0,
    use: {
        baseURL: 'http://localhost:4000',
    },
    webServer: {
        command: 'npx vite --port 4000 --strictPort',
        port: 4000,
        reuseExistingServer: true,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    args: [
                        '--enable-unsafe-webgpu',
                        '--enable-features=Vulkan',
                        '--use-vulkan=swiftshader',
                        '--use-webgpu-adapter=swiftshader',
                        '--no-sandbox',
                    ],
                },
            },
        },
    ],
})
