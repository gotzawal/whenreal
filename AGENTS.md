# CLAUDE.md

Orillusion WebGPU 3D Engine (`@orillusion/core`)

## Build

```bash
npm install
npm run build        # tsc + vite build + type generation + minify
```

빌드 결과물은 `dist/`에 생성됨 (ES module + UMD).

타입 체크만 할 경우:
```bash
npx tsc --p tsconfig.build.json --noEmit
```

## Test

테스트는 두 계층으로 나뉜다:

### 1. Unit Test (Vitest) — WebGPU 불필요

순수 로직 테스트. Vitest + `@vitest/browser-playwright`로 headless Chromium에서 실행된다.
WebGPU 없이 동작하므로 어디서든 실행 가능.

```bash
npm test              # = npm run test:unit
npm run test:unit     # vitest run
```

- 설정: `vitest.config.ts`
- 테스트 위치: `test/unit/**/*.test.ts`
- 대상: math (Vector2/3/4, Matrix3/4, Quaternion, Ray, Plane, Triangle, Rect, UV, Color, Rand, HaltonSeq, Bezier2D, AnimationCurve, MatrixDO), EventSystem
- 18 파일, 76 테스트

### 2. Browser Test (Playwright) — WebGPU 필요

GPU/렌더링 관련 테스트. Playwright로 Chromium을 띄우고, Vite dev server를 통해 기존 테스트 모듈을 iframe으로 로드하여 실행한다.

```bash
npm run test:browser  # playwright test
```

- 설정: `playwright.config.ts`
- 테스트 위치: `test/browser/**/*.spec.ts`
- Vite 서버 자동 실행 (port 4000)
- Chromium launch args에 `--enable-unsafe-webgpu`, `--use-webgpu-adapter=swiftshader` 등 포함
- 대상: WebGPU context, GPU buffers, Engine init, ECS, Component, Transform, Texture, Shaders, Lights, PostEffects
- 20 테스트

Playwright 브라우저 테스트는 `test/` 하위의 원본 테스트 소스(`test/gfx/`, `test/components/`, `test/shader/`, `test/base/`)를 Vite를 통해 참조한다. `test/index.html`, `test/index.ts`, `test/util.ts`는 이 테스트 인프라에 필요하므로 삭제하면 안 된다.

### 전체 실행

```bash
npm run test:ci       # vitest run && playwright test
```

### CI 환경 참고

- Playwright 브라우저가 설치되어 있어야 한다: `npx playwright install chromium`
- headless 환경에서 자동으로 headless shell 사용
- X server가 있는 환경이면 headed 모드로도 실행 가능

## Source

`src/` — 엔진 소스 (추후 보강 예정)
