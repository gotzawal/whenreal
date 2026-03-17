# src/AGENTS.md — Engine Source Detailed Guide

Orillusion WebGPU 3D Engine source code architecture and domain reference.

## Directory Overview

```
src/
├── Engine3D.ts              # Engine singleton — init, render loop, global resource access
├── index.ts                 # Barrel export (600+ re-exports, auto-generated)
│
├── core/                    # Scene graph, entities, cameras, spatial structures
│   ├── entities/            #   Object3D, Entity, Scene3D
│   ├── bound/               #   BoundingBox, BoundingSphere, Frustum
│   ├── tree/                #   Octree, KDTree, QuadTree
│   ├── csm/                 #   Cascaded Shadow Map frustum splitting
│   ├── Camera3D.ts          #   Camera component
│   ├── View3D.ts            #   View (camera + scene → render target)
│   ├── CameraUtil.ts        #   Camera creation helpers
│   ├── Scene3D.ts           #   Scene root node
│   └── ViewQuad.ts          #   Full-screen quad for post-processing
│
├── components/              # Component system and all component implementations
│   ├── ComponentBase.ts     #   Base class for all components
│   ├── IComponent.ts        #   Component interface
│   ├── Transform.ts         #   Universal position/rotation/scale component
│   ├── renderer/            #   RenderNode, MeshRenderer, SkyRenderer, InstanceDrawComponent
│   ├── lights/              #   DirectLight, PointLight, SpotLight, GILighting, IES
│   ├── anim/                #   AnimatorComponent, skeleton, morph target, property curve
│   ├── gui/                 #   Full UI system: Canvas, Panel, Button, Image, TextField
│   ├── controller/          #   OrbitController, FlyCameraController, FirstPersonController
│   ├── post/                #   PostProcessingComponent
│   ├── shape/               #   Collision shapes (Box, Sphere, Capsule, Mesh)
│   ├── BillboardComponent.ts
│   └── ColliderComponent.ts
│
├── gfx/                     # Graphics pipeline — WebGPU abstraction + render jobs
│   ├── graphics/webGpu/     #   WebGPU context, GPU buffers, command encoding
│   ├── renderJob/           #   Frame rendering, pass renderers, entity/component collect
│   └── generate/            #   Geometry generators (Box, Sphere, Cylinder, Plane, etc.)
│
├── materials/               # Material system
│   ├── Material.ts          #   Base material class
│   ├── LitMaterial.ts       #   PBR lit material
│   ├── UnLitMaterial.ts     #   Unlit/emissive material
│   ├── PhysicMaterial.ts    #   Physics debug material
│   ├── BlendMode.ts         #   Blend mode enum
│   └── multiPass/           #   Multi-pass material support (CastShadow, DepthMaterial, etc.)
│
├── assets/                  # Shader library + resource manager
│   ├── Res.ts               #   Singleton resource manager (texture/material/geometry pools)
│   ├── Fonts.ts             #   Font system
│   └── shader/              #   100+ WGSL shader files organized by domain
│       ├── core/            #     Common structs, vertex attributes, inline functions
│       ├── lighting/        #     BRDF, BsDF, lighting functions, IES, irradiance
│       ├── materials/       #     Per-material shader programs (PBR, Unlit, Lambert, etc.)
│       ├── cluster/         #     Cluster-based light assignment compute shaders
│       ├── anim/            #     Skeleton skinning + morph target compute shaders
│       ├── compute/         #     General compute shaders (DDGIProbe, GTAO, SSR, TAA, etc.)
│       ├── post/            #     Post-processing shaders (bloom, FXAA, depth of field, etc.)
│       ├── quad/            #     Full-screen quad shaders
│       ├── graphic/         #     Debug/graphic rendering shaders
│       ├── gui/             #     GUI rendering shaders
│       ├── sky/             #     Skybox and atmospheric shaders
│       └── utils/           #     Shader utility functions (GenerayRandomDir, etc.)
│
├── loader/                  # Asset loaders and format parsers
│   ├── LoaderManager.ts     #   Singleton loader manager
│   ├── FileLoader.ts        #   Raw file fetcher
│   └── parser/              #   Format parsers
│       ├── gltf/            #     glTF/GLB parser (geometry, materials, skeleton, animation)
│       ├── OBJParser.ts     #     Wavefront OBJ parser
│       ├── B3DMParser.ts    #     Batched 3D Model (3D Tiles)
│       ├── I3DMParser.ts    #     Instanced 3D Model (3D Tiles)
│       ├── RGBEParser.ts    #     HDR texture parser
│       ├── AtlasParser.ts   #     Texture atlas parser
│       └── FontParser.ts    #     Font parser
│
├── textures/                # Texture type hierarchy
│   ├── BitmapTexture2D.ts   #   Standard 2D texture
│   ├── BitmapTextureCube.ts #   Cubemap texture
│   ├── BitmapTexture2DArray.ts # Texture array
│   ├── HDRTexture.ts        #   HDR environment texture
│   ├── HDRTextureCube.ts    #   HDR cubemap
│   ├── SolidColorTexture.ts #   Single-color texture
│   ├── Uint8ArrayTexture.ts #   Raw data texture
│   ├── Float16ArrayTexture.ts
│   ├── Float32ArrayTexture.ts
│   ├── DepthTexture.ts      #   Depth buffer texture
│   ├── DepthCubeTexture.ts  #   Depth cubemap (shadow)
│   ├── DepthCubeArrayTexture.ts
│   └── VirtualTexture.ts    #   GPU-only render target texture
│
├── math/                    # Math library
│   ├── Vector2.ts, Vector3.ts, Vector4.ts
│   ├── Matrix3.ts, Matrix4.ts
│   ├── Quaternion.ts
│   ├── Ray.ts, Plane.ts, Triangle.ts, Line.ts, Rect.ts
│   ├── Color.ts
│   ├── AnimationCurve.ts, Bezier2D.ts, Bezier3D.ts
│   ├── Random.ts, Rand.ts, HaltonSeq.ts
│   ├── UV.ts, MathUtil.ts
│   └── navigation/          #   Nav mesh, A* pathfinding, funnel algorithm
│
├── event/                   # Event system
│   ├── CEvent.ts            #   Event base class
│   ├── CEventDispatcher.ts  #   Observer pattern dispatcher
│   ├── CEventListener.ts    #   Listener wrapper
│   ├── eventConst/          #   Event type constants
│   └── CResizeEvent.ts
│
├── io/                      # Input system
│   ├── InputSystem.ts       #   Mouse/keyboard/touch capture
│   ├── OutlineManager.ts    #   Object outline selection
│   ├── PickFire.ts          #   Raycast picking dispatcher
│   ├── PickResult.ts        #   Pick result data
│   ├── RayCastMeshDetail.ts #   Detailed mesh raycast
│   └── TouchData.ts         #   Touch event data
│
├── setting/                 # Engine configuration
│   ├── EngineSetting.ts     #   Master settings object
│   ├── OcclusionQuerySetting.ts
│   ├── ShadowSetting.ts
│   ├── GlobalIlluminationSetting.ts
│   └── post/                #   Per-effect settings (Bloom, TAA, SSAO, SSR, DOF, etc.)
│
├── shape/                   # Basic geometry shape utilities
│   └── BoxGeometry.ts, etc.
│
└── util/                    # Utilities
    ├── Reference.ts         #   Reference counting for GPU resources
    ├── Time.ts              #   Frame timing
    ├── StringUtil.ts
    ├── Global.ts
    ├── SerializeDecoration.ts #  @RegisterComponent decorator
    ├── GeometryUtil.ts
    └── ProfilerUtil.ts
```

