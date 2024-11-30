export interface ISchool {
  // Identifiying details
  schoolId: string;
  orgName: string;
  orgType: string;
  authority: string;

  // Address1
  add1City: string;
  add1Suburb: string;
  add1Line1: string;

  // Address2
  add2City: string;
  add2Suburb: string;
  add2Line1: string;
  add2PostalCode: string;

  // Mapping
  latitude: number;
  longitude: number;

  // Enrolment numbers
  maori: number;
  pacific: number;
  european: number;
  asian: number;
  melaa: number;
  international: number;
  other: number;
  total: number;

  // Contact Information
  telephone: string;
  email: string;
  url: string;
  contact1Name: string;

  // Misc Locational
  educationRegion: string;
  generalElectorate: string;
  maoriElectorate: string;

  // Misc Other
  schoolDonations: string;
  isolationIndex: string;
  coEdStatus: string;
  eqiIndex: string;
  definition: string;
  rollDate: string;
}
