import { describe, expect, test } from 'vitest'
import { duration } from './duration'

describe(duration, () => {
  test('days', () => {
    const actual = duration({
      start: '2024-01-01 00:00:00',
      end: '2024-01-02 00:00:00',
    })
    const expected = '1d'
    expect(actual).toBe(expected)
  })
  test('hours', () => {
    const actual = duration({
      start: '2024-01-01 00:00:00',
      end: '2024-01-01 04:00:00',
    })
    const expected = '4h'
    expect(actual).toBe(expected)
  })
  test('minutes', () => {
    const actual = duration({
      start: '2024-01-01 00:00:00',
      end: '2024-01-01 00:45:00',
    })
    const expected = '45m'
    expect(actual).toBe(expected)
  })
  test('seconds', () => {
    const actual = duration({
      start: '2024-01-01 00:00:00',
      end: '2024-01-01 00:00:25',
    })
    const expected = '25s'
    expect(actual).toBe(expected)
  })
  test('1d3h45m25s', () => {
    const actual = duration({
      start: '2024-01-01 00:00:00',
      end: '2024-01-02 03:45:25',
    })
    const expected = '1d3h45m25s'
    expect(actual).toBe(expected)
  })
  test('-1d3h45m25s', () => {
    const actual = duration({
      start: '2024-01-02 03:45:25',
      end: '2024-01-01 00:00:00',
    })
    const expected = '-1d3h45m25s'
    expect(actual).toBe(expected)
  })
  test('empty input is NaN', () => {
    const actual = duration({
      start: '',
      end: '',
    })
    const expected = 'NaN'
    expect(actual).toBe(expected)
  })
  test('start equals end', () => {
    const actual = duration({
      start: '2024-01-01 00:00:00',
      end: '2024-01-01 00:00:00',
    })
    const expected = '0s'
    expect(actual).toBe(expected)
  })
})
