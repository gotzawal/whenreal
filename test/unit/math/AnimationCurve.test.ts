import { test, expect } from 'vitest'
import { AnimationCurve, Keyframe, WrapTimeMode } from '@orillusion/core'

test('AnimationCurve Add Frame test', () => {
    let frame_0 = new Keyframe(0, 0)
    let frame_1 = new Keyframe(1, 1)
    let animationCurve = new AnimationCurve(
        [frame_0, frame_1],
        WrapTimeMode.Repeat,
        WrapTimeMode.PingPong,
    )

    let v0 = animationCurve.getValue(0)
    let v1 = animationCurve.getValue(1)
    let v2 = animationCurve.getValue(0.5)

    expect(v0).toEqual(0)
    expect(v1).toEqual(1)
    expect(v2).toEqual(0.5)
})

test('AnimationCurve Frame in&out test', () => {
    let frame_0 = new Keyframe(0, 0)
    let frame_1 = new Keyframe(1, 1)
    let animationCurve = new AnimationCurve(
        [frame_0, frame_1],
        WrapTimeMode.Repeat,
        WrapTimeMode.PingPong,
    )

    frame_0.inSlope = 0.5
    frame_0.outSlope = 0.15
    frame_1.inSlope = 0.5
    frame_1.outSlope = 0.25

    let v0 = animationCurve.getValue(0)
    let v1 = animationCurve.getValue(1)
    let v2 = animationCurve.getValue(0.5)

    expect(v0).toEqual(0)
    expect(v1).toEqual(1)
    expect(v2).toEqual(0.45625000000000004)
})

test('AnimationCurve WarpTimeMode test', () => {
    let frame_0 = new Keyframe(0, 0)
    let frame_1 = new Keyframe(1, 1)
    let animationCurve = new AnimationCurve(
        [frame_0, frame_1],
        WrapTimeMode.Repeat,
        WrapTimeMode.PingPong,
    )

    frame_0.inSlope = 0.5
    frame_0.outSlope = 0.15
    frame_1.inSlope = 0.5
    frame_1.outSlope = 0.25

    let v0 = animationCurve.getValue(-0.5)
    let v1 = animationCurve.getValue(1.5)

    expect(v0).toEqual(-8127000.075000001)
    expect(v1).toEqual(0.45625000000000004)
})

test('AnimationCurve Remove test', () => {
    let frame_0 = new Keyframe(0, 0)
    let frame_1 = new Keyframe(1, 1)
    let animationCurve = new AnimationCurve(
        [frame_0, frame_1],
        WrapTimeMode.Repeat,
        WrapTimeMode.PingPong,
    )

    animationCurve.removeKeyFrame(frame_1)
    expect(animationCurve.getKeyCount()).toEqual(1)
})
