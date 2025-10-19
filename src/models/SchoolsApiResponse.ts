import type { School } from './School';

/**
 * The response structure of a request to the NZ Government Schools Directory API
 * @remarks ApiResult.success determines which of `result` or `error` fields also exist
 */
interface ApiSuccessResult {
  help: string;
  success: true;
  result: {
    records: School[];
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