---

## 1. Core — Scene Graph & Component System

### Class Hierarchy

```
Entity (abstract base)
  └── Object3D (concrete scene node)
        └── Scene3D (scene root)
```

### Entity (`core/entities/Entity.ts`)

Abstract base. Manages component storage and parent-child relationships.

- `components: Map<Ctor<IComponent>, IComponent>` — component map keyed by class
- `entityChildren: Entity[]` — child nodes
- `numChildren: number` — child count
- `addComponent<T>(c: Ctor<T>, param?: any): T` — instantiate and attach component
- `getComponent<T>(c: Ctor<T>): T` — retrieve component by class
- `getComponents<T>(c: Ctor<T>, ret?: T[], includeInactive?: boolean): T[]` — all matching
- `getComponentsInChild<T>(c: Ctor<T>): T[]` — recursive child search
- `getComponentsByProperty<T>(key: string, value: any): T[]` — property filter
- `hasComponent<T>(c: Ctor<T>): boolean`
- `removeComponent<T>(c: Ctor<T>): void`
- `addChild(child: Entity): Entity`
- `removeChild(child: Entity): void`
- `removeAllChild(): void`
- `forChild(call: Function): void` — recursive tree traversal
- `noticeComponents(key: string, data: any)` — broadcast to all components
- `destroy(force?: boolean)` — cleanup

### Object3D (`core/entities/Object3D.ts`)

Concrete scene node. Adds transform and render state.

- `transform: Transform` — auto-created on instantiation
- `renderNode: RenderNode` — attached render component (if any)
- `bound: IBound` — bounding volume
- `isScene3D: boolean`
- `instanceID: string` — unique instance identifier
- `prefabRef: string` — prefab reference

### Scene3D (`core/Scene3D.ts`)

Scene root. Manages environment and view registration.

- `envMap: Texture` — environment HDR map
- `exposure: number` — HDR exposure
- `roughness: number` — environment roughness
- `view: View3D` — associated view

### Camera3D (`core/Camera3D.ts`)

Camera component. Supports perspective and orthographic projection.

- `fov: number` — field of view (degrees)
- `near: number`, `far: number` — clipping planes
- `aspect: number` — aspect ratio
- `type: CameraType` — Perspective or Orthographic
- `perspective(fov, aspect, near, far)` — set perspective projection
- `ortho(width, height, near, far)` — set orthographic projection
- `orthoOffCenter(left, right, bottom, top, near, far)` — asymmetric ortho
- `viewMatrix: Matrix4`, `projectionMatrix: Matrix4` — computed matrices
- `pvMatrix: Matrix4` — combined projection-view matrix
- `frustum: Frustum` — view frustum for culling
- `lookAt(eye, target, up)` — orient camera
- `screenPointToRay(x, y): Ray` — unproject screen to world ray
- `worldToScreenPoint(point, target?): Vector3` — project world to screen

### View3D (`core/View3D.ts`)

Binds a camera to a scene for rendering.

