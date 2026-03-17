import { test, expect } from 'vitest'
import { Triangle, Vector3 } from '@orillusion/core'

test('Triangle base', () => {
    let a = new Triangle(
        new Vector3(0, 10, 0),
        new Vector3(-5, 0, 0),
        new Vector3(5, 0, 0),
    )

    expect(a.v1.x).toEqual(0)
    expect(a.v1.y).toEqual(10)
    expect(a.v1.z).toEqual(0)

    expect(a.v2.x).toEqual(-5)
    expect(a.v2.y).toEqual(0)
    expect(a.v2.z).toEqual(0)

    expect(a.v3.x).toEqual(5)
    expect(a.v3.y).toEqual(0)
    expect(a.v3.z).toEqual(0)
})

test('Triangle getNormal', () => {
    let a = new Triangle(
        new Vector3(0, 10, 0),
        new Vector3(-5, 0, 0),
        new Vector3(5, 0, 0),
    )

    let result = a.getNormal()

    expect(result.x).toBeCloseTo(0, 5)
    expect(result.y).toBeCloseTo(0, 5)
    expect(result.z).toBeCloseTo(-1, 5)
})

test('Triangle getCenter', () => {
    let a = new Triangle(
        new Vector3(0, 10, 0),
        new Vector3(-5, 0, 0),
        new Vector3(5, 0, 0),
    )

    let result = a.getCenter()

    expect(result.x).toBeCloseTo(0, 5)
    expect(result.y).toBeCloseTo(5, 5)
    expect(result.z).toBeCloseTo(0, 5)
})

test('Triangle intersects', () => {
    let a = new Triangle(
        new Vector3(0, 10, 0),
        new Vector3(-5, 0, 0),
        new Vector3(5, 0, 0),
    )

    let b = new Triangle(
        new Vector3(0, 10, 0),
        new Vector3(0, 0, -5),
        new Vector3(0, 0, 5),
    )

    expect(a.intersects(b)).toEqual(true)
})
