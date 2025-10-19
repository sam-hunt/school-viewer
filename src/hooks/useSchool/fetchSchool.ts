import type { School } from '../../models/School';
import type { ApiResult } from '../../models/SchoolsApiResponse';

const apiQueryUrl = import.meta.env.VITE_API_QUERY_URL;
const schoolsDirectoryResourceId = import.meta.env.VITE_SCHOOLS_DIRECTORY_RESOURCE_ID;

export const fetchSchool = async (schoolId: string): Promise<School | null> => {
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
    .catch(() => {
      throw new Error('Unable to connect to the schools database. Please check your internet connection and try again.');
    });

  if (!apiResult.success) {
    throw new Error('The schools database is currently unavailable. Please try again later.');
  }
  return apiResult!.result!.records[0];
};
