import { test, expect } from 'vitest'
import { Matrix3 } from '@orillusion/core'

test('Matrix3 clone', () => {
    let a = new Matrix3()

    let b = a.clone()
    expect(a.a).toEqual(b.a)
    expect(a.b).toEqual(b.b)
    expect(a.c).toEqual(b.c)
    expect(a.d).toEqual(b.d)
    expect(a.tx).toEqual(b.tx)
    expect(a.ty).toEqual(b.ty)
})

test('Matrix3 identity', () => {
    let a = new Matrix3()
    a.identity()

    expect(a.a).toEqual(1)
    expect(a.b).toEqual(0)
    expect(a.c).toEqual(0)
    expect(a.d).toEqual(1)
    expect(a.tx).toEqual(0)
    expect(a.ty).toEqual(0)
})

test('Matrix3 rotate', () => {
    let a = new Matrix3()
    a.rotate(90)
    let result = a.transformPoint(10, 0)

    expect(result.x).toBeCloseTo(0, 5)
    expect(result.y).toBeCloseTo(10, 5)
})

test('Matrix3 scale', () => {
    let a = new Matrix3()
    a.scale(2, 1)
    let result = a.transformPoint(10, 0)

    expect(result.x).toBeCloseTo(20, 5)
    expect(result.y).toBeCloseTo(0, 5)
})