- `scene: Scene3D` — source scene
- `camera: Camera3D` — view camera
- `renderJob: RenderJob` — render pipeline instance
- `graphic3D: Graphic3D` — debug draw overlay

### Transform (`components/Transform.ts`)

Universal transform component. Every Object3D has one.

- `localPosition: Vector3`, `localRotation: Vector3` (euler), `localScale: Vector3`
- `x, y, z: number` — position shorthand
- `rotationX, rotationY, rotationZ: number` — euler shorthand
- `scaleX, scaleY, scaleZ: number` — scale shorthand
- `localQuaternion: Quaternion` — local rotation as quaternion
- `worldPosition: Vector3` — world-space position (computed)
- `worldMatrix: Matrix4` — world transform matrix (from WASM matrix pool)
- `parent: Transform` — parent in hierarchy
- `forward: Vector3`, `up: Vector3`, `right: Vector3` — basis vectors
- `lookAt(target: Vector3, up?: Vector3)` — orient toward target

**Change notification events:** `POSITION_ONCHANGE`, `ROTATION_ONCHANGE`, `SCALE_ONCHANGE`, `PARENT_ONCHANGE`, `LOCAL_ONCHANGE`

### Component System (`components/ComponentBase.ts`, `IComponent.ts`)

```typescript
interface IComponent {
    init(param?: any): void;
    start(): void;
    stop(): void;
    onEnable?(view?: View3D): void;
    onDisable?(view?: View3D): void;
    onUpdate?(view?: View3D): void;
    onLateUpdate?(view?: View3D): void;
    onBeforeUpdate?(view?: View3D): void;
    beforeDestroy?(force?: boolean): void;
    destroy(force?: boolean): void;
}
```

`ComponentBase` implements `IComponent` and provides:
- `object3D: Object3D` — owning node
- `transform: Transform` — shortcut to owner's transform
- `enable: boolean` — active flag (triggers onEnable/onDisable)
- `isDestroyed: boolean`
- Registration: `@RegisterComponent(Class, 'ClassName')` decorator

### Spatial Structures

**BoundingBox** (`core/bound/BoundingBox.ts`):
- `center: Vector3`, `extents: Vector3` (half-size), `min/max: Vector3`
- `setFromMinMax()`, `setFromCenterAndSize()`, `expandByPoint()`, `merge()`
- `intersects()`, `intersectsRay()`, `containsPoint()`, `containsBox()`
- `fromPoints(points[])` — compute from point cloud

**BoundingSphere** (`core/bound/BoundingSphere.ts`):
- `center: Vector3`, `radius: number`
- `containsPoint()`, `intersectsRay()`, `intersectsBoundingSphere()`

**Octree** (`core/tree/Octree.ts`):
- 8-way recursive spatial partitioning, `maxSplitLevel = 6`
- `tryInsertEntity(entity)`, `rayCasts(ray, ret[])`, `frustumCasts(frustum, ret[])`, `boxCasts(box, ret[])`
- `getRenderNode(frustum, ret)` — collect visible render nodes for culling
- Render nodes register via `RenderNode.attachSceneOctree(octree)`

**KDTree** (`core/tree/kdTree/`):
- K-dimensional space partitioning
- `KDTreeSpace`, `KDTreeRange` for arbitrary-dimension range queries

**QuadTree** (`core/tree/QuadTree.ts`):
- 2D spatial partitioning
- `buildQuadTree(maxNodes, minCellSize)`, `getNodesIntersectingAABox(result, aabb)`

### Engine3D Singleton (`Engine3D.ts`)

Main engine entry point. All access is via static members.

- `Engine3D.init(descriptor)` — initialize WebGPU context
- `Engine3D.startRenderView(view)` / `Engine3D.startRenderViews(views[])` — begin rendering
- `Engine3D.res: Res` — resource manager
- `Engine3D.setting: EngineSetting` — global settings
- `Engine3D.inputSystem: InputSystem` — input system
- `Engine3D.views: View3D[]` — active views
- Render loop: `Engine3D.render()` → per-view `RenderJob.renderFrame()`

---

## 2. Rendering — WebGPU Pipeline

### Render Pipeline Flow

```
Engine3D.render() (per frame)
 └── View3D.renderJob.renderFrame()
       ├── EntityCollect    → collect render nodes from scene octree
       ├── ComponentCollect → run component onUpdate/onLateUpdate
       ├── ClusterLighting  → compute shader: assign lights to clusters
       ├── ShadowMapPass    → render depth for shadow-casting lights
       ├── PointShadowPass  → render cube depth for point light shadows
       ├── OpaquePass       → render opaque geometry (COLOR pass)
       ├── TransparentPass  → render transparent geometry (sorted)
       ├── GBufferPass      → optional: deferred G-buffer
       └── PostProcessPass  → post-processing chain (Bloom, TAA, FXAA, SSAO, SSR, DOF, etc.)
```

### Key Rendering Classes

**RenderJob** (`gfx/renderJob/jobs/RenderJob.ts`):
- Orchestrates full frame render for one View3D
- Creates and orders all pass renderers
- Manages RTFrame (render targets) and ping-pong buffers

