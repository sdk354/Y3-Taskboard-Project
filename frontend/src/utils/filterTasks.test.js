import { describe, it, expect } from 'vitest'
import { filterTasks } from './filterTasks'
import { CURRENT_USER } from '../data/users'

const tasks = [
  { title: 'Fix login bug', status: 'To Do', assignee: CURRENT_USER, type: 'bug' },
  { title: 'Write docs', status: 'Done', assignee: 'IS', type: 'task' },
  { title: 'Refactor board', status: 'To Do', assignee: 'RV', type: 'task' },
]

describe('filterTasks', () => {
  it('returns everything when no filters are given', () => {
    expect(filterTasks(tasks, {})).toHaveLength(3)
  })

  it('matches title by a case-insensitive query', () => {
    const result = filterTasks(tasks, { query: 'LOGIN' })
    expect(result).toEqual([tasks[0]])
  })

  it('filters by exact status', () => {
    const result = filterTasks(tasks, { status: 'Done' })
    expect(result).toEqual([tasks[1]])
  })

  it('filters by assignee', () => {
    const result = filterTasks(tasks, { assignee: 'RV' })
    expect(result).toEqual([tasks[2]])
  })

  it('view "bugs" keeps only bug-type tasks', () => {
    const result = filterTasks(tasks, { view: 'bugs' })
    expect(result).toEqual([tasks[0]])
  })

  it('view "mine" keeps only the current user\'s tasks', () => {
    const result = filterTasks(tasks, { view: 'mine' })
    expect(result).toEqual([tasks[0]])
  })

  it('combines multiple filters', () => {
    const result = filterTasks(tasks, { status: 'To Do', assignee: 'RV' })
    expect(result).toEqual([tasks[2]])
  })
})
