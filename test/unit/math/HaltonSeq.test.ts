import { test, expect } from 'vitest'
import { HaltonSeq } from '@orillusion/core'

test('HaltonSeq test', () => {
    let list: number[] = []
    for (let i = 0; i < 100; i++) {
        let v = HaltonSeq.get(i, 100)
        list.push(v)
    }

    let error = false
    for (let j = 0; j < list.length; j++) {
        const value = list[j]
        let index = list.indexOf(value)
        if (index != j && index != -1) {
            error = true
        }
    }
    expect(error).toEqual(false)
})
