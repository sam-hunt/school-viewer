/**
 * Domain-specific query result type as a discriminated union
 * Abstracts away the underlying data fetching implementation (TanStack Query)
 *
 * This discriminated union allows TypeScript to narrow types based on isPending and error:
 * - When isPending is false and error is null, data is guaranteed to be T
 * - When isPending is false and error exists, data is guaranteed to be undefined
 * - When isPending is true, both data and error are guaranteed to be undefined/null
 */
export type QueryResult<T> =
  | { isPending: true; data: undefined; error: null }
  | { isPending: false; data: T; error: null }
  | { isPending: false; data: undefined; error: Error };