**PassRenderer** (`gfx/renderJob/passRenderer/`):
- `ColorPassRenderer` — main forward color pass
- `ShadowMapPassRenderer` — directional shadow depth
- `PointLightShadowRenderer` — point light cube shadow
- `ClusterLightingRender` — compute: light-to-cluster assignment
- `PreDepthPassRenderer` — early depth for occlusion
- `PostRenderer` — post-processing chain
- `GBufferPassRenderer` — deferred G-buffer
- `ReflectionPassRenderer` — screen-space reflections

**PassType enum**: `SHADOW`, `DEPTH`, `COLOR`, `REFLECTION`, `GI`, `GRAPHIC`

**EntityCollect** (`gfx/renderJob/collect/EntityCollect.ts`):
- Singleton. Gathers renderable nodes and lights per scene.
- `addRenderNode(scene, node)`, `removeRenderNode(scene, node)`
- `getRenderNodes(scene): RenderNode[]`
- `addLight(scene, light)`, `getLights(scene): ILight[]`
- Uses `state` object to track change flags (e.g., `giLightingChange`, `skyChange`)

**ComponentCollect** (`gfx/renderJob/collect/ComponentCollect.ts`):
- Manages per-view component lifecycle calls
- `addWaitStart(component)` — queue for `start()` call
- `addUpdate(component)` / `addLateUpdate(component)` — register for per-frame callbacks

### WebGPU Abstraction

**GPUContext** (`gfx/graphics/webGpu/Context3D.ts`):
- `init()` — request GPU adapter and device
- `device: GPUDevice` — the WebGPU device
- `canvas: HTMLCanvasElement` — render target canvas
- `presentationFormat: GPUTextureFormat` — swap chain format

**GPU Buffer Types** (`gfx/graphics/webGpu/core/buffer/`):
- `StorageGPUBuffer` — read-write storage buffer
- `UniformGPUBuffer` — uniform buffer
- `StructStorageGPUBuffer` — struct-typed storage
- `IndirectDrawBuffer` — indirect draw arguments
- `ComputeGPUBuffer` — compute shader data
- `GPUBufferBase` — base with `setFloat32Array()`, `apply()` (upload to GPU)

**Shader** (`gfx/graphics/webGpu/shader/Shader.ts`):
- Contains multiple `RenderShaderPass` instances (one per PassType)
- `addRenderPass(pass, passType)` — register a pass
- `getSubShaders(passType): RenderShaderPass[]`
- `setTexture(name, texture)`, `setUniform(name, value)`
- `setDefine(name, value)` — shader preprocessor defines

**RenderShaderPass** (`gfx/graphics/webGpu/shader/RenderShaderPass.ts`):
- Single GPU pipeline state
- `setShaderEntry(vs, fs)` — vertex/fragment entry points
- `setShader(vsCode, fsCode)` — shader source code
- `createPipeline()` — build `GPURenderPipeline`
- `cullMode`, `frontFace`, `depthCompare`, `blendMode` — pipeline state

### Geometry Generation (`gfx/generate/`)

Built-in geometry generators (all produce `GeometryBase`):
- `BoxGeometry`, `SphereGeometry`, `PlaneGeometry`, `CylinderGeometry`
- `TorusGeometry`, `ExtrudeGeometry`
- `ShaderGeometry`, `BillboardGeometry`

### Post-Processing

**PostProcessingComponent** (`components/post/PostProcessingComponent.ts`):
- Attached to camera Object3D
- `addPost<T>(postClass): T` — add post-effect
- `removePost<T>(postClass)` — remove post-effect

Available effects (configured via `Engine3D.setting.post`):
- Bloom, FXAA, TAA, GTAO (ambient occlusion), SSR (screen-space reflections)
- Depth of Field, Motion Blur, Outline, God Rays
- Color grading, tone mapping

---

## 3. Material & Shader System

### Material Class Hierarchy

```
Material (base)
├── LitMaterial         # PBR physically-based (metallic-roughness workflow)
├── UnLitMaterial       # Unlit / emissive only
├── PhysicMaterial      # Debug wireframe / physics visualization
├── LambertMaterial     # Lambert diffuse (non-PBR)
├── PointMaterial       # Point cloud rendering
├── GlassMaterial       # Glass/transparent with refraction
└── (extension materials in packages/)
```

### Material (`materials/Material.ts`)

- `shader: Shader` — contains per-pass pipeline state
- `doubleSide: boolean` — two-sided rendering
- `castShadow: boolean` — participate in shadow pass
- `acceptShadow: boolean` — receive shadows
- `blendMode: BlendMode` — NONE, NORMAL, ADD, ALPHA, MUL
- `transparent: boolean`
- `cullMode: GPUCullMode`
- `depthCompare: GPUCompareFunction`

Key methods:
- `setTexture(name, texture)` — bind texture to shader
- `setUniform(name, value)` — set uniform value
- `setDefine(name, value)` — toggle shader feature
- `addPass(passType, vs, fs)` — add custom render pass
- `clone(): Material` — deep copy

### LitMaterial — PBR Properties

- `baseMap: Texture` — albedo/diffuse texture
- `normalMap: Texture` — normal map
- `aoMap: Texture` — ambient occlusion
- `emissiveMap: Texture` — emissive texture
- `maskMap: Texture` — R=metallic, G=roughness, B=AO, A=unused
- `baseColor: Color` — albedo tint
- `emissiveColor: Color` — emissive tint
- `emissiveIntensity: number`
- `metallic: number` (0-1)
- `roughness: number` (0-1)
- `clearcoatFactor: number` (0-1)
- `clearcoatRoughnessFactor: number` (0-1)
- `alphaCutoff: number` — alpha test threshold

