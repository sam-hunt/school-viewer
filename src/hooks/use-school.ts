import { ISchoolListItem } from '../models/school-list-item.interface';
import { ISchool } from '../models/school.interface';
import { usePromise, UsePromise } from './use-promise';
import { useCallback } from 'react';

/**
 * The response structure of a request to the NZ Government Schools Directory API
 * @remarks IApiResult.success determines which of `result` or `error` fields also exist
 */
interface IApiResult {
  help: string;
  success: boolean;
  result?: {
    records: ISchool[];
    fields: { type: string; id: string }[];
    sql: string;
  };
  error?: {
    info: {
      params: unknown[];
      statement: string[];
      orig: string[];
    };
    __type: string;
  };
}

const apiQueryUrl = `https://catalogue.data.govt.nz/api/3/action/datastore_search_sql`;
const schoolsDirectoryResourceId = '20b7c271-fd5a-4c9e-869b-481a0e2453cd';

const fetchSchool = async (schoolId: string): Promise<ISchool | null> => {
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
      "Decile" as "decile",
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

  const apiResult: IApiResult = await fetch(url.toString())
    .then(r => r.json())
    .catch(e => {
      throw new Error(`Failed to fetch school from api. Error: ${JSON.stringify(e)}`);
    });

  if (!apiResult.success) {
    throw new Error(`Failed to fetch school from api. Error: ${JSON.stringify(apiResult!.error)}. For more help, visit: ${apiResult.help}`);
  }
  return apiResult!.result!.records[0];
};

const fetchSchoolList = async (): Promise<Partial<ISchool>[] | null> => {
  const url = new URL(apiQueryUrl);
  const sql = `
    SELECT
      "School_Id" as "schoolId",
      "Org_Name" as "name",
      "Add1_City" as "city",
      "URL" as "url",
      "Latitude"::double precision as "lat",
      "Longitude"::double precision as "lng",
      "Māori"::int as "maori",
      "Pacific"::int as "pacific",
      "European"::int as "european",
      "Asian"::int as "asian",
      "MELAA"::int as "melaa",
      "International"::int as "international",
      "Other"::int as "other",
      "Total"::int as "total",
      1 as "count"
    FROM
      "${schoolsDirectoryResourceId}"
    `
    .trim()
    .replace(/\s\s+/g, ' ');
  url.search = new URLSearchParams({ sql }).toString();

  const apiResult: IApiResult = await fetch(url.toString())
    .then(r => r.json())
    .catch(e => {
      throw new Error(`Failed to fetch school from api. Error: ${JSON.stringify(e)}`);
    });

  if (!apiResult.success) {
    throw new Error(`Failed to fetch school from api. Error: ${JSON.stringify(apiResult!.error)}. For more help, visit: ${apiResult.help}`);
  }
  return apiResult!.result!.records;
};

export const useSchool = (schoolId: string): UsePromise<ISchool> =>
  usePromise<ISchool | null>(
    useCallback(() => fetchSchool(schoolId), [schoolId]),
    null,
  );

export const useSchoolList = (): UsePromise<ISchoolListItem[]> =>
  usePromise<ISchoolListItem[] | null>(
    useCallback(() => fetchSchoolList(), []),
    null,
  );
