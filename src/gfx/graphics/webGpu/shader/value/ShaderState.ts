import { BlendMode } from '../../../../../materials/BlendMode';
import { GPUCompareFunction, GPUCullMode, GPUPrimitiveTopology } from '../../WebGPUConst';

/**
 * @internal
 * ShaderState
 * @group GFX
 */
export class ShaderState {
    public blendMode?: BlendMode = BlendMode.NONE;
    public depthCompare?: GPUCompareFunction = GPUCompareFunction.less_equal;
    public depthWriteEnabled?: boolean = true;
    public frontFace?: GPUFrontFace = `ccw`;
    public cullMode?: GPUCullMode = GPUCullMode.back;
    public topology?: GPUPrimitiveTopology = GPUPrimitiveTopology.triangle_list;
    public depthBias?: number = 10;

    public useLight: boolean = false;
    public useProbe: boolean = false;
    public acceptGI: boolean = false;
    public acceptShadow: boolean = false;
    public castShadow: boolean = false;
    public castReflection: boolean = true;
    public receiveEnv: boolean = false;
    public renderLayer: number = 1000;
    public renderOrder: number = 2000;
    public unclippedDepth: boolean = false;
    public transparent: boolean = false;
    public multisample: number = 0;
    public label: string;
    public useZ: boolean = true;
    public splitTexture: boolean = false;
    public alphaCutoff: number;
    public useFragDepth: boolean = false;
    public writeMasks: GPUColorWriteFlags[] = [];

    public setFromMapValues(values: Map<string, number | boolean | string>) {
        if (values.has('blendMode')) {
            this.blendMode = this.convertBlendMode(values.get('blendMode') as string);
        }
        if (values.has('depthCompare')) {
            this.depthCompare = values.get('depthCompare') as GPUCompareFunction;
        }
        if (values.has('depthWriteEnabled')) {
            this.depthWriteEnabled = values.get('depthWriteEnabled') as boolean;
        }
        if (values.has('frontFace')) {
            this.frontFace = values.get('frontFace') as GPUFrontFace;
        }
        if (values.has('cullMode')) {
            this.cullMode = values.get('cullMode') as GPUCullMode;
        }
        if (values.has('topology')) {
            this.topology = values.get('topology') as GPUPrimitiveTopology;
        }
        if (values.has('depthBias')) {
            this.depthBias = values.get('depthBias') as number;
        }

        if (values.has('useLight')) {
            this.useLight = values.get('useLight') as boolean;
        }
        if (values.has('useProbe')) {
            this.useProbe = values.get('useProbe') as boolean;
        }
        if (values.has('acceptGI')) {
            this.acceptGI = values.get('acceptGI') as boolean;
        }
        if (values.has('acceptShadow')) {
            this.acceptShadow = values.get('acceptShadow') as boolean;
        }
        if (values.has('castShadow')) {
            this.castShadow = values.get('castShadow') as boolean;
        }
        if (values.has('receiveEnv')) {
            this.receiveEnv = values.get('receiveEnv') as boolean;
        }
        if (values.has('renderLayer')) {
            this.renderLayer = values.get('renderLayer') as number;
        }
        if (values.has('renderOrder')) {
            this.renderOrder = values.get('renderOrder') as number;
        }
        if (values.has('unclippedDepth')) {
            this.unclippedDepth = values.get('unclippedDepth') as boolean;
        }

        if (values.has('multisample')) {
            this.multisample = values.get('multisample') as number;
        }

        if (values.has('label')) {
            this.label = values.get('label') as string;
        }
        if (values.has('useZ')) {
            this.useZ = values.get('useZ') as boolean;
        }
    }

    protected convertBlendMode(value: string): BlendMode {
        switch (value) {
            case 'ABOVE': return BlendMode.ABOVE;
            case 'ALPHA': return BlendMode.ALPHA;
            case 'NORMAL': return BlendMode.NORMAL;
            case 'ADD': return BlendMode.ADD;
            case 'BELOW': return BlendMode.BELOW;
            case 'ERASE': return BlendMode.ERASE;
            case 'MUL': return BlendMode.MUL;
            case 'SCREEN': return BlendMode.SCREEN;
            case 'DIVD': return BlendMode.DIVD;
            case 'SOFT_ADD': return BlendMode.SOFT_ADD;
        }
        return BlendMode.NONE;
    }
}