### Shader Library (`assets/shader/`)

All shaders are stored as **TypeScript string exports** (not .wgsl files):

```typescript
// Example: assets/shader/lighting/BRDF_frag.ts
export let BRDF_frag: string = /* wgsl */`
    fn D_GGX(NoH: f32, roughness: f32) -> f32 { ... }
    fn FresnelSchlick(cosTheta: f32, F0: vec3f) -> vec3f { ... }
    ...
`;
```

**Shader composition** uses string concatenation + `#include` preprocessor:
```wgsl
#include "BRDF_frag"
#include "LightingFunction_frag"
```

Resolved by `ShaderLib.getShader(name)` at runtime.

**Shader subdirectories:**

| Directory | Contents |
|-----------|----------|
| `core/` | Common structs (`VertexAttributes`, `GlobalUniform`, `FragmentOutput`), inline functions |
| `lighting/` | BRDF, BsDF/BxDF (main shading), LightingFunction, Irradiance (GI probes), IES profiles, Hair, UnLit |
| `materials/` | Per-material programs: PBRLit, UnLit, Lambert, PhysicMaterial, PointMaterial, Sky |
| `cluster/` | Compute shaders: ClusterBoundsSource (tile AABB), ClusterLighting (light assignment) |
| `anim/` | SkeletonAnimation (GPU skinning), MorphTarget (compute shader blend) |
| `compute/` | DDGIProbe, GTAO, SSR, TAA, OutlinePass, DepthOfField, GodRay, etc. |
| `post/` | Post-processing fragment shaders (bloom, FXAA, tone mapping, fog, etc.) |
| `quad/` | Full-screen quad vertex/fragment (for post-processing) |
| `graphic/` | Debug drawing shaders |
| `gui/` | UI rendering shaders |
| `sky/` | Skybox, atmospheric scattering |
| `utils/` | Utility functions (random direction generation, etc.) |

### Shader Defines / Feature Toggles

Shader features are toggled via `#define` preprocessor:
- `USE_SHADOWMAPING` — enable shadow sampling
- `USE_IES_PROFILE` — enable IES light profiles
- `USE_MORPHTARGETS` — enable morph target animation
- `USE_MORPHNORMALS` — enable morph normal animation
- `USE_SKELETON` — enable skeletal animation
- `USE_CLEARCOAT` — enable clearcoat layer
- `USEGBUFFER` — enable G-buffer output

### Shader Binding Groups

```
Group 0: Global uniforms (camera matrices, time, screen size, global settings)
Group 1: Per-object uniforms (world matrix, object ID)
Group 2: Lighting data (light buffer, cluster data, shadow maps, env maps)
Group 3: Material textures and uniforms (albedo, normal, PBR params)
```

---

## 4. Lighting System

### Light Class Hierarchy

```
LightBase (extends ComponentBase, implements ILight)
├── DirectLight   # Directional (sun) — parallel rays, supports CSM shadows
├── PointLight    # Omni-directional — range-based attenuation
├── SpotLight     # Cone-shaped — inner/outer angle, range
└── Light         # Legacy PointLight alias (@RegisterComponent)
```

### Common Light Properties (LightBase)

- `intensity: number` — brightness multiplier
- `color: Color` / `r, g, b` — light color
- `castShadow: boolean` — enable shadow map rendering
- `castGI: boolean` — contribute to global illumination
- `iesProfiles: IESProfiles` — IES light distribution profile
- `realTimeShadow: boolean` — update shadow every frame

### Light-Specific Properties

**DirectLight:**
- Direction determined by transform rotation
- `radius: number` — shadow coverage radius (MAX_SAFE_INTEGER by default)
- `indirect: number` — indirect lighting factor
- Supports Cascaded Shadow Maps (CSM) with 4 cascades

**PointLight:**
- `range: number` — influence radius
- `at: number` — linear attenuation distance
- `radius: number` — source radius (for soft shadows)
- `quadratic: number` — quadratic attenuation factor

**SpotLight:**
- `innerAngle: number` — inner cone (0-100%)
- `outerAngle: number` — outer cone (1-179 degrees)
- `range: number` — influence radius
- `radius: number` — source radius

### LightData GPU Structure (24 floats per light)

```
lightType, radius, linear, position.xyz, lightMatrixIndex,
direction.xyz, quadratic, lightColor.rgba, intensity,
innerCutOff, outerCutOff, range, castShadowIndex,
lightTangent.xyz, iesIndex
```

### Cluster-Based Lighting

Two compute shader passes per frame:

1. **ClusterBoundsSource_cs** — Subdivide view frustum into 3D grid tiles, compute AABB per tile
2. **ClusterLighting_cs** — For each cluster, test sphere-AABB intersection against all lights, build per-cluster light index list (max 64 lights/cluster)

Fragment shaders look up cluster ID from screen position, iterate assigned lights only.

### Shadow System

**Directional (CSM):**
- 4 cascades via `FrustumCSM` (`core/csm/FrustumCSM.ts`)
- Logarithmic depth split with configurable `csmScatteringExp`, `csmAreaScale`, `csmMargin`
- Each cascade: ortho shadow camera, separate depth texture layer
- PCF 3x3 or soft 20-tap Poisson disk sampling
- Cascade blending with feathering at boundaries

