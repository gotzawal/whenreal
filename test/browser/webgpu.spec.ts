import { test, expect } from '@playwright/test'

// Helper to run a test module in an iframe and collect results
async function runTestModule(page: any, testPath: string) {
    await page.goto('/test/')

    const results = await page.evaluate(async (path: string) => {
        return new Promise<{ success: number; fail: number; errors: string[] }>((resolve) => {
            const iframe = document.createElement('iframe')
            iframe.style.width = '400px'
            iframe.style.height = '350px'
            iframe.srcdoc = `
                <style>html,body{margin:0;padding:0;overflow:hidden}canvas{touch-action:none}</style>
                <script type="module">
                    window.addEventListener('error', e => {
                        window.parent.postMessage({ type: 'error', message: e.message }, '*')
                    })
                </script>
                <script type="module" src="/test/${path}"></script>
            `
            const errors: string[] = []
            window.addEventListener('message', (e) => {
                if (e.data.type === 'end') {
                    resolve({ success: e.data.success, fail: e.data.fail, errors })
                } else if (e.data.type === 'error') {
                    errors.push(e.data.message)
                }
            })
            // Set required sessionStorage for test util
            sessionStorage.target = path
            document.body.appendChild(iframe)
        })
    }, testPath)

    return results
}

test('WebGPU context initialization', async ({ page }) => {
    const results = await runTestModule(page, 'gfx/WebgpuContext.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('GPU context', async ({ page }) => {
    const results = await runTestModule(page, 'gfx/GPUContext.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('Compute GPU buffer', async ({ page }) => {
    const results = await runTestModule(page, 'gfx/ComputeGPUBuffer.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('Storage GPU buffer', async ({ page }) => {
    const results = await runTestModule(page, 'gfx/StorageGPUBuffer.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('Struct GPU buffer', async ({ page }) => {
    const results = await runTestModule(page, 'gfx/StructGPUBuffer.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})
