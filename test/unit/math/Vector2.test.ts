import { test, expect } from 'vitest'
import { RADIANS_TO_DEGREES, Vector2 } from '@orillusion/core'

test('Vector2 base', () => {
    let a = new Vector2(20, 10)

    expect(a.x).toEqual(20)
    expect(a.y).toEqual(10)

    let b = a.clone()
    expect(b.x).toEqual(a.x)
    expect(b.y).toEqual(a.y)

    a.set(0, 0)
    expect(a.x).toEqual(0)
    expect(a.y).toEqual(0)
})

test('Vector2 add', () => {
    let a = new Vector2(20, 10)
    let b = new Vector2(10, 10)

    let result = a.add(b)
    expect(result.x).toEqual(30)
    expect(result.y).toEqual(20)
})

test('Vector2 sub', () => {
    let a = new Vector2(20, 10)
    let b = new Vector2(10, 10)

    let result = a.sub(b)
    expect(result.x).toEqual(10)
    expect(result.y).toEqual(0)
})

test('Vector2 dot', () => {
    let a = new Vector2(20, 10)
    let b = new Vector2(10, 10)

    let result = a.dot(b)
    expect(result).toEqual(300)
})

test('Vector2 addScalar', () => {
    let a = new Vector2(20, 10)

    let result = a.addScalar(10)
    expect(result.x).toEqual(30)
    expect(result.y).toEqual(20)
})

test('Vector2 scale', () => {
    let a = new Vector2(20, 10)
    a.scale(10)

    expect(a.x).toEqual(200)
    expect(a.y).toEqual(100)
})

test('Vector2 divide', () => {
    let a = new Vector2(20, 10)

    let result = a.divide(10)

    expect(result.x).toBeCloseTo(2, 5)
    expect(result.y).toBeCloseTo(1, 5)
})

test('Vector2 distance', () => {
    let a = new Vector2(20, 10)
    let b = new Vector2(10, 10)

    let result = a.distance(b)
    expect(result).toBeCloseTo(10, 5)
})

test('Vector2 length', () => {
    let a = new Vector2(20, 10)
    let result = a.length()

    expect(result).toBeCloseTo(22.360679774997898, 5)
})

test('Vector2 getAngle', () => {
    let a = new Vector2(20, 10)
    let b = new Vector2(10, 10)
    let result = a.getAngle(b)

    expect(result * RADIANS_TO_DEGREES).toBeCloseTo(180, 5)
})

test('Vector2 normalize', () => {
    let a = new Vector2(20, 10)
    a.normalize()

    expect(a.x).toBeCloseTo(0.89442719099, 5)
    expect(a.y).toBeCloseTo(0.44721359549, 5)
})