**Point Light:**
- Cube shadow map array (texture_depth_cube_array)
- Per-face render

**Shadow Sampling** (`ShadowMapping_frag.ts`):
- Configurable bias (normal-based)
- Hard, PCF, or soft shadow modes
- Max 8 directional + 8 point shadow-casting lights

### Global Illumination

**Irradiance Volumes** (`Irradiance_frag.ts`):
- Probe-based irradiance field with octahedral mapping
- 8-probe trilinear interpolation per fragment
- Depth-based occlusion via Chebyshev variance filtering
- Probe grid: configurable start position, counts, spacing

**IES Profiles** (`IESProfiles.ts`):
- Up to 48 IES profiles in a shared `BitmapTexture2DArray`
- Tangent-space angle lookup → texture sample → attenuation multiplier
- Applied in point/spot light calculations when `USE_IES_PROFILE` defined

---

## 5. Animation System

### Architecture Overview

```
AnimatorComponent (skeletal + morph target orchestrator)
├── Skeleton Animation (bone hierarchy + GPU skinning)
├── Morph Target Blending (GPU compute shader)
└── Cross-fade state machine

PropertyAnimation (generic property curve animator)
├── PropertyAnimClip (animation data)
├── AttributeAnimCurve (per-property curves)
└── AnimationMonitor (playback state)
```

### AnimatorComponent (`components/anim/AnimatorComponent.ts`)

Main animation driver. Manages skeletal and morph target playback.

Key fields:
- `timeScale: number` — global playback speed multiplier
- `clips: PropertyAnimationClip[]` — loaded animation clips
- `jointMatrixIndexTableBuffer: StorageGPUBuffer` — bone matrix GPU lookup
- `inverseBindMatrices: FloatArray[]` — inverse bind poses for skinning

Playback control:
- `playAnim(name, time?, speed?)` — play skeleton animation by name
- `crossFade(name, crossTime)` — smooth blend to another animation
- `playBlendShape(name, time?, speed?)` — play morph target animation
- `seek(time)` — jump to specific time
- `getPosition/getRotation/getScale(boneName, time)` — sample curves

Cross-fade blending:
- `SkeletonAnimCrossFadeState` manages in/out clip weights
- Linear ramp: `inWeight = currentTime / crossFadeTime`
- Per-bone: LERP for position/scale, SLERP for rotation

### Skeleton Animation

**Data flow:** glTF → `PrefabAvatarData` (bone hierarchy) → `PropertyAnimationClip` (per-bone curves) → Object3D bone hierarchy → GPU skinning shader

**GPU Skinning** (`SkeletonAnimation_shader.ts`):
- `jointsMatrixIndexTable` — index into world matrix buffer per bone
- `jointsInverseMatrix` — inverse bind pose matrices
- `getSkeletonWorldMatrix_4(joints, weights)` — 4-bone max per vertex
- `getSkeletonWorldMatrix_8(joints0/1, weights0/1)` — 8-bone max per vertex
- Formula: `result = Σ(bone_world × inverse_bind × weight)`

### Morph Target System

**MorphTargetBlender** (`components/anim/morphAnim/MorphTargetBlender.ts`):
- Applies blend shape influences to `SkinnedMeshRenderer2` instances
- Supports 64 morph targets per mesh
- 56 standard ARKit facial blend shapes (eyes, mouth, jaw, brows, etc.)

**GPU Compute** (`MorphTarget_shader.ts`):
- Workgroup: 8×8×1
- Reads influence array (64 floats) + packed morph positions
- Outputs blended vertex positions
- Optional morph normals via `USE_MORPHNORMALS`

### Property Animation (Non-Skeletal)

**PropertyAnimation** (`components/anim/curveAnim/PropertyAnimation.ts`):
- Generic animator for any Object3D properties (transform, material colors, etc.)
- `appendClip(clip)`, `play(name)`, `stop()`, `seek(time)`
- `WrapMode`: Loop, Once, PingPong, Clamp, ClampForever
- Events: `SEEK` (per-frame), `COMPLETE` (animation end)

**AnimationCurve** (`math/AnimationCurve.ts`):
- Keyframe list with cubic Hermite interpolation
- `Keyframe`: time, value, inSlope, outSlope, tangentMode, weights
- `AnimationCurveT`: multi-channel wrapper (1=scalar, 2=vec2, 3=vec3, 4=quaternion with SLERP)
- Frame caching for repeated sampling optimization

---

## 6. Asset & Loader System

### Resource Manager — Res (`assets/Res.ts`)

Singleton accessed via `Engine3D.res`. Manages all loaded resources.

**Typed pools:**
- `_texturePool: Map<string, Texture>` — `getTexture(name)`, `addTexture(name, tex)`
- `_materialPool: Map<string, Material>` — `getMaterial(name)`, `addMaterial(name, mat)`
- `_geometryPool: Map<string, GeometryBase>` — `getGeometry(name)`, `addGeometry(name, geo)`
- `_prefabPool: Map<string, Object3D>` — `getPrefab(name)` (returns clone)
- `_obj: Map<string, any>` — generic cache: `getObj(name)`, `addObj(name, obj)`

