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
            sessionStorage.target = path
            document.body.appendChild(iframe)
        })
    }, testPath)

    return results
}

test('Engine init', async ({ page }) => {
    const results = await runTestModule(page, 'base/EngineInit.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('ECS', async ({ page }) => {
    const results = await runTestModule(page, 'components/ECS.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('Component', async ({ page }) => {
    const results = await runTestModule(page, 'components/Component.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('Transform', async ({ page }) => {
    const results = await runTestModule(page, 'components/Transform.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('Texture', async ({ page }) => {
    const results = await runTestModule(page, 'components/Texture.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('ComputeShader', async ({ page }) => {
    const results = await runTestModule(page, 'shader/ComputeShader.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('RenderShader', async ({ page }) => {
    const results = await runTestModule(page, 'shader/RenderShader.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('DirectionLight', async ({ page }) => {
    const results = await runTestModule(page, 'components/Light_DirectionLight.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('PointLight', async ({ page }) => {
    const results = await runTestModule(page, 'components/Light_PointLight.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('SpotLight', async ({ page }) => {
    const results = await runTestModule(page, 'components/Light_SpotLight.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('PostEffects GTAO', async ({ page }) => {
    const results = await runTestModule(page, 'components/PostEffects_GTAO.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('PostEffects GlobalFog', async ({ page }) => {
    const results = await runTestModule(page, 'components/PostEffects_GlobalFog.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('PostEffects HDRBloom', async ({ page }) => {
    const results = await runTestModule(page, 'components/PostEffects_HDRBloom.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('PostEffects SSR', async ({ page }) => {
    const results = await runTestModule(page, 'components/PostEffects_SSR.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})

test('PostEffects TAA', async ({ page }) => {
    const results = await runTestModule(page, 'components/PostEffects_TAA.test.ts')
    expect(results.fail).toBe(0)
    expect(results.success).toBeGreaterThan(0)
})
