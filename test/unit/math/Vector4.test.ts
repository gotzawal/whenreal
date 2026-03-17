import { test, expect } from 'vitest'
import { Vector4 } from '@orillusion/core'

test('Vector4 base', () => {
    let a = new Vector4(20, 10, 1, 1)

    expect(a.x).toEqual(20)
    expect(a.y).toEqual(10)
    expect(a.z).toEqual(1)
    expect(a.w).toEqual(1)

    let b = a.clone()
    expect(b.x).toEqual(a.x)
    expect(b.y).toEqual(a.y)
    expect(b.z).toEqual(a.z)
    expect(b.w).toEqual(a.w)
})
