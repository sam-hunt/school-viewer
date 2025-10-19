import { useQuery } from '@tanstack/react-query';
import type { SchoolListItem } from '../../models/SchoolListItem';
import type { QueryResult } from '../../models/QueryResult';
import { fetchSchoolList } from './fetchSchoolList';

/**
 * Hook to fetch the complete list of schools
 * @returns Query result with schools list, loading state, and error
 */
export const useSchoolList = (): QueryResult<SchoolListItem[]> => {
  const { data, error, isPending } = useQuery({
    queryKey: ['schools'],
    queryFn: fetchSchoolList,
  });

  if (isPending) return { isPending: true, data: undefined, error: null };
  if (error) return { isPending: false, data: undefined, error };

  return { isPending: false, data, error: null };
};
