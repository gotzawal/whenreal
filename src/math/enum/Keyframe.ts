import { BytesArray, ValueParser } from "../..";

/**
 * @group Math
 */
export class Keyframe {
    public serializedVersion: string = '2';
    public time: number;
    public value: number;
    public inSlope: number = 0;
    public outSlope: number = 0;
    public tangentMode: number = 0;

    public weightedMode: number = 0;
    public inWeight: number;
    public outWeight: number;

    constructor(time: number = 0, value: number = 0) {
        this.time = time;
        this.value = value;
    }

    public unSerialized(data: Record<string, unknown>) {
        this.serializedVersion = data['serializedVersion'] as string;
        this.time = data['time'] as number;
        this.value = data['value'] as number;
        this.tangentMode = data['tangentMode'] as number;
        this.inSlope = data['inSlope'] == 'Infinity' ? NaN : data['inSlope'] as number;
        this.outSlope = data['outSlope'] == 'Infinity' ? NaN : data['outSlope'] as number;
    }

    public unSerialized2(data: Record<string, unknown>) {
        this.serializedVersion = data['serializedVersion'] as string;
        this.time = data['time'] as number;
        this.value = data['value'] as number;
        this.tangentMode = data['tangentMode'] as number;
        this.inSlope = data['inTangent'] == 'Infinity' ? NaN : data['inTangent'] as number;
        this.outSlope = data['outTangent'] == 'Infinity' ? NaN : data['outTangent'] as number;
    }

}