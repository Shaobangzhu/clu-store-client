import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Register from '../src/pages/Register';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it('submits the username and required email and navigates only after success', async () => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true, data: { id: 'synthetic-user' }, meta: null }), {
    status: 201, headers: { 'Content-Type': 'application/json' },
  })));
  render(<MemoryRouter initialEntries={['/register']}><Routes>
    <Route path="/register" element={<Register />} />
    <Route path="/auth/signin" element={<p>Registration complete</p>} />
  </Routes></MemoryRouter>);
  fireEvent.change(screen.getByPlaceholderText('yourname'), { target: { value: 'synthetic-user' } });
  fireEvent.change(screen.getByPlaceholderText('name@example.com'), { target: { value: 'synthetic@example.test' } });
  const passwords = screen.getAllByPlaceholderText('••••••••');
  for (const input of passwords) fireEvent.change(input, { target: { value: 'synthetic-password' } });
  fireEvent.click(screen.getByRole('button', { name: '注册' }));
  await waitFor(() => expect(screen.getByText('Registration complete')).toBeTruthy());
  const request = vi.mocked(fetch).mock.calls[0]?.[0];
  if (!(request instanceof Request)) throw new Error('Missing request');
  expect(request.method).toBe('POST');
  expect(await request.json()).toEqual({ username: 'synthetic-user', email: 'synthetic@example.test', password: 'synthetic-password', confirmPassword: 'synthetic-password' });
});
