import { test, expect } from 'vitest'
import { Rand } from '@orillusion/core'

test('Rand seed', () => {
    let rand = new Rand(2023)
    expect(rand.seed).toEqual(2023)

    rand.seed = 10
    expect(rand.seed).toEqual(10)

    let rand2 = rand.clone()
    expect(rand2.seed).toEqual(rand.seed)
})

test('Rand get', () => {
    let rand = new Rand(2023)
    let val = rand.get()
    expect(val).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER)
    expect(val).toBeLessThanOrEqual(Number.MAX_SAFE_INTEGER)
})

test('Rand getFloat', () => {
    let rand = new Rand(2023)
    let val = rand.getFloat()
    expect(val).toBeGreaterThanOrEqual(0.0)
    expect(val).toBeLessThanOrEqual(1.0)
})

test('Rand getSignedFloat', () => {
    let rand = new Rand(2023)
    let val = rand.getSignedFloat()
    expect(val).toBeGreaterThanOrEqual(-1.0)
    expect(val).toBeLessThanOrEqual(1.0)
})
