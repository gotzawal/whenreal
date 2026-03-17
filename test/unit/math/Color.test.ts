import { test, expect } from 'vitest'
import { Color } from '@orillusion/core'

test('Color hex test', () => {
    let color = Color.hexRGBColor(Color.WHITE)
    expect(color.r).toEqual(1)
    expect(color.g).toEqual(1)
    expect(color.b).toEqual(1)
})

test('Color hdr test', () => {
    let color = new Color(1, 0.5, 0.3, 5.0)
    color.convertToHDRRGB()

    expect(color.r).toEqual(79.62623999999998)
    expect(color.g).toEqual(39.81311999999999)
    expect(color.b).toEqual(23.887871999999994)
})

test('Color Copy test', () => {
    let color = new Color(1, 0.0, 0.0, 1.0)
    color.copyFromArray([255, 255, 255, 255], 255)

    expect(color.r).toEqual(1)
    expect(color.g).toEqual(1)
    expect(color.b).toEqual(1)
})
