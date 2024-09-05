import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'
import '@testing-library/jest-dom/vitest'
import { PrettyDuration } from './PrettyDuration.tsx'

describe(PrettyDuration, () => {
  test('hours', () => {
    render(<PrettyDuration seconds={60 * 60 * 6} />)

    expect(screen.getByText('6h')).toBeInTheDocument()
  })
  test('hours and minutes', () => {
    render(<PrettyDuration seconds={60 * 60 * 4.33} />)

    expect(screen.getByText('4h20m')).toBeInTheDocument()
  })
  test('quarter hour', () => {
    render(<PrettyDuration seconds={60 * 60 * 0.25} />)

    expect(screen.getByText('15m')).toBeInTheDocument()
  })
  test('less than five minutes', () => {
    render(<PrettyDuration seconds={60 * 4} />)

    expect(screen.getByText('4m')).toBeInTheDocument()
  })
  test('less than five minutes with seconds', () => {
    render(<PrettyDuration seconds={60 * 4.5} />)

    expect(screen.getByText('4m30s')).toBeInTheDocument()
  })
})
