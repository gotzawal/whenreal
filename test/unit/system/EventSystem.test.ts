import { test, expect } from 'vitest'
import { CEventDispatcher, UIEvent } from '@orillusion/core'

test('EventSystem register event', () => {
    let dispatcher = new CEventDispatcher()
    let callbackAction = () => {
        console.log('show UI')
    }
    let that = {}
    let id = dispatcher.addEventListener(UIEvent.SHOW, callbackAction, that)

    let containEvent: boolean = dispatcher.containEventListener(UIEvent.SHOW)
    let hasEvent: boolean = dispatcher.hasEventListener(UIEvent.SHOW, callbackAction, that)

    dispatcher.removeEventListenerAt(id)
    let removedEvent = dispatcher.containEventListener(UIEvent.SHOW)

    expect(id > 0).toEqual(true)
    expect(containEvent).toEqual(true)
    expect(hasEvent).toEqual(true)
    expect(removedEvent).toEqual(false)
})
