// src/pages/__tests__/Dashboard.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../Dashboard';
import LoginPage from '../LoginPage';
import ProtectedRoute from '../../components/ProtectedRoute';
import { AuthContext } from '../../context/AuthContext';

describe('Dashboard access', () => {
  test('redirects to login if user is not logged in', async () => {
    render(
      <AuthContext.Provider value={{ user: null }}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Čekamo da se Login pojavi
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument()
    );
  });
});