**Loading methods:**
- `loadTexture(url, loaderFunctions?): Promise<Texture>`
- `loadHDRTexture(url): Promise<HDRTexture>`
- `loadHDRTextureCube(url): Promise<HDRTextureCube>`
- `loadJSON(url): Promise<object>`
- `loadFont(url): Promise<FontData>`
- `loadAtlas(url): Promise<Atlas>`
- `loadGltf(url): Promise<Object3D>` — load glTF/GLB, returns scene hierarchy

### Loader Pipeline

```
URL → FileLoader (fetch) → ParserBase subclass (parse) → Res pool (cache)
```

**LoaderManager** (`loader/LoaderManager.ts`):
- Singleton orchestrator
- Routes file types to appropriate parsers

**FileLoader** (`loader/FileLoader.ts`):
- Raw fetch with ArrayBuffer, JSON, or text responses
- Progress callbacks

### Parser Hierarchy

```
ParserBase (abstract)
├── GLBParser       # Binary glTF container
│   └── GLTFParser  # glTF scene, materials, geometry
│       ├── GLTFSubParserMaterial    # PBR material extraction
│       ├── GLTFSubParserGeometry    # Mesh/vertex data
│       ├── GLTFSubParserSkeleton    # Skeleton + animation clips
│       └── GLTFSubParserConverter   # Node tree → Object3D hierarchy
├── OBJParser       # Wavefront OBJ + MTL
├── B3DMParser      # Batched 3D Model (Cesium 3D Tiles)
├── I3DMParser      # Instanced 3D Model (Cesium 3D Tiles)
├── RGBEParser      # Radiance HDR (.hdr)
├── AtlasParser     # Texture atlas (JSON spritesheet)
└── FontParser      # Font data
```

### Texture Class Hierarchy

```
Texture (abstract base — GPU texture wrapper)
├── BitmapTexture2D        # Standard 2D (PNG, JPG, WebP)
├── BitmapTextureCube      # Cubemap (6 faces)
├── BitmapTexture2DArray   # 2D array (shadow maps, IES, etc.)
├── HDRTexture             # HDR environment (.hdr RGBE)
├── HDRTextureCube         # HDR cubemap (prefiltered IBL)
├── SolidColorTexture      # Single color fill
├── Uint8ArrayTexture      # Raw uint8 data
├── Float16ArrayTexture    # Raw float16 data
├── Float32ArrayTexture    # Raw float32 data
├── DepthTexture           # Depth buffer attachment
├── DepthCubeTexture       # Depth cubemap (point shadows)
├── DepthCubeArrayTexture  # Depth cubemap array
└── VirtualTexture         # GPU-only render target (no CPU data)
```

### Reference Counting (`util/Reference.ts`)

Tracks GPU resource lifetime. Prevents premature destruction of shared resources.

```typescript
Reference.getInstance().attached(texture, renderer)   // increment ref
Reference.getInstance().detached(texture, renderer)   // decrement ref
if (!Reference.getInstance().hasReference(texture)) {
    texture.destroy()  // safe to destroy
}
```

---

## 7. Math & Spatial Library

### Vector Classes

**Vector2** — 2D with static helpers (`HELP_0-2`), angle calculation, SLERP/LERP.

**Vector3** — 3D workhorse. Static axis constants (`X_AXIS`, `Y_AXIS`, `Z_AXIS`, `UP`, `DOWN`, `FORWARD`, `BACK`, `LEFT`, `RIGHT`). Helper cache (`HELP_0` through `HELP_6`) to reduce GC pressure. Key methods: `dotProduct()`, `crossProduct()`, `normalize()`, `applyQuaternion()`, `applyMatrix4()`, `lerp()`, `distance()`.

**Vector4** — 4D vector with cross product support.

**Pattern:** Methods return `this` for chaining. Optional `target` parameter avoids allocation in hot paths.

### Matrix Classes

**Matrix3** — 2D affine (a, b, c, d, tx, ty). `concat()`, `rotate()`, `scale()`, `translate()`, `invert()`, `transformPoint()`.

**Matrix4** — 3D transform (4x4). WASM-accelerated via `@orillusion/wasm-matrix`. Memory pooling with `rawData: FloatArray` backed by shared `ArrayBuffer`. Key methods: `multiply()`, `decompose()`, `perspective()`, `lookAt()`, `multiplyPoint3()`, `matrixToEuler()`, `fromToRotation()`.

### Quaternion

`fromEulerAngles()`, `fromAxisAngle()`, `toAxisAngle()`, `getEulerAngles()`, `slerp()`, `lerp()`, `multiply()`, `transformVector()`, `inverse()`, `setFromRotationMatrix()`. Static helpers: `HELP_0-2`.

### Geometry Primitives

- **Ray** — `origin + direction * t`. Intersection: box, triangle, sphere, segment. `pointAt(t)`, `sqrDistToPoint()`.
- **Plane** — point + normal. `intersectsLine()`, `intersectsRay()`.
- **Triangle** — v1/v2/v3 + UVs + normals. `getNormal()`, `intersects()`, `pointInTriangle2D()`, `getCenter()`.
- **Rect** — AABB rectangle. `inner(x, y)`, `equalInnerArea()`, `innerArea()`.

### Color

RGBA (0-1 range). 140+ named color constants. `hexToRGB()`, `hexToRGBA()`, `setHex()`, `getHex()`, `convertToHDRRGB()`. Static: `lerp()`, `random()`, `randomRGB()`, `randomGray()`.

