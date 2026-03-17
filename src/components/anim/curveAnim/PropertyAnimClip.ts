import { AttributeAnimCurve } from './AttributeAnimCurve';
/**
 * @internal
 * @group Animation
 */
export class ObjectAnimClip {
    public curve: { [attribute: string]: AttributeAnimCurve } = {};
}
/**
 * @group Animation
 */
export enum WrapMode {
    /**
     * Read loop mode from animation clips.
     */
    Default = 0,
    /**
     * When the time reaches the end of the animation clip, the clip will automatically stop playing and the time will be reset to the beginning of the clip.
     */
    Clamp = 1,
    /**
     * Stop the animation when the time reaches the end.
     */
    Once = 1,
    /**
     * When the time reaches the end, replay from the beginning.
     */
    Loop = 2,
    /**
     * Play the animation. When it reaches the endpoint, it will continue to play the last frame and never stop playing.
     */
    PingPong = 4,
    /**
     * Play the animation. When playing to the end, the animation is always in the sampling state of the last frame.
     */
    ClampForever = 8,
}
/**
 * All keyframe data for attribute animation
 * @internal
 * @group Animation
 */
export class PropertyAnimClip {
    public name: string;
    public objAnimClip: { [path: string]: ObjectAnimClip };

    public totalTime: number = 0;
    public time: number = 0;
    // private _startTime: number = 0;
    private _stopTime: number = 0;
    private _loopTime: number;
    private _wrapMode: WrapMode;
    private _sampleRate: number;

    public get wrapMode(): WrapMode {
        if (!this._wrapMode) this._wrapMode = WrapMode.Default;
        return this._wrapMode;
    }

    public set wrapMode(value: WrapMode) {
        this._wrapMode = value;
    }

    public parse(jsonData: Record<string, unknown>) {
        this.objAnimClip = {};

        let clip = jsonData['AnimationClip'] as Record<string, unknown>;

        let { m_Name, m_AnimationClipSettings, m_WrapMode, m_SampleRate } = clip as { m_Name: string; m_AnimationClipSettings: Record<string, unknown>; m_WrapMode: WrapMode; m_SampleRate: number };

        this.name = m_Name;
        this._wrapMode = m_WrapMode;
        this._sampleRate = m_SampleRate;
        this._loopTime = m_AnimationClipSettings.m_LoopTime as number;
        // this._startTime = m_AnimationClipSettings.m_StartTime;
        // this._stopTime = m_AnimationClipSettings.m_StopTime;

        // this.totalTime = this._stopTime - this._startTime;

        let editorCurves = clip.m_EditorCurves as Record<string, Record<string, unknown>>;
        for (const key in editorCurves) {
            if (Object.prototype.hasOwnProperty.call(editorCurves, key)) {
                const curve = editorCurves[key];
                let attribute = curve.attribute as string;

                let attributeAnimCurve = new AttributeAnimCurve();
                attributeAnimCurve.unSerialized(curve);
                this.totalTime = Math.max(this.totalTime, attributeAnimCurve.totalTime);
                let objClip = this.objAnimClip[curve.path as string];
                if (!objClip) {
                    objClip = new ObjectAnimClip();
                    this.objAnimClip[curve.path as string] = objClip;
                }
                objClip.curve[attribute] = attributeAnimCurve;
            }
        }
    }
}
