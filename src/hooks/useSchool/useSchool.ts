import { useQuery } from '@tanstack/react-query';
import type { School } from '../../models/School';
import type { QueryResult } from '../../models/QueryResult';
import { fetchSchool } from './fetchSchool';

/**
 * Hook to fetch a single school by ID
 * @param schoolId - The school ID to fetch
 * @returns Query result with school data, loading state, and error
 */
export const useSchool = (schoolId: string): QueryResult<School | null> => {
  const { data, error, isPending } = useQuery({
    queryKey: ['school', schoolId],
    queryFn: () => fetchSchool(schoolId),
    enabled: !!schoolId, // Only run query if schoolId exists
  });

  if (isPending) return { isPending: true, data: undefined, error: null };
  if (error) return { isPending: false, data: undefined, error };

  return { isPending: false, data, error: null };
};
