// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';
import { MockStorage } from '../../test/mockStorage';

describe('useLocalStorage', () => {
  let mockStorage: MockStorage;
  let originalLocalStorage: Storage;
  let originalConsoleError: typeof console.error;
  const testKey = 'test-key';

  beforeEach(() => {
    originalLocalStorage = window.localStorage;
    mockStorage = new MockStorage();
    Object.defineProperty(window, 'localStorage', { value: mockStorage, writable: true });
    originalConsoleError = console.error;
    console.error = () => void 0;
  });

  afterEach(() => {
    Object.defineProperty(window, 'localStorage', { value: originalLocalStorage, writable: true });
    console.error = originalConsoleError;
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage<string>(testKey, 'initial-value'));
    const getValue = () => result.current[0];
    expect(getValue()).toBe('initial-value');
    expect(mockStorage.data.has(testKey)).toBe(false);
  });

  it('should return stored value when localStorage has data', () => {
    mockStorage.setItem(testKey, JSON.stringify('stored-value'));
    const { result } = renderHook(() => useLocalStorage<string>('test-key', 'initial-value'));
    const getValue = () => result.current[0];
    expect(getValue()).toBe('stored-value');
  });

  it('should persist value to localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage<string>(testKey, 'initial-value'));
    const getValue = () => result.current[0];
    const setValue = (value: string) => result.current[1](value);

    act(() => setValue('new-value'));

    expect(getValue()).toBe('new-value');
    expect(mockStorage.getItem(testKey)).toBe(JSON.stringify('new-value'));
  });

  it('should persist correct value for functional updates', () => {
    mockStorage.setItem(testKey, JSON.stringify(10));
    const { result } = renderHook(() => useLocalStorage<number>('test-key', 10));
    const getValue = () => result.current[0];
    const setValue = (value: number | ((prev: number) => number)) => result.current[1](value);

    act(() => setValue((prev) => prev + 5));

    expect(getValue()).toBe(15);
    expect(mockStorage.getItem(testKey)).toBe(JSON.stringify(15));
  });

  it('should serialize complex objects correctly', () => {
    interface ComplexObject { name: string; nested: { value: number } }
    const complexObject: ComplexObject = { name: 'Test', nested: { value: 42 } };
    const { result } = renderHook(() => useLocalStorage(testKey, complexObject));
    const getValue = () => result.current[0];
    const setValue = (value: ComplexObject) => result.current[1](value);

    act(() => setValue({ name: 'Updated', nested: { value: 100 } }));

    expect(getValue()).toEqual({ name: 'Updated', nested: { value: 100 } });
    expect(mockStorage.getItem(testKey)).toBe(JSON.stringify({ name: 'Updated', nested: { value: 100 } }));
  });

  it('should serialize arrays correctly', () => {
    const { result } = renderHook(() => useLocalStorage<number[]>(testKey, [1, 2, 3]));
    const getValue = () => result.current[0];
    const setValue = (value: number[]) => result.current[1](value);

    act(() => setValue([4, 5, 6]));

    expect(getValue()).toEqual([4, 5, 6]);
    expect(mockStorage.getItem(testKey)).toBe(JSON.stringify([4, 5, 6]));
  });

  it('should return initial value and console.error if getItem throws', () => {
    mockStorage.getItem = () => { throw new Error('localStorage error'); };
    const { result } = renderHook(() => useLocalStorage<string>('test-key', 'fallback-value'));
    const getValue = () => result.current[0];

    expect(getValue()).toBe('fallback-value');
  });

  it('should update state and console.error if setItem throws', () => {
    mockStorage.setItem = () => { throw new Error('localStorage is full'); };
    const { result } = renderHook(() => useLocalStorage<string>('test-key', 'initial'));
    const getValue = () => result.current[0];
    const setValue = (value: string) => result.current[1](value);

    act(() => setValue('new-value'));

    expect(getValue()).toBe('new-value');
  });

  it('should return initial value and console.error if stored value is invalid JSON', () => {
    mockStorage.setItem('test-key', 'invalid-json{');
    const { result } = renderHook(() => useLocalStorage<string>('test-key', 'fallback'));
    const getValue = () => result.current[0];

    expect(getValue()).toBe('fallback');
  });

  it('should work with boolean values', () => {
    mockStorage.setItem('bool-key', JSON.stringify(false));
    const { result } = renderHook(() => useLocalStorage<boolean>('bool-key', false));
    const getValue = () => result.current[0];
    const setValue = (value: boolean) => result.current[1](value);

    expect(getValue()).toBe(false);
    act(() => setValue(true));
    expect(getValue()).toBe(true);
    expect(mockStorage.getItem('bool-key')).toBe(JSON.stringify(true));
  });

  it('should work with number values', () => {
    mockStorage.setItem('num-key', JSON.stringify(42));
    const { result } = renderHook(() => useLocalStorage<number>('num-key', 42));
    const getValue = () => result.current[0];
    const setValue = (value: number) => result.current[1](value);

    expect(getValue()).toBe(42);
    act(() => setValue(100));
    expect(getValue()).toBe(100);
    expect(mockStorage.getItem('num-key')).toBe(JSON.stringify(100));
  });

  it('should work with string values', () => {
    mockStorage.setItem('str-key', JSON.stringify('hello'));
    const { result } = renderHook(() => useLocalStorage<string>('str-key', 'hello'));
    const getValue = () => result.current[0];
    const setValue = (value: string) => result.current[1](value);

    expect(getValue()).toBe('hello');
    act(() => setValue('world'));
    expect(getValue()).toBe('world');
    expect(mockStorage.getItem('str-key')).toBe(JSON.stringify('world'));
  });

  it('should not write to localStorage on mount', () => {
    renderHook(() => useLocalStorage<string>('new-key', 'initial-value'));

    expect(mockStorage.data.has('new-key')).toBe(false);
  });

  it('should use the correct storage key for different hook instances', () => {
    mockStorage.setItem('key-1', JSON.stringify('value-1'));
    mockStorage.setItem('key-2', JSON.stringify('value-2'));

    const { result: result1 } = renderHook(() => useLocalStorage<string>('key-1', 'default'));
    const { result: result2 } = renderHook(() => useLocalStorage<string>('key-2', 'default'));
    const getValue1 = () => result1.current[0];
    const getValue2 = () => result2.current[0];

    expect(getValue1()).toBe('value-1');
    expect(getValue2()).toBe('value-2');
  });

  it('should write to the correct storage key when setValue is called', () => {
    const { result: result1 } = renderHook(() => useLocalStorage<string>('key-1', 'initial'));
    const { result: result2 } = renderHook(() => useLocalStorage<string>('key-2', 'initial'));
    const setValue1 = (value: string) => result1.current[1](value);
    const setValue2 = (value: string) => result2.current[1](value);

    act(() => setValue1('value-1'));
    act(() => setValue2('value-2'));

    expect(mockStorage.getItem('key-1')).toBe(JSON.stringify('value-1'));
    expect(mockStorage.getItem('key-2')).toBe(JSON.stringify('value-2'));
  });
});
