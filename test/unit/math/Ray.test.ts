import { test, expect, beforeAll } from 'vitest'
import { WasmMatrix } from '@orillusion/wasm-matrix/WasmMatrix'
import { BoundingBox, Matrix4, Ray, Triangle, Vector3 } from '@orillusion/core'

beforeAll(async () => {
    await WasmMatrix.init(Matrix4.allocCount)
})

test('Ray base', () => {
    let ray = new Ray(Vector3.ZERO, Vector3.X_AXIS)

    expect(ray.origin.x).toEqual(Vector3.ZERO.x)
    expect(ray.origin.y).toEqual(Vector3.ZERO.y)
    expect(ray.origin.z).toEqual(Vector3.ZERO.z)

    expect(ray.direction.x).toEqual(Vector3.X_AXIS.x)
    expect(ray.direction.y).toEqual(Vector3.X_AXIS.y)
    expect(ray.direction.z).toEqual(Vector3.X_AXIS.z)

    let ray2 = ray.clone()
    expect(ray2.origin.x).toEqual(ray.origin.x)
    expect(ray2.origin.y).toEqual(ray.origin.y)
    expect(ray2.origin.z).toEqual(ray.origin.z)

    expect(ray2.direction.x).toEqual(ray.direction.x)
    expect(ray2.direction.y).toEqual(ray.direction.y)
    expect(ray2.direction.z).toEqual(ray.direction.z)
})

test('Ray intersectsBox', () => {
    let ray = new Ray(Vector3.ZERO, Vector3.X_AXIS)
    let boundBox = new BoundingBox(Vector3.ZERO, new Vector3(10, 10, 10))

    let intersects = ray.intersectBox(boundBox) != null
    expect(intersects).toEqual(true)
})

test('Ray intersectBox get value', () => {
    let ray = new Ray(Vector3.ZERO, Vector3.X_AXIS)
    let vec3 = new Vector3()
    let boundBox = new BoundingBox(Vector3.ZERO, new Vector3(10, 10, 10))

    ray.intersectBox(boundBox, vec3)
    expect(vec3.x).toEqual(5)
    expect(vec3.y).toEqual(0)
    expect(vec3.z).toEqual(0)
})

test('Ray pointAt', () => {
    let ray = new Ray(Vector3.ZERO, Vector3.X_AXIS)
    let vec3 = new Vector3()

    let result = ray.pointAt(10, vec3)
    expect(result.x).toEqual(10)
    expect(result.y).toEqual(0)
    expect(result.z).toEqual(0)
})

test('Ray getPoint', () => {
    let ray = new Ray(Vector3.ZERO, Vector3.X_AXIS)

    let result = ray.getPoint(10)
    expect(result.x).toEqual(10)
    expect(result.y).toEqual(0)
    expect(result.z).toEqual(0)
})

test('Ray applyMatrix', () => {
    let boundBox = new BoundingBox(Vector3.ZERO, new Vector3(10, 10, 10))

    let rotMatrix = new Matrix4()
    rotMatrix.identity()
    rotMatrix.createByRotation(180, Vector3.Z_AXIS)

    let ray = new Ray(Vector3.ZERO, Vector3.X_AXIS)
    ray.applyMatrix(rotMatrix)

    const threshold = 0.000001
    let result = ray.intersectBox(boundBox, new Vector3())
    expect(result!.x).toBeCloseTo(-5, 5)
    expect(result!.y).toBeCloseTo(0, 5)
    expect(result!.z).toBeCloseTo(0, 5)
})

test('Ray pointInTriangle', () => {
    let ray = new Ray(Vector3.ZERO, Vector3.X_AXIS)

    const p = new Vector3(0, 0, 0)
    const a = new Vector3(0, 10, 0)
    const b = new Vector3(-5, -5, 0)
    const c = new Vector3(5, -5, 0)

    expect(ray.pointInTriangle(p, a, b, c)).toEqual(true)
})

test('Ray intersectTriangle', () => {
    let ray = new Ray(Vector3.ZERO, Vector3.X_AXIS)

    let face = new Triangle(
        new Vector3(20, 10, 0),
        new Vector3(20, -5, -5),
        new Vector3(20, -5, 5)
    )
    let result = ray.intersectTriangle(ray.origin, ray.direction, face)

    expect(result.x).toEqual(20)
    expect(result.y).toEqual(0)
    expect(result.z).toEqual(0)
})

test('Ray intersectSphere', () => {
    let ray = new Ray(new Vector3(-100, 0, 0), Vector3.X_AXIS)

    let result = ray.intersectSphere(ray.origin, ray.direction, Vector3.ZERO, 10)

    expect(result.x).toEqual(-10)
    expect(result.y).toEqual(0)
    expect(result.z).toEqual(0)
})

test('Ray intersectionSegment', () => {
    let ray = new Ray(new Vector3(-100, 0, 0), Vector3.X_AXIS)

    let result = ray.intersectionSegment(
        new Vector3(0, 0, 10),
        new Vector3(0, 0, -10),
        0.1
    )

    expect(result.out.x).toEqual(0)
    expect(result.out.y).toEqual(0)
    expect(result.out.z).toEqual(0)

    expect(result.length).toEqual(100)
})
