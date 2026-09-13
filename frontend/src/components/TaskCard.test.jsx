import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import TaskCard from './TaskCard'

const baseTask = {
  id: '10',
  key: 'BUG-104',
  type: 'bug',
  severity: 'major',
  title: 'Fix login redirect loop',
  assignee: 'RV',
  status: 'To Do',
  dueDate: '2099-12-31',
  tag: 'auth',
}

function renderCard(task) {
  return render(
    <MemoryRouter>
      <TaskCard task={task} />
    </MemoryRouter>,
  )
}

describe('TaskCard', () => {
  it('renders the title, key, assignee, due date, and severity chip', () => {
    renderCard(baseTask)

    expect(
      screen.getByRole('heading', { name: 'Fix login redirect loop' }),
    ).toBeInTheDocument()
    expect(screen.getByText('BUG-104')).toBeInTheDocument()
    expect(screen.getByText('RV')).toBeInTheDocument()
    expect(screen.getByText('MAJOR')).toBeInTheDocument()
    expect(screen.getByText(/due 31 Dec/)).toBeInTheDocument()
    expect(screen.getByText('#auth')).toBeInTheDocument()
  })

  it('links the title to the task detail page', () => {
    renderCard(baseTask)

    expect(
      screen.getByRole('link', { name: 'Fix login redirect loop' }),
    ).toHaveAttribute('href', '/tasks/10')
  })

  it('marks a done task with the closed date and fixed chip', () => {
    const { container } = renderCard({ ...baseTask, status: 'Done' })

    expect(container.firstChild).toHaveClass('task-note', 'note-green')
    expect(screen.getByText('FIXED')).toBeInTheDocument()
    expect(screen.getByText(/closed 31 Dec/)).toBeInTheDocument()
  })
})
