import { test, expect } from 'vitest'
import { Quaternion, Vector3 } from '@orillusion/core'

test('Quaternion fromEulerAngles', () => {
    let quat = new Quaternion()
    quat.fromEulerAngles(0, -90, 0)

    let result = new Vector3()
    quat.transformVector(new Vector3(10, 0, 0), result)

    expect(result.x).toBeCloseTo(0, 5)
    expect(result.y).toBeCloseTo(0, 5)
    expect(result.z).toBeCloseTo(10, 5)
})

test('Quaternion multiply', () => {
    let quatA = new Quaternion()
    quatA.fromEulerAngles(0, -45, 0)

    let quatB = new Quaternion()
    quatB.fromEulerAngles(0, -45, 0)

    let finalQuat = new Quaternion()
    finalQuat.multiply(quatA, quatB)

    let result = new Vector3()
    finalQuat.transformVector(new Vector3(10, 0, 0), result)

    expect(result.x).toBeCloseTo(0, 5)
    expect(result.y).toBeCloseTo(0, 5)
    expect(result.z).toBeCloseTo(10, 5)
})
