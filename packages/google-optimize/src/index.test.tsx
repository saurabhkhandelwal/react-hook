/* jest */
import * as React from 'react'
import {render, act} from '@testing-library/react'
import useGoogleOptimize from './index'

jest.useFakeTimers()
afterEach(() => jest.clearAllTimers())

describe('useOptimize', () => {
  it('should pick "3"', () => {
    // @ts-ignore
    window.gtag = (command, eventName, eventParams) => {
      if (eventParams.remove) return
      eventParams.callback(2)
    }

    const Optimize = () => {
      const variant = useGoogleOptimize('abc', [1, 2, 3])
      return <div>{JSON.stringify(variant)}</div>
    }

    expect(render(<Optimize />).asFragment()).toMatchSnapshot('<div>3</div>')
  })

  it('should timeout and default to "1"', () => {
    // @ts-ignore
    window.gtag = () => {
      return
    }

    const Optimize = () => {
      const variant = useGoogleOptimize('abc', [1, 2, 3], 3)
      return <div>{JSON.stringify(variant)}</div>
    }

    const {asFragment} = render(<Optimize />)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(asFragment()).toMatchSnapshot('<div>null</div>')
    act(() => jest.advanceTimersByTime(3000))
    expect(asFragment()).toMatchSnapshot('<div>1</div>')
  })

  it('should clear timeout', () => {
    // @ts-ignore
    window.gtag = (command, eventName, eventParams) => {
      if (eventParams.remove) return
      eventParams.callback(2)
    }

    const Optimize = () => {
      const variant = useGoogleOptimize('abc', [1, 2, 3], 1)
      return <div>{JSON.stringify(variant)}</div>
    }

    render(<Optimize />)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(clearTimeout).toHaveBeenCalledTimes(1)
  })
})
