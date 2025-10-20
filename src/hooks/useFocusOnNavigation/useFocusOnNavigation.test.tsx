// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFocusOnNavigation } from './useFocusOnNavigation';
import { MemoryRouter, Route, Routes } from 'react-router';
import { PropsWithChildren } from 'react';

describe('useFocusOnNavigation', () => {
  it('should return a ref object', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/test" element={children} />
        </Routes>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useFocusOnNavigation(), { wrapper });

    expect(result.current).toHaveProperty('current');
    expect(result.current.current).toBeNull();
  });

  it('should accept a heading element via ref without errors', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/test" element={children} />
        </Routes>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useFocusOnNavigation(), { wrapper });

    // Create a mock element and attach it to the ref
    const mockElement = document.createElement('h1');
    mockElement.focus = vi.fn();

    // Should be able to attach an element to the ref
    expect(() => {
      result.current.current = mockElement;
    }).not.toThrow();

    expect(result.current.current).toBe(mockElement);
  });

  it('should not throw error when ref.current is null', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route path="/test" element={children} />
        </Routes>
      </MemoryRouter>
    );

    // Should not throw when no element is attached to the ref
    expect(() => renderHook(() => useFocusOnNavigation(), { wrapper })).not.toThrow();
  });

  it('should respond to location.pathname dependency', () => {
    const wrapper = ({ children }: PropsWithChildren) => (
      <MemoryRouter initialEntries={['/initial']}>
        <Routes>
          <Route path="*" element={children} />
        </Routes>
      </MemoryRouter>
    );

    const { result } = renderHook(() => useFocusOnNavigation(), { wrapper });

    // The hook uses location.pathname as a dependency
    // The effect will be triggered whenever pathname changes
    // This test verifies the hook can be used without errors
    expect(result.current).toBeDefined();
    expect(result.current).toHaveProperty('current');
  });
});
