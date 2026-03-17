import { test, expect, beforeAll } from 'vitest'
import { WasmMatrix } from '@orillusion/wasm-matrix/WasmMatrix'
import { Matrix4, Vector3 } from '@orillusion/core'

beforeAll(async () => {
    await WasmMatrix.init(Matrix4.allocCount)
})

test('Matrix4', () => {
    let mat4 = new Matrix4()

    expect(mat4.rawData[0]).toEqual(1.0)
    expect(mat4.rawData[1]).toEqual(0.0)
    expect(mat4.rawData[2]).toEqual(0.0)
    expect(mat4.rawData[3]).toEqual(0.0)

    expect(mat4.rawData[4]).toEqual(0.0)
    expect(mat4.rawData[5]).toEqual(1.0)
    expect(mat4.rawData[6]).toEqual(0.0)
    expect(mat4.rawData[7]).toEqual(0.0)

    expect(mat4.rawData[8]).toEqual(0.0)
    expect(mat4.rawData[9]).toEqual(0.0)
    expect(mat4.rawData[10]).toEqual(1.0)
    expect(mat4.rawData[11]).toEqual(0.0)

    expect(mat4.rawData[12]).toEqual(0.0)
    expect(mat4.rawData[13]).toEqual(0.0)
    expect(mat4.rawData[14]).toEqual(0.0)
    expect(mat4.rawData[15]).toEqual(1.0)
})

test('Matrix4 lookAt', () => {
    let mat4 = new Matrix4()
    mat4.lookAt(new Vector3(0, 0, 10), new Vector3(0, 0, 0), Vector3.Y_AXIS)
})

test('Matrix4 Scale', () => {
    let a = new Matrix4()
    a.createByScale(10, 1, 1)

    let result = new Vector3()
    a.multiplyPoint3(new Vector3(10, 0, 10), result)

    expect(result.x).toBeCloseTo(100, 5)
    expect(result.y).toBeCloseTo(0, 5)
    expect(result.z).toBeCloseTo(10, 5)
})

test('Matrix4 Rotation', () => {
    let a = new Matrix4()
    a.createByRotation(45, Vector3.Y_AXIS)

    let result = new Vector3()
    a.multiplyPoint3(new Vector3(10, 0, 10), result)

    expect(result.x).toBeCloseTo(14.142135, 5)
    expect(result.y).toBeCloseTo(0, 5)
    expect(result.z).toBeCloseTo(0, 5)
})

test('Matrix4 Translation', () => {
    let a = new Matrix4()
    a.appendTranslation(10, 10, 0)

    let result = new Vector3()
    a.multiplyPoint3(new Vector3(10, 0, 10), result)

    expect(result.x).toBeCloseTo(20, 5)
    expect(result.y).toBeCloseTo(10, 5)
    expect(result.z).toBeCloseTo(10, 5)
})

test('Matrix4 ScaleRotationTranslation', () => {
    let scaleMatrix = new Matrix4()
    scaleMatrix.createByScale(10, 10, 10)

    let rotationMatrix = new Matrix4()
    rotationMatrix.createByRotation(45, Vector3.Y_AXIS)

    let translationMatrix = new Matrix4()
    translationMatrix.appendTranslation(0, 10, 0)

    let finalMatrix = new Matrix4()
    finalMatrix.multiplyMatrices(scaleMatrix, rotationMatrix)
    finalMatrix.multiplyMatrices(finalMatrix, translationMatrix)

    let result = new Vector3()
    finalMatrix.multiplyPoint3(new Vector3(10, 0, 10), result)

    expect(result.x).toBeCloseTo(141.421356, 5)
    expect(result.y).toBeCloseTo(100, 5)
    expect(result.z).toBeCloseTo(0, 5)
})
