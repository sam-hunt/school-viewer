import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useSchoolList } from './useSchoolList';
import { clearAllMocks } from '../../test/clearAllMocks';
import type { SchoolListItem } from '../../models/SchoolListItem';

vi.mock('@tanstack/react-query');

const mockUseQuery = vi.mocked(useQuery);

const mockSchoolListData: SchoolListItem[] = [
  {
    schoolId: '1',
    name: 'Test Primary School',
    city: 'Wellington',
    url: 'https://test-primary.school.nz',
    lat: -41.2865,
    lng: 174.7762,
    maori: 10,
    pacific: 5,
    european: 30,
    asian: 15,
    melaa: 2,
    international: 3,
    other: 5,
    total: 70,
    count: 1,
  },
  {
    schoolId: '2',
    name: 'Another School',
    city: 'Auckland',
    url: 'https://another.school.nz',
    lat: -36.8485,
    lng: 174.7633,
    maori: 20,
    pacific: 10,
    european: 40,
    asian: 25,
    melaa: 3,
    international: 5,
    other: 7,
    total: 110,
    count: 1,
  },
];

describe('useSchoolList', () => {
  beforeEach(clearAllMocks);

  it('should call useQuery with correct parameters', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as any);

    renderHook(() => useSchoolList());

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['schools'],
      queryFn: expect.any(Function),
    });
  });

  it('should return pending state when query is pending', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as any);

    const { result } = renderHook(() => useSchoolList());

    expect(result.current).toEqual({
      isPending: true,
      data: undefined,
      error: null,
    });
  });

  it('should return success state with data when query succeeds', () => {
    mockUseQuery.mockReturnValue({
      data: mockSchoolListData,
      error: null,
      isPending: false,
    } as any);

    const { result } = renderHook(() => useSchoolList());

    expect(result.current).toEqual({
      isPending: false,
      data: mockSchoolListData,
      error: null,
    });
  });

  it('should return error state when query fails', () => {
    const mockError = new Error('API Error');
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: mockError,
      isPending: false,
    } as any);

    const { result } = renderHook(() => useSchoolList());

    expect(result.current).toEqual({
      isPending: false,
      data: undefined,
      error: mockError,
    });
  });

  it('should return array of SchoolListItem objects with correct properties', () => {
    mockUseQuery.mockReturnValue({
      data: mockSchoolListData,
      error: null,
      isPending: false,
    } as any);

    const { result } = renderHook(() => useSchoolList());

    expect(result.current.data).toHaveLength(2);

    const firstSchool = result.current.data![0];
    expect(firstSchool).toHaveProperty('schoolId');
    expect(firstSchool).toHaveProperty('name');
    expect(firstSchool).toHaveProperty('city');
    expect(firstSchool).toHaveProperty('url');
    expect(firstSchool).toHaveProperty('lat');
    expect(firstSchool).toHaveProperty('lng');
    expect(firstSchool).toHaveProperty('total');
    expect(firstSchool).toHaveProperty('count');
  });

  it('should provide correct discriminated union type guarantees', () => {
    mockUseQuery.mockReturnValue({
      data: mockSchoolListData,
      error: null,
      isPending: false,
    } as any);

    const { result } = renderHook(() => useSchoolList());

    // Type narrowing test: when not pending and no error, data must be defined
    if (!result.current.isPending && !result.current.error) {
      // TypeScript should know result.current.data is SchoolListItem[]
      expect(result.current.data).toBeDefined();
      expect(Array.isArray(result.current.data)).toBe(true);
      expect(result.current.error).toBeNull();
    }
  });
});
