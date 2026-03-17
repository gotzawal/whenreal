import { BitmapTexture2D } from '../../../textures/BitmapTexture2D';

/**
 * @internal
 */
export type GLTypedArray = Float32Array | Int32Array | Uint32Array | Int16Array | Uint16Array | Int8Array | Uint8Array;

/**
 * @internal
 */
export type GLTypedArrayConstructor = typeof Float32Array | typeof Int32Array | typeof Uint32Array | typeof Int16Array | typeof Uint16Array | typeof Int8Array | typeof Uint8Array;

/**
 * @internal
 * @group Loader
 */
export interface GLTF_Camera {
    name: string;
    type: string;
    perspective?: {
        yfov: number;
        znear: number;
        zfar?: number;
        aspectRatio?: number;
    };
    orthographic?: {
        xmag: number;
        ymag: number;
        znear: number;
        zfar: number;
    };
    isParsed: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dcamera: any;
}

/**
 * @internal
 * @group Loader
 */
export interface GLTF_Skin {
    name: string;
    joints: number[];
    inverseBindMatrices?: number;
    skeleton?: number;
    isParsed: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dskin: any;
}

/**
 * @internal
 * @group Loader
 */
export interface GLTF_Animation {
    name?: string;
    channels?: GLTF_AnimationChannel[];
    samplers?: GLTF_AnimationSampler[];
}

/**
 * @internal
 * @group Loader
 */
export interface GLTF_AnimationChannel {
    sampler: number;
    target: {
        node: number;
        path: string;
    };
}

/**
 * @internal
 * @group Loader
 */
export interface GLTF_AnimationSampler {
    input: number;
    output: number;
    interpolation?: string;
}

/**
 * @internal
 * @group Loader
 */
export interface GLTF_SparseAccessor {
    count: number;
    indices: {
        bufferView: number;
        byteOffset?: number;
        componentType: number;
    };
    values: {
        bufferView: number;
        byteOffset?: number;
    };
}

/**
 * @internal
 * @group Loader
 */
export class GLTF_Info {
    public asset: {
        generator: string;
        version: string;
        minVersion: string;
    };

    public accessors: GLTF_Accessors[];

    public buffers: {
        isParsed: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbuffer: any;
        byteLength: number;
        uri: string;
    }[];

    public bufferViews: {
        isParsed: boolean;
        buffer: number;
        byteOffset: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbufferView: any;
        byteStride: number;
        byteLength: number;
    }[];

    public materials: {
        name: string;
        alphaModel: string;
        alphaCutoff: number;
    }[];

    public meshes: GLTF_Mesh[];

    public nodes: GLTF_Node[];

    public scene: number = 0;

    public scenes: GLTF_Scene;

    public textures: {
        isParsed: boolean;
        sampler: number;
        source: number;
        name: string;
        dtexture: BitmapTexture2D;
    }[];
    cameras: GLTF_Camera[];
    skins: GLTF_Skin[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resources: { [uri: string]: any };
    images: {
        uri: string;
        name: string;
        isParsed: boolean;
        dsampler: GPUSamplerDescriptor;
        dimage: ImageBitmap;
        mimeType: string;
        bufferView: number;
    }[];
    samplers: {
        minFilter: number;
        magFilter: number;
        wrapS: number;
        wrapT: number;
    }[];
    animations: GLTF_Animation[];

    extensions: {
        KHR_lights_punctual: {
            lights: GLTF_Light[];
        };
    };
}

/**
 * @internal
 * @group Loader
 */
export class GLTF_Scene {
    public nodes: number[];
}

/**
 * @internal
 * @group Loader
 */
export class GLTF_Light {
    name: string;
    type: string;
    color: number[];
    intensity: number;
    range: number;
    spot: {
        outerConeAngle: number;
    };

    isParsed: boolean;
}

/**
 * @internal
 * @group Loader
 */
export class GLTF_Node {
    public name: string;
    public rotation: number[];
    public scale: number[];
    public translation: number[];
    public children: number[];
    public matrix: number[];
    mesh: number = -1;
    isParsed: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dnode: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    camera: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skin: any;
    nodeId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    primitives: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extensions: any;
    light: GLTF_Light;
}

/**
 * @internal
 * @group Loader
 */
export class GLTF_Primitives {
    public attributes: {
        POSITION: number;
        NORMAL: number;
        TANGENT: number;
        TEXCOORD_0: number;
        TEXCOORD_1: number;
    };

    public indices: number;
    public material: number;
    public mode: number;
    public name: string;
    public targets: Array<{ [key: string]: number }>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public extensions: any;
    public morphTargetsRelative: boolean;
}

/**
 * @internal
 * @group Loader
 */
export class GLTF_Mesh {
    public name: string;
    public primitives: GLTF_Primitives[];
    isParsed: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dprimitives: any[];
    weights: number[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    extras: any;
}

/**
 * @internal
 * @group Loader
 */
export class GLTF_Accessors {
    public bufferView: number;
    public componentType: number;
    public count: number;
    public type: string;
    public max: number[];
    public min: number[];
    isParsed: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daccessor: any;
    normalized: boolean;
    sparse: GLTF_SparseAccessor;
    byteOffset: number;
    computeResult: { typedArray: GLTypedArray; arrayType: GLTypedArrayConstructor; numComponents: number };
}
