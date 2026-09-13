import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import Login from './Login'
import * as authApi from '../api/auth'

vi.mock('../api/auth')

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<p>Board Page</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders username and password fields with a link to register', () => {
    renderLogin()

    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute(
      'href',
      '/register',
    )
  })

  it('shows the error message when login fails', async () => {
    const user = userEvent.setup()
    authApi.login.mockRejectedValue(new Error('Invalid credentials'))

    renderLogin()

    await user.type(screen.getByPlaceholderText('Username'), 'sam')
    await user.type(screen.getByPlaceholderText('Password'), 'wrongpass')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument()
  })

  it('navigates to the board after a successful login', async () => {
    const user = userEvent.setup()
    authApi.login.mockResolvedValue('fake-jwt-token')
    authApi.getMe.mockResolvedValue({ id: '1', username: 'sam', email: 'sam@example.com' })

    renderLogin()

    await user.type(screen.getByPlaceholderText('Username'), 'sam')
    await user.type(screen.getByPlaceholderText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    await waitFor(() => expect(screen.getByText('Board Page')).toBeInTheDocument())
    expect(localStorage.getItem('token')).toBe('fake-jwt-token')
  })
})
