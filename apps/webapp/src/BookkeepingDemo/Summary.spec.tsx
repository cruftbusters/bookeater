import { afterEach, describe, expect, test } from 'vitest'
import { SummaryContainer } from './Summary'
import { cleanup, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { entry } from './types'

afterEach(cleanup)

describe(SummaryContainer, () => {
  test('empty summary', () => {
    render(<SummaryContainer entries={[]} />)
    expect(
      screen.getByText('summary: nothing to report :)'),
    ).toBeInTheDocument()
  })
  test('shallow summary', () => {
    render(
      <SummaryContainer
        entries={[
          entry((e) => ({
            ...e,
            debitAccount: 'assets',
            creditAccount: 'income',
            amount: 1234,
          })),
        ]}
      />,
    )
    const summary = within(screen.getByText('summary:'))
    expect(summary.getByText(/^assets: /).textContent).toEqual(
      'assets: debit 1234',
    )
    expect(summary.getByText(/^income: /).textContent).toEqual(
      'income: credit 1234',
    )
  })
  test('deep summary', () => {
    render(
      <SummaryContainer
        entries={[
          entry((e) => ({
            ...e,
            debitAccount: 'assets:invoice receivable',
            creditAccount: 'income',
            amount: 9999,
          })),
          entry((e) => ({
            ...e,
            debitAccount: 'assets:invoice receivable',
            creditAccount: 'income',
            amount: 8888,
          })),
          entry((e) => ({
            ...e,
            debitAccount: 'assets:bank account',
            creditAccount: 'assets:invoice receivable',
            amount: 9999,
          })),
        ]}
      />,
    )
    const summary = within(screen.getByText('summary:'))
    const assets = within(summary.getByText('assets:'))
    expect(assets.getByText(/^bank account: /).textContent).toEqual(
      'bank account: debit 9999',
    )
    expect(assets.getByText(/^invoice receivable: /).textContent).toEqual(
      'invoice receivable: debit 8888',
    )
    expect(summary.getByText(/^income: /).textContent).toEqual(
      'income: credit 18887',
    )
  })
  test('an account cannot be a category', () => {
    render(
      <SummaryContainer
        entries={[
          entry((e) => ({
            ...e,
            debitAccount: 'assets:invoice receivable',
            creditAccount: 'income',
            amount: 9999,
          })),
          entry((e) => ({
            ...e,
            debitAccount: 'assets',
            creditAccount: 'income',
            amount: 8888,
          })),
        ]}
      />,
    )
    expect(
      screen.getByText(`summary: Error: 'assets' cannot be both an account and category`),
    ).toBeInTheDocument()
  })
  test('a category cannot be an account', () => {
    render(
      <SummaryContainer
        entries={[
          entry((e) => ({
            ...e,
            debitAccount: 'assets',
            creditAccount: 'income',
            amount: 8888,
          })),
          entry((e) => ({
            ...e,
            debitAccount: 'assets:invoice receivable',
            creditAccount: 'income',
            amount: 9999,
          })),
        ]}
      />,
    )
    expect(
      screen.getByText(`summary: Error: 'assets' cannot be both an account and category`),
    ).toBeInTheDocument()
  })
})