### Curves & Interpolation

- **AnimationCurve** — Keyframe-based cubic Hermite spline. Pre/post infinity wrap modes.
- **AnimationCurveT** — Multi-channel (1=scalar, 2=vec2, 3=vec3, 4=quaternion SLERP).
- **Bezier2D/3D** — Bezier curve evaluation.
- **CubicBezierCurve/Path** — Cubic Bezier with path support.

### Random & Sequences

- **Random** — Simplex/Perlin noise (1D-4D), normal/uniform distributions.
- **Rand** — Simple random utilities.
- **HaltonSeq** — Quasi-Monte Carlo Halton sequence for low-discrepancy sampling.

### Navigation Mesh (`math/navigation/`)

- **Navi3DMesh** — Navigation mesh data structure
- **Navi3DAstar** — A* pathfinding on nav mesh
- **Navi3DRouter** — Route computation
- **Navi3DFunnel** — Funnel algorithm for path smoothing
- Supporting: `Navi3DTriangle`, `Navi3DPoint`, `Navi3DEdge`, `Navi3DMergeVertex`

---

## 8. GUI System

### Architecture

```
UICanvas (root container — manages GUI render pass)
├── UIPanel (container with background)
│   ├── UIButton (interactive button)
│   ├── UIImage (image display)
│   ├── UITextField (text rendering)
│   ├── UISlider (slider control)
│   └── UIPanel (nested containers)
└── UITransform (2D transform for all UI elements)
```

### Key Components (`components/gui/`)

**UICanvas** — Root GUI container. Creates GUI render pass, manages UI element collection, handles UI event dispatch. One per scene.

**UITransform** — 2D transform for UI elements. Position (x, y), size (width, height), pivot, anchor, parent-child layout.

**UIPanel** — Container with optional background color/image. Supports scrolling, clipping.

**UIButton** — Interactive button with normal/hover/press/disable states. Change events.

**UIImage** — Image display component. Sprite, color tint, sprite sheet support.

**UITextField** — Text rendering. Font, size, color, alignment, line spacing, text content.

**UISlider** — Slider control with min/max/value.

### GUI Rendering

- GUI elements rendered in a separate pass after 3D scene
- Uses dedicated GUI shaders (`assets/shader/gui/`)
- UICanvas manages its own geometry and material batching
- Picking: separate UI raycasting from input events

### GUI Event Flow

```
InputSystem → PickFire (raycast) → UICanvas → UIInteractive component → event handler
```

---

## 9. Input & Event System

### Event System (`event/`)

**CEvent** — Base event class:
- `type: string` — event identifier
- `data: any` — arbitrary payload
- `target: CEventDispatcher` — event source

**CEventDispatcher** — Observer pattern:
- `addEventListener(type, callback, thisObject?, param?, priority?)`
- `removeEventListener(type, callback, thisObject?)`
- `dispatchEvent(event: CEvent)`
- `hasEventListener(type): boolean`
- `containEventListener(type): boolean`

**Common event types:**
- Transform: `POSITION_ONCHANGE`, `ROTATION_ONCHANGE`, `SCALE_ONCHANGE`, `LOCAL_ONCHANGE`, `PARENT_ONCHANGE`
- Component: `COMPONENT_ADDED`, `COMPONENT_REMOVED`
- Render: `RESIZE`
- Input: pointer, keyboard events

### Input System (`io/`)

**InputSystem** (`io/InputSystem.ts`):
- Captures mouse, keyboard, and touch events from canvas
- Normalizes input across platforms
- Fires events through CEventDispatcher

**PickFire** (`io/PickFire.ts`):
- Raycast-based 3D object picking
- Dispatches pick events (enter, over, out, click, move)

**RayCastMeshDetail** (`io/RayCastMeshDetail.ts`):
- Detailed per-triangle mesh intersection
- Returns intersection point, normal, UV, face index

### Camera Controllers (`components/controller/`)

**OrbitController** — Orbit around target point. Mouse drag rotates, scroll zooms, middle-button pans.
- `target: Vector3`, `distance: number`, `minDistance/maxDistance`
- `autoRotate: boolean`, `autoRotateSpeed: number`

**FlyCameraController** — Free-fly camera. WASD movement, mouse look.
- `moveSpeed: number`, `rollSpeed: number`

**FirstPersonController** — First-person camera with ground plane constraint.

**HoverCameraController** — Hover/orbit variant.

All controllers extend `ComponentBase` and use `onUpdate()` for per-frame input processing.

---

## Dependency Layer Diagram

```
┌─────────────────────────────────────────┐
│       GUI, Input/Event, Controllers     │  Application Layer
├─────────────────────────────────────────┤
│  Animation  │  Lighting  │ Asset/Loader │  Domain Layer
├─────────────┴────────────┴──────────────┤
│          Material & Shader              │  Shader Layer
├─────────────────────────────────────────┤
│         Rendering Pipeline (gfx/)       │  Render Layer
├─────────────────────────────────────────┤
│     Core (Entity, Component, Scene)     │  Core Layer
├─────────────────────────────────────────┤
│         Math & Spatial Structures       │  Foundation Layer
└─────────────────────────────────────────┘
```

**Rule:** Lower layers never import from upper layers. Same-layer imports are allowed. The `event/` system is cross-cutting (used at all layers).
