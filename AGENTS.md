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

## Project Structure

```
src/           → Engine source (see src/AGENTS.md for detailed guide)
packages/      → Extension packages (physics, particle, geometry, graphic, media, stats, debug, draco, ammo, wasm-matrix)
test/          → Unit tests (Vitest) + Browser tests (Playwright)
samples/       → Demo/example applications
dist/          → Build output (ES + UMD)
```

### Source Domains (src/)

| Domain | Path | Description |
|--------|------|-------------|
| Core | `core/`, `Engine3D.ts` | Scene graph, Entity/Object3D, Component system, Camera, View |
| Rendering | `gfx/`, `components/renderer/` | WebGPU pipeline, render passes, post-processing |
| Material & Shader | `materials/`, `assets/shader/` | PBR materials, WGSL shader library |
| Lighting | `components/lights/`, `core/csm/` | Light types, shadows, cluster lighting, GI |
| Animation | `components/anim/` | Skeletal, morph target, property curve animation |
| Asset & Loader | `assets/Res.ts`, `loader/`, `textures/` | Resource manager, parsers (glTF/OBJ/B3DM), textures |
| Math & Spatial | `math/`, `core/bound/`, `core/tree/` | Vector/Matrix/Quaternion, Octree/KDTree, navigation mesh |
| GUI | `components/gui/` | Canvas-based UI system (panels, buttons, text, images) |
| Input & Event | `io/`, `event/`, `components/controller/` | Input capture, event dispatch, camera controllers |

### Extension Packages (packages/)

| Package | Description |
|---------|-------------|
| `physics` | Bullet Physics via Ammo.js (rigidbody, softbody, constraints) |
| `particle` | GPU compute-based particle system |
| `geometry` | Procedural geometry (extrude, text, terrain, grass) |
| `graphic` | 2D/3D debug drawing primitives (lines, shapes, ribbons) |
| `media-extention` | Video/image materials, chroma key, 3D spatial audio |
| `stats` | Real-time FPS/memory monitoring overlay |
| `debug` | dat.GUI debug panel wrapper |
| `draco` | Draco mesh compression decoder (WASM) |
| `ammo` | Ammo.js physics engine (pre-compiled) |
| `wasm-matrix` | WASM-accelerated matrix operations |

## Code Conventions

| Aspect | Convention |
|--------|-----------|
| Classes | PascalCase (`MeshRenderer`, `Vector3`) |
| Methods/Variables | camelCase (`addComponent`, `getTexture`) |
| Private fields | `_` prefix (`_materials`, `_enable`) |
| Constants | UPPER_CASE (`MAX_VALUE`, `X_AXIS`) |
| File naming | 1:1 with class name (`MeshRenderer.ts`) |
| Shader files | Suffix: `*_frag.ts`, `*_vert.ts`, `*_cs.ts`, `*_shader.ts` |
| Decorators | `@RegisterComponent()`, `@EditorInspector` |
| Module system | ESM, barrel export via `src/index.ts` |
| Architecture | Component-based (Unity-style), singletons (`Engine3D`, `Res`) |

### Component Lifecycle

```
init(param?) → start() → onEnable() → onUpdate() → onLateUpdate() → onDisable() → beforeDestroy() → destroy()
```

## Intentional `any` Types — Do Not Replace

Many `any` types in this codebase are **intentional architectural decisions**. Do not mechanically replace them with `unknown` or add `eslint-disable` comments. Only replace `any` when you can provide a **concrete, specific type** that genuinely improves type safety.

### Component System — Polymorphic `init(param?: any)`

`Object3D.addComponent(c, param?: any)` passes the param through to `IComponent.init(param?: any)`. Each component extracts different data from the param:

- `UIImageGroup.init()` reads `param.count`
- `RenderNode.init()` ignores param entirely
- `MorphTargetBlender.init()` uses param differently again

The `any` enables a uniform interface across 30+ component classes without forcing a shared parameter schema. All UI components (`UIButton`, `UIPanel`, `UIImage`, `UITransform`, etc.), renderers (`RenderNode`, `InstanceDrawComponent`), transform utils (`ScaleControlComponents`, `TranslationControlComponents`), and animation components share this pattern.

Related: `Entity.noticeComponents(key, data: any)` — broadcasts arbitrary data to components.

### Event System — Generic Payloads

`CEvent.data`, `CEventDispatcher` params, and `CEventListener` fields use `any` because:

- Events carry arbitrary payloads (GUI hit info, resize dimensions, input data, etc.)
- `thisObject: any` supports callback context binding from any object type
- `param: any` allows listener-specific data attachment

Typing these generically would require parameterizing the entire event hierarchy for every event type, adding complexity with no practical benefit.

### Asset/Resource Loading — Universal Cache

`Res` uses `Map<string, any>` for its generic object cache (`_obj`). The engine loads diverse formats (GLTF skeletons, B3DM batches, I3DM instances, prefab data, etc.) that deserialize into different structures. GLTF-related types in particular change frequently across spec versions, and the resource system must handle generic asset loading across all formats. Callers retrieve with `getObj()` and cast to the expected type (`as PrefabAvatarData`, etc.).

The typed pools (`_texturePool`, `_materialPool`, `_geometryPool`) handle known resource types. The `any` pool is the catch-all for everything else.

### GPU/Texture State Binding

`Texture._stateChangeRef: Map<any, Function>` uses `any` keys as weak-reference-like identity tokens. Objects (typically `RenderShaderPass`) register callbacks via `bindStateChange(fun, ref)` and unregister via `unBindStateChange(ref)`. The key is just an identity — any object works.

### Double Cast Pattern (`as any as SpecificType`)

Used at integration boundaries where runtime knowledge exceeds static type information:

- `Octree.ts` — `bound as any as BoundingBox` (interface → concrete class)
- `AnimationMonitor.ts` — `obj3d as any as IObject3DForPropertyAnim` (dynamic method addition)
- `PointLightShadowRenderer.ts` — `camera as any as CubeCamera` (Camera subtype)
- `BitmapTextureCube.ts` — `images as any as HTMLCanvasElement[]` (after runtime instanceof check)
- `B3DMLoader.ts` / `I3DMLoader.ts` — `model as any as Object3D` (loader return narrowing)

These are deliberate — `as unknown as Type` is equivalent but noisier. Prefer `as any as Type` for brevity.

### Animator Property Cache

`AnimatorComponent.propertyCache: Map<RenderNode, { [name: string]: any }>` caches dynamic property values (numbers, colors, vectors) during animation playback. The value types vary per property.

### GLSL Preprocessor

`GLSLPreprocessor._definitionTables: Map<string, any>` stores both simple string values (`#define FOO 123`) and `MacroSubstitution` objects (`#define FOO(x) (x*2)`) in one map.

### What TO Replace

Only replace `any` when you can substitute a **concrete type** that the code actually uses:

- `any` → `View3D` (when the param is always a View3D)
- `any` → `number` (when the value is always numeric)
- `any` → `GPURenderPipeline` (when the variable holds a pipeline)
- `any` → `Record<string, string>` (when the structure is known)
- `any` → a new interface (when the shape is consistent and documentable)

Do **not** replace `any` → `unknown` just to satisfy a lint rule. The `unknown` type forces verbose type guards/assertions at every usage site, adding noise without improving safety in contexts where the type is inherently dynamic.
