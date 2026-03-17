import { test, expect } from 'vitest'
import { Vector3 } from '@orillusion/core'

test('Vector3 base', () => {
    let a = new Vector3(20, 10, 0)

    expect(a.x).toEqual(20)
    expect(a.y).toEqual(10)
    expect(a.z).toEqual(0)

    let b = a.clone()
    expect(b.x).toEqual(a.x)
    expect(b.y).toEqual(a.y)
    expect(b.z).toEqual(a.z)

    a.set(0, 0, 0)
    expect(a.x).toEqual(0)
    expect(a.y).toEqual(0)
    expect(a.z).toEqual(0)
})

test('Vector3 add', () => {
    let a = new Vector3(20, 10, 0)
    let b = new Vector3(10, 10, 0)

    let result = a.add(b)
    expect(result.x).toEqual(30)
    expect(result.y).toEqual(20)
    expect(result.z).toEqual(0)
})

test('Vector3 sub', () => {
    let a = new Vector3(20, 10, 0)
    let b = new Vector3(10, 10, 0)

    let result = a.subtract(b)
    expect(result.x).toEqual(10)
    expect(result.y).toEqual(0)
    expect(result.z).toEqual(0)
})

test('Vector3 dotProduct', () => {
    let a = new Vector3(20, 10, 0)
    let b = new Vector3(10, 10, 0)

    let result = a.dotProduct(b)
    expect(result).toEqual(300)
})

test('Vector3 addScalar', () => {
    let a = new Vector3(20, 10, 0)

    let result = a.addXYZW(10, 10, 10, 0)
    expect(result.x).toEqual(30)
    expect(result.y).toEqual(20)
    expect(result.z).toEqual(10)
})

test('Vector3 scaleBy', () => {
    let a = new Vector3(20, 10, 0)
    a.scaleBy(10)

    expect(a.x).toEqual(200)
    expect(a.y).toEqual(100)
    expect(a.z).toEqual(0)
})

test('Vector3 divide', () => {
    let a = new Vector3(20, 10, 0)

    let result = a.divide(10)

    expect(result.x).toBeCloseTo(2, 5)
    expect(result.y).toBeCloseTo(1, 5)
    expect(result.z).toBeCloseTo(0, 5)
})

test('Vector3 distance', () => {
    let a = new Vector3(20, 10, 0)
    let b = new Vector3(10, 10, 0)

    let result = Vector3.distance(a, b)
    expect(result).toBeCloseTo(10, 5)
})

test('Vector3 length', () => {
    let a = new Vector3(20, 10, 0)
    let result = a.length

    expect(result).toBeCloseTo(22.360679774997898, 5)
})

test('Vector3 getAngle', () => {
    let a = new Vector3(20, 10, 0)
    let b = new Vector3(10, 10, 0)

    let result = Vector3.getAngle(a, b)

    expect(result).toBeCloseTo(18.43494882292201, 5)
})

test('Vector3 normalize', () => {
    let a = new Vector3(20, 10, 0)
    a.normalize()

    expect(a.x).toBeCloseTo(0.89442719099, 5)
    expect(a.y).toBeCloseTo(0.44721359549, 5)
    expect(a.z).toBeCloseTo(0, 5)
})
