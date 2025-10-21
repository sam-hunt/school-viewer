import type { School } from './School';

/**
 * Raw school record from the API where enrollment numbers may be null
 */
export type SchoolApiRecord = Omit<School, 'maori' | 'pacific' | 'european' | 'asian' | 'melaa' | 'international' | 'other' | 'total'> & {
  maori: number | null;
  pacific: number | null;
  european: number | null;
  asian: number | null;
  melaa: number | null;
  international: number | null;
  other: number | null;
  total: number | null;
};

/**
 * The response structure of a request to the NZ Government Schools Directory API
 * @remarks ApiResult.success determines which of `result` or `error` fields also exist
 */
interface ApiSuccessResult {
  help: string;
  success: true;
  result: {
    records: SchoolApiRecord[];
    fields: { type: string; id: string }[];
    sql: string;
  };
}

interface ApiErrorResult {
  help: string;
  success: false;
  error: {
    info: {
      params: unknown[];
      statement: string[];
      orig: string[];
    };
    __type: string;
  };
}

export type ApiResult = ApiSuccessResult | ApiErrorResult;
