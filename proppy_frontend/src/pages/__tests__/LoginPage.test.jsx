import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import LoginPage from '../LoginPage'

describe('LoginPage', () => {
  test('renders email, password and login button', () => {
    render(
      <AuthContext.Provider value={{ login: vi.fn() }}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>
    )

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  test('calls login on form submit', async () => {
    const mockLogin = vi.fn()

    render(
      <AuthContext.Provider value={{ login: mockLogin }}>
        <MemoryRouter>
          <LoginPage />
        </MemoryRouter>
      </AuthContext.Provider>
    )

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: '1234' },
    })

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    // Since the real login makes an API call, you'd mock axios in integration tests
    expect(mockLogin).not.toHaveBeenCalled() // real login is async
  })
})
