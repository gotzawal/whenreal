import { test, expect } from 'vitest'
import { Rect } from '@orillusion/core'

test('Rect base', () => {
    let rect = new Rect(10, 10, 20, 10)
    let rect2 = rect.clone()

    expect(rect.width).toEqual(20)
    expect(rect.height).toEqual(10)

    expect(rect2.width).toEqual(rect.w)
    expect(rect2.height).toEqual(rect.h)
})

test('Rect pointInRect', () => {
    let result = Rect.pointInRect(0, 0, -10, -10, 10, 10)
    expect(result).toEqual(true)
})

test('Rect inner', () => {
    let rect = new Rect(10, 10, 20, 10)
    expect(rect.inner(11, 19)).toEqual(true)
})

test('Rect equal', () => {
    let rect1 = new Rect(10, 10, 20, 10)
    let rect2 = new Rect(10, 10, 20, 10)
    let rect3 = new Rect(0, 0, 20, 10)

    expect(rect1.equal(rect2)).toEqual(true)
    expect(rect1.equal(rect3)).toEqual(false)
})

test('Rect equalArea', () => {
    let rect1 = new Rect(10, 10, 20, 10)
    expect(rect1.equalArea(10, 10, 20, 10)).toEqual(true)
})

test('Rect equalInnerArea', () => {
    let rect1 = new Rect(10, 10, 20, 10)
    let rect2 = new Rect(12, 12, 16, 6)
    expect(rect1.equalInnerArea(rect2)).toEqual(true)
})

test('Rect innerArea', () => {
    let rect1 = new Rect(10, 10, 20, 10)
    let rect2 = new Rect(12, 12, 20, 10)

    let result = rect1.innerArea(rect2, new Rect())

    expect(result.x).toEqual(12)
    expect(result.y).toEqual(12)
    expect(result.w).toEqual(18)
    expect(result.h).toEqual(8)
})
