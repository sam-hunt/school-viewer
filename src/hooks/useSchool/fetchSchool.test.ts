import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchSchool } from './fetchSchool';
import { clearAllMocks } from '../../test/clearAllMocks';

describe('fetchSchool', () => {
  beforeEach(clearAllMocks);

  it('should call fetch when given a valid schoolId', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, result: { records: [{ schoolId: '123' }] } }),
    });
    global.fetch = mockFetch;

    await fetchSchool('123');

    expect(mockFetch).toHaveBeenCalled();
  });

  it('should call the correct API endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, result: { records: [{ schoolId: '123' }] } }),
    });
    global.fetch = mockFetch;

    await fetchSchool('123');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(import.meta.env.VITE_API_QUERY_URL as string)
    );
  });

  it('should return null without calling fetch when schoolId is empty', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch;

    const result = await fetchSchool('');

    expect(result).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
