import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage the document title with cleanup.
 *
 * @param title - The title to set for the document. Pass undefined or an empty string to skip setting the title.
 * @param defaultTitle - The default title to restore when the component unmounts (defaults to 'Schools Viewer')
 *
 * @example
 * ```tsx
 * // Simple usage with a static title
 * useDocumentTitle('About - Schools Viewer');
 *
 * // Dynamic title based on data
 * useDocumentTitle(school ? `${school.name} - Schools Viewer` : undefined);
 * ```
 */
export const useDocumentTitle = (title?: string, defaultTitle = 'Schools Viewer') => {
  const prevTitleRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Only update if title is provided and different from the current one
    if (title && title !== prevTitleRef.current) {
      document.title = title;
      prevTitleRef.current = title;
    }
  }, [title]);

  // Separate effect for cleanup on unmount only
  useEffect(() => {
    return () => {
      document.title = defaultTitle;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};

