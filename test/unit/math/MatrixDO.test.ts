import { test, expect, beforeAll } from 'vitest'
import { WasmMatrix } from '@orillusion/wasm-matrix/WasmMatrix'
import { Matrix4 } from '@orillusion/core'

beforeAll(async () => {
    await WasmMatrix.init(Matrix4.allocCount)
})

test('MatrixDO create test', () => {
    let mat_0 = new Matrix4()
})

test('MatrixDO create 5000 test', () => {
    for (let i = 0; i < 5000; i++) {
        let mat_0 = new Matrix4()
    }
})

test('MatrixDO create 5000 with index test', () => {
    let list: number[] = []
    for (let i = 0; i < 5000; i++) {
        let mat_0 = new Matrix4()
        list.push(mat_0.index)
    }

    expect(list.length).toEqual(5000)
})
