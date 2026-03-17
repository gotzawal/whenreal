import { test, expect } from 'vitest'
import { UV } from '@orillusion/core'

test('UV', () => {
    let rect = new UV(0, 0)

    expect(rect.u).toEqual(0)
    expect(rect.v).toEqual(0)
})
