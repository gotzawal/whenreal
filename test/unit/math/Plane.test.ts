import { test, expect } from 'vitest'
import { Plane, Ray, Vector3 } from '@orillusion/core'

test('Plane intersectsLine', () => {
    let plane = new Plane(Vector3.ZERO, Vector3.X_AXIS)

    let intersection = new Vector3()
    let result = plane.intersectsLine(new Vector3(-10, 0, 0), new Vector3(10, 0, 0), intersection)

    expect(result).toEqual(true)
    expect(intersection.x).toBeCloseTo(0, 5)
    expect(intersection.y).toBeCloseTo(0, 5)
    expect(intersection.z).toBeCloseTo(0, 5)
})

test('Plane intersectsRay', () => {
    let plane = new Plane(Vector3.ZERO, Vector3.X_AXIS)

    let ray = new Ray(new Vector3(-10, 0, 0), new Vector3(1, 0, 0))

    let intersection = new Vector3()
    let result = plane.intersectsRay(ray, intersection)

    expect(result).toEqual(true)
    expect(intersection.x).toBeCloseTo(0, 5)
    expect(intersection.y).toBeCloseTo(0, 5)
    expect(intersection.z).toBeCloseTo(0, 5)
})
