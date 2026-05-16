import { beforeEach, describe, expect, it } from 'vitest';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../test-utils';
import { Route, Routes } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { authStore } from '../stores';

describe('LoginPage', () => {
  beforeEach(() => {
    authStore.logout();
    sessionStorage.clear();
  });

  it('authenticates and redirects to home on submit', async () => {
    renderWithProviders(
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/' element={<div>Home content</div>} />
      </Routes>,
      { route: '/login' },
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password');
    await userEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/home content/i)).toBeInTheDocument();
    expect(authStore.isAuthenticated).toBe(true);
  });
});
