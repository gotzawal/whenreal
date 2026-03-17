import { test, expect } from 'vitest'
import { Bezier2D, Vector2 } from '@orillusion/core'

test('Bezier test', () => {
    let bezier2d = new Bezier2D([
        new Vector2(0.0, 0.0),
        new Vector2(0.5, 0.5),
        new Vector2(0.6, 1.0),
        new Vector2(0.8, 1.0),
        new Vector2(1.0, 1.0),
    ])

    let v = bezier2d.getValue(0.5)

    expect(v).toEqual(new Vector2(0.7, 1.0))
})
