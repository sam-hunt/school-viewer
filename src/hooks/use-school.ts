import { SchoolListItem } from '../models/school-list-item.interface';
import { School } from '../models/school.interface';
import { useQuery } from '@tanstack/react-query';

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
type ApiResult = ApiSuccessResult | ApiErrorResult;

const apiQueryUrl = `https://catalogue.data.govt.nz/api/3/action/datastore_search_sql`;
const schoolsDirectoryResourceId = '4b292323-9fcc-41f8-814b-3c7b19cf14b3';

const fetchSchool = async (schoolId: string): Promise<School | null> => {
  if (!schoolId) return null;
  const url = new URL(apiQueryUrl);
  const sql = `
    SELECT
      "School_Id" as "schoolId",
      "Org_Name" as "orgName",
      "Org_Type" as "orgType",
      "Authority" as "authority",

      "Add1_City" as "add1City",
      "Add1_Suburb" as "add1Suburb",
      "Add1_Line1" as "add1Line1",

      "Add2_City" as "add2City",
      "Add2_Suburb" as "add2Suburb",
      "Add2_Line1" as "add2Line1",
      "Add2_Postal_Code" as "add2PostalCode",

      "Latitude" as "latitude",
      "Longitude" as "longitude",

      "Māori" as "maori",
      "Pacific" as "pacific",
      "European" as "european",
      "Asian" as "asian",
      "MELAA" as "melaa",
      "International" as "international",
      "Other" as "other",
      "Total" as "total",

      "Telephone" as "telephone",
      "Email" as "email",
      "URL" as "url",
      "Contact1_Name" as "contact1Name",

      "Education_Region" as "educationRegion",
      "General_Electorate" as "generalElectorate",
      "Māori_Electorate" as "maoriElectorate",

      "School_Donations" as "schoolDonations",
      "Isolation_Index" as "isolationIndex",
      "CoEd_Status" as "coEdStatus",
      "EQi_Index" as "eqiIndex",
      "Definition" as "definition",
      "Roll_Date" as "rollDate"
    FROM
      "${schoolsDirectoryResourceId}"
    WHERE
      "School_Id" = '${schoolId}'
    `
    .trim()
    .replace(/\s\s+/g, ' ');
  url.search = new URLSearchParams({ sql }).toString();

  const apiResult: ApiResult = await fetch(url.toString())
    .then(r => r.json())
    .catch(e => {
      throw new Error(`Failed to fetch school from api. Error: ${JSON.stringify(e)}`);
    });

  if (!apiResult.success) {
    throw new Error(`Failed to fetch school from api. Error: ${JSON.stringify(apiResult!.error)}. For more help, visit: ${apiResult.help}`);
  }
  return apiResult!.result!.records[0];
};

const fetchSchoolList = async (): Promise<SchoolListItem[]> => {
  const url = new URL(apiQueryUrl);
  const sql = `
    SELECT
      "School_Id" as "schoolId",
      "Org_Name" as "name",
      "Add1_City" as "city",
      "URL" as "url",
      "Latitude"::double precision as "lat",
      "Longitude"::double precision as "lng",
      CASE WHEN "Māori" IS NULL THEN 0 ELSE "Māori"::int END as "maori",
      CASE WHEN "Pacific" IS NULL THEN 0 ELSE "Pacific"::int END as "pacific",
      CASE WHEN "European" IS NULL THEN 0 ELSE "European"::int END as "european",
      CASE WHEN "Asian" IS NULL THEN 0 ELSE "Asian"::int END as "asian",
      CASE WHEN "MELAA" IS NULL THEN 0 ELSE "MELAA"::int END as "melaa",
      CASE WHEN "International" IS NULL THEN 0 ELSE "International"::int END as "international",
      CASE WHEN "Other" IS NULL THEN 0 ELSE "Other"::int END as "other",
      CASE WHEN "Total" IS NULL THEN 0 ELSE "Total"::int END as "total",
      1 as "count"
    FROM
      "${schoolsDirectoryResourceId}"
    `
    .trim()
    .replace(/\s\s+/g, ' ');
  url.search = new URLSearchParams({ sql }).toString();

  const apiResult: ApiResult = await fetch(url.toString())
    .then(response => response.json())
    .catch(error => {
      throw new Error(`Failed to fetch school from api. Error: ${JSON.stringify(error)}`);
    });

  if (!apiResult.success) {
    throw new Error(`Failed to fetch school from api. Error: ${JSON.stringify(apiResult.error)}. For more help, visit: ${apiResult.help}`);
  }
  // Cast to SchoolListItem[] since the query returns different fields than School
  return apiResult.result.records as unknown as SchoolListItem[];
};

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
