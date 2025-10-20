// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useDocumentTitle } from './useDocumentTitle';

describe('useDocumentTitle', () => {
  let originalTitle: string;

  beforeEach(() => void (originalTitle = document.title));
  afterEach(() => void (document.title = originalTitle));

  it('should set the document title when provided', () => {
    renderHook(() => useDocumentTitle('Test Title'));
    expect(document.title).toBe('Test Title');
  });

  it('should restore default title on unmount', () => {
    const { unmount } = renderHook(() => useDocumentTitle('Test Title'));
    expect(document.title).toBe('Test Title');

    unmount();
    expect(document.title).toBe('Schools Viewer');
  });

  it('should use custom default title when provided', () => {
    const { unmount } = renderHook(() => useDocumentTitle('Test Title', 'Custom Default'));
    expect(document.title).toBe('Test Title');

    unmount();
    expect(document.title).toBe('Custom Default');
  });

  it('should not set title when undefined is provided', () => {
    document.title = 'Initial Title';
    renderHook(() => useDocumentTitle(undefined));
    expect(document.title).toBe('Initial Title');
  });

  it('should not set title when empty string is provided', () => {
    document.title = 'Initial Title';
    renderHook(() => useDocumentTitle(''));
    expect(document.title).toBe('Initial Title');
  });

  it('should update title when title prop changes', () => {
    const { rerender } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: 'First Title' } }
    );
    expect(document.title).toBe('First Title');

    rerender({ title: 'Second Title' });
    expect(document.title).toBe('Second Title');
  });

  it('should not update title when it changes to the same value', () => {
    const { rerender } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: 'Same Title' } }
    );
    expect(document.title).toBe('Same Title');

    // Manually change title to test that hook doesn't reset it unnecessarily
    document.title = 'Same Title';
    rerender({ title: 'Same Title' });
    expect(document.title).toBe('Same Title');
  });

  it('should handle dynamic titles that change from undefined to a value', () => {
    const { rerender } = renderHook(
      ({ title }: { title: string | undefined }) => useDocumentTitle(title),
      { initialProps: { title: undefined as string | undefined } }
    );

    // Title should remain unchanged when undefined
    document.title = 'Loading...';
    rerender({ title: undefined });
    expect(document.title).toBe('Loading...');

    // Title should update when value is provided
    rerender({ title: 'Loaded Content' });
    expect(document.title).toBe('Loaded Content');
  });

  it('should handle title changing from value to undefined', () => {
    const { rerender } = renderHook(
      ({ title }: { title: string | undefined }) => useDocumentTitle(title),
      { initialProps: { title: 'Initial Title' as string | undefined } }
    );
    expect(document.title).toBe('Initial Title');

    // When title becomes undefined, it should not change the document title
    rerender({ title: undefined });
    expect(document.title).toBe('Initial Title');
  });

  it('should work with titles containing special characters', () => {
    const specialTitle = 'Test & Title | Special <Characters>';
    renderHook(() => useDocumentTitle(specialTitle));
    expect(document.title).toBe(specialTitle);
  });

  it('should work with very long titles', () => {
    const longTitle = 'A'.repeat(1000);
    renderHook(() => useDocumentTitle(longTitle));
    expect(document.title).toBe(longTitle);
  });

  it('should handle rapid title changes correctly', () => {
    const { rerender } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: 'Title 1' } }
    );

    rerender({ title: 'Title 2' });
    rerender({ title: 'Title 3' });
    rerender({ title: 'Title 4' });
    rerender({ title: 'Title 5' });

    expect(document.title).toBe('Title 5');
  });
});

