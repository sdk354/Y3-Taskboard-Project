import { describe, it, expect, vi, afterEach } from 'vitest'
import { formatShortDate, isOverdue } from './dates'
import { STATUS } from '../data/statuses'

describe('formatShortDate', () => {
  it('formats an ISO date as "day Mon"', () => {
    expect(formatShortDate('2026-08-12')).toBe('12 Aug')
  })

  it('returns an empty string for a missing date', () => {
    expect(formatShortDate('')).toBe('')
    expect(formatShortDate(undefined)).toBe('')
  })
})

describe('isOverdue', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('is true for a past due date that is not done', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-10'))

    expect(isOverdue({ dueDate: '2026-09-01', status: STATUS.TODO })).toBe(true)
  })

  it('is false once the task is done, even if the date has passed', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-10'))

    expect(isOverdue({ dueDate: '2026-09-01', status: STATUS.DONE })).toBe(false)
  })

  it('is false for a task with no due date', () => {
    expect(isOverdue({ dueDate: null, status: STATUS.TODO })).toBe(false)
  })
})
