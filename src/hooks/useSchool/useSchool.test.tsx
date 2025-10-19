import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useQuery } from '@tanstack/react-query';
import { useSchool } from './useSchool';
import { clearAllMocks } from '../../test/clearAllMocks';
import type { School } from '../../models/School';

vi.mock('@tanstack/react-query');

const mockUseQuery = vi.mocked(useQuery);

const mockSchoolData: School = {
  schoolId: '1',
  orgName: 'Test School',
  orgType: 'Primary',
  authority: 'State',
  add1City: 'Wellington',
  add1Suburb: 'Thorndon',
  add1Line1: '123 Test St',
  add2City: '',
  add2Suburb: '',
  add2Line1: '',
  add2PostalCode: '',
  latitude: -41.2865,
  longitude: 174.7762,
  maori: 10,
  pacific: 5,
  european: 30,
  asian: 15,
  melaa: 2,
  international: 3,
  other: 5,
  total: 70,
  telephone: '04-123-4567',
  email: 'test@school.nz',
  url: 'https://test.school.nz',
  contact1Name: 'John Doe',
  educationRegion: 'Wellington',
  generalElectorate: 'Wellington Central',
  maoriElectorate: 'Te Tai Tonga',
  schoolDonations: 'Yes',
  isolationIndex: '1',
  coEdStatus: 'Co-Ed',
  eqiIndex: '5',
  definition: 'Full Primary',
  rollDate: '2023-07-01',
};

describe('useSchool', () => {
  beforeEach(clearAllMocks);

  it('should call useQuery with correct parameters', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as any);

    renderHook(() => useSchool('123'));

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['school', '123'],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it('should disable query when schoolId is empty', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as any);

    renderHook(() => useSchool(''));

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['school', ''],
      queryFn: expect.any(Function),
      enabled: false,
    });
  });

  it('should return pending state when query is pending', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as any);

    const { result } = renderHook(() => useSchool('123'));

    expect(result.current).toEqual({
      isPending: true,
      data: undefined,
      error: null,
    });
  });

  it('should return success state with data when query succeeds', () => {
    mockUseQuery.mockReturnValue({
      data: mockSchoolData,
      error: null,
      isPending: false,
    } as any);

    const { result } = renderHook(() => useSchool('123'));

    expect(result.current).toEqual({
      isPending: false,
      data: mockSchoolData,
      error: null,
    });
  });

  it('should return success state with null when query returns null', () => {
    mockUseQuery.mockReturnValue({
      data: null,
      error: null,
      isPending: false,
    } as any);

    const { result } = renderHook(() => useSchool(''));

    expect(result.current).toEqual({
      isPending: false,
      data: null,
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

    const { result } = renderHook(() => useSchool('123'));

    expect(result.current).toEqual({
      isPending: false,
      data: undefined,
      error: mockError,
    });
  });

  it('should update queryKey when schoolId changes', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: null,
      isPending: true,
    } as any);

    const { rerender } = renderHook(({ id }) => useSchool(id), {
      initialProps: { id: '123' },
    });

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['school', '123'],
      queryFn: expect.any(Function),
      enabled: true,
    });

    mockUseQuery.mockClear();
    rerender({ id: '456' });

    expect(mockUseQuery).toHaveBeenCalledWith({
      queryKey: ['school', '456'],
      queryFn: expect.any(Function),
      enabled: true,
    });
  });

  it('should provide correct discriminated union type guarantees', () => {
    mockUseQuery.mockReturnValue({
      data: mockSchoolData,
      error: null,
      isPending: false,
    } as any);

    const { result } = renderHook(() => useSchool('123'));

    // Type narrowing test: when not pending and no error, data must be defined
    if (!result.current.isPending && !result.current.error) {
      // TypeScript should know result.current.data is School | null
      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
    }
  });
});
