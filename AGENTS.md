# AGENTS.md

Orillusion WebGPU 3D Engine (`@orillusion/core`)

## Build

```bash
npm install
npm run build        # tsc + vite build + type generation + minify
```

Build output goes to `dist/` (ES module + UMD).

Type check only:
```bash
npx tsc --p tsconfig.build.json --noEmit
```

## Test

Test dependencies and configs live in `test/`. Install separately:

```bash
cd test && npm install
```

Tests are split into two layers:

### 1. Unit Test (Vitest) — No WebGPU Required

Pure logic tests. Runs in headless Chromium via Vitest + `@vitest/browser-playwright`.
Works without WebGPU, can run anywhere.

```bash
npm test              # from root, delegates to test/
npm run test:unit
# or directly:
cd test && npx vitest run
```

- Config: `test/vitest.config.ts`
- Location: `test/unit/**/*.test.ts`
- Covers: math (Vector2/3/4, Matrix3/4, Quaternion, Ray, Plane, Triangle, Rect, UV, Color, Rand, HaltonSeq, Bezier2D, AnimationCurve, MatrixDO), EventSystem
- 18 files, 76 tests

### 2. Browser Test (Playwright) — WebGPU Required

GPU/rendering tests. Launches Chromium via Playwright, loads test modules through Vite dev server in iframes.

```bash
npm run test:browser
# or directly:
cd test && npx playwright test
```

- Config: `test/playwright.config.ts`
- Location: `test/browser/**/*.spec.ts`
- Vite server starts automatically (port 4000)
- Chromium launched with `--enable-unsafe-webgpu`, `--use-webgpu-adapter=swiftshader`, etc.
- Covers: WebGPU context, GPU buffers, Engine init, ECS, Component, Transform, Texture, Shaders, Lights, PostEffects
- 20 tests

Playwright browser tests reference the original test sources under `test/` (`test/gfx/`, `test/components/`, `test/shader/`, `test/base/`) via Vite. Do NOT delete `test/index.html`, `test/index.ts`, or `test/util.ts` — they are required by the browser test infrastructure.

### Run All

```bash
npm run test:ci       # vitest run && playwright test
```

### CI Notes

- Playwright browsers must be installed: `npx playwright install chromium`
- Automatically uses headless shell in headless environments
- Can run in headed mode if an X server is available

### Chromium Download Blocked (CDN 403)

If `npx playwright install chromium` fails with a 403 error (e.g. in sandboxed or restricted environments), you can reuse an older cached Playwright Chromium by symlinking it to the expected version path:

```bash
# Check which version is already cached
ls /root/.cache/ms-playwright/
# e.g. chromium_headless_shell-1194 exists but tests expect 1208

# Create the expected directory and symlink the binary
mkdir -p /root/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64
ln -s /root/.cache/ms-playwright/chromium_headless_shell-1194/chrome-linux/headless_shell \
      /root/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell
touch /root/.cache/ms-playwright/chromium_headless_shell-1208/INSTALLATION_COMPLETE
touch /root/.cache/ms-playwright/chromium_headless_shell-1208/DEPENDENCIES_VALIDATED
```

The exact revision numbers (e.g. 1194, 1208) and directory structure may change between Playwright versions. Check the error message for the expected path and `ls /root/.cache/ms-playwright/` for what's available.

## Source

`src/` — Engine source (to be documented)
