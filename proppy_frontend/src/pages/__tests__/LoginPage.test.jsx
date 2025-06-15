import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import LoginPage from '../LoginPage';

test('shows validation errors for empty fields on submit', async () => {
  render(
    <AuthContext.Provider value={{ login: vi.fn() }}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>
  );

  const submitButton = screen.getByRole('button', { name: /login/i });

  await userEvent.click(submitButton);

  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  expect(screen.getByText(/password is required/i)).toBeInTheDocument();
});
