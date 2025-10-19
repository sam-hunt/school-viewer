import type { SchoolListItem } from '../../models/SchoolListItem';
import type { ApiResult } from '../../models/SchoolsApiResponse';

const apiQueryUrl = import.meta.env.VITE_API_QUERY_URL;
const schoolsDirectoryResourceId = import.meta.env.VITE_SCHOOLS_DIRECTORY_RESOURCE_ID;

export const fetchSchoolList = async (): Promise<SchoolListItem[]> => {
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
    .catch(() => {
      throw new Error('Unable to connect to the schools database. Please check your internet connection and try again.');
    });

  if (!apiResult.success) {
    throw new Error('The schools database is currently unavailable. Please try again later.');
  }
  // Cast to SchoolListItem[] since the query returns different fields than School
  return apiResult.result.records as unknown as SchoolListItem[];
};
