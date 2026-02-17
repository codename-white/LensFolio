import { act, renderHook } from '@testing-library/react-native';
import React from 'react';
import { AuthProvider, useAuth } from '../hooks/useAuth';

// Wrapper for AuthProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('Authentication Logic', () => {
  it('should initialize with null user and loading state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
  });

  it('should login successfully with correct credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('admin@lensfolio.com', 'password');
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.email).toBe('admin@lensfolio.com');
    expect(result.current.user?.full_name).toBe('Admin Ultron');
  });

  it('should fail login with incorrect credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login('wrong@email.com', 'wrongpass');
      } catch (error) {
        // Expected error
      }
    });

    expect(result.current.user).toBeNull();
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login('admin@lensfolio.com', 'password');
    });

    expect(result.current.user).not.toBeNull();

    // Now logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBeNull();
  });
});
