import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useWindowSize } from './useWindowSize';

describe('useWindowSize', () => {
  const originalInnerWidth = window.innerWidth;
  const originalInnerHeight = window.innerHeight;

  beforeEach(() => {
    // Set initial window size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  it('should return current window dimensions after mount', async () => {
    const { result } = renderHook(() => useWindowSize());

    // Wait for the effect to run
    await waitFor(() => {
      expect(result.current.width).toBe(1024);
      expect(result.current.height).toBe(768);
    });
  });

  it('should update dimensions when window is resized', async () => {
    const { result } = renderHook(() => useWindowSize());

    // Wait for initial dimensions
    await waitFor(() => {
      expect(result.current.width).toBe(1024);
    });

    // Resize the window
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    });

    // Trigger resize event
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    // Wait for update
    await waitFor(() => {
      expect(result.current.width).toBe(1920);
      expect(result.current.height).toBe(1080);
    });
  });

  it('should handle multiple resize events', async () => {
    const { result } = renderHook(() => useWindowSize());

    await waitFor(() => {
      expect(result.current.width).toBe(1024);
    });

    // First resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 600,
    });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(result.current.width).toBe(800);
      expect(result.current.height).toBe(600);
    });

    // Second resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1440,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 900,
    });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    await waitFor(() => {
      expect(result.current.width).toBe(1440);
      expect(result.current.height).toBe(900);
    });
  });

  it('should remove event listener on unmount', async () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useWindowSize());

    await waitFor(() => {
      expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    removeEventListenerSpy.mockRestore();
  });

  it('should handle small mobile dimensions', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });

    const { result } = renderHook(() => useWindowSize());

    await waitFor(() => {
      expect(result.current.width).toBe(375);
      expect(result.current.height).toBe(667);
    });
  });

  it('should handle large desktop dimensions', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 2560,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1440,
    });

    const { result } = renderHook(() => useWindowSize());

    await waitFor(() => {
      expect(result.current.width).toBe(2560);
      expect(result.current.height).toBe(1440);
    });
  });
});
