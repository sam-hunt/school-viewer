import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSchoolList } from './fetchSchoolList';
import { clearAllMocks } from '../../test/clearAllMocks';

describe('fetchSchoolList', () => {
  beforeEach(clearAllMocks);

  it('should call fetch', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, result: { records: [] } }),
    });
    global.fetch = mockFetch;

    await fetchSchoolList();

    expect(mockFetch).toHaveBeenCalled();
  });

  it('should call the correct API endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, result: { records: [] } }),
    });
    global.fetch = mockFetch;

    await fetchSchoolList();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(import.meta.env.VITE_API_QUERY_URL as string)
    );
  });
});
