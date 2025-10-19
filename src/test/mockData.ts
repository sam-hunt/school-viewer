import { School } from '../models/School';
import { SchoolListItem } from '../models/SchoolListItem';

export const mockSchool: School = {
  // Identifying details
  schoolId: '123',
  orgName: 'Test Primary School',
  orgType: 'Primary School',
  authority: 'State',

  // Address1
  add1City: 'Wellington',
  add1Suburb: 'Thorndon',
  add1Line1: '123 Test Street',

  // Address2
  add2City: 'Wellington',
  add2Suburb: 'Thorndon',
  add2Line1: 'PO Box 456',
  add2PostalCode: '6011',

  // Mapping
  latitude: -41.2865,
  longitude: 174.7762,

  // Enrollment numbers
  maori: 50,
  pacific: 30,
  european: 100,
  asian: 40,
  melaa: 20,
  international: 10,
  other: 5,
  total: 255,

  // Contact Information
  telephone: '04-123-4567',
  email: 'test@school.nz',
  url: 'https://testschool.nz',
  contact1Name: 'Jane Smith',

  // Misc Locational
  educationRegion: 'Wellington',
  generalElectorate: 'Wellington Central',
  maoriElectorate: 'Te Tai Tonga',

  // Misc Other
  schoolDonations: 'Yes',
  isolationIndex: 'Low',
  coEdStatus: 'Co-Ed',
  eqiIndex: 'Medium',
  definition: 'Full Primary',
  rollDate: '2024-01-01',
};

export const mockSchoolListItems: SchoolListItem[] = [
  {
    schoolId: '1',
    name: 'Auckland Grammar School',
    city: 'Auckland',
    lat: -36.86,
    lng: 174.76,
    total: 500,
    url: 'https://school1.nz',
    maori: 10,
    pacific: 20,
    european: 300,
    asian: 150,
    melaa: 10,
    international: 5,
    other: 5,
    count: 1,
  },
  {
    schoolId: '2',
    name: 'Wellington High School',
    city: 'Wellington',
    lat: -41.28,
    lng: 174.77,
    total: 400,
    url: 'https://school2.nz',
    maori: 15,
    pacific: 25,
    european: 250,
    asian: 100,
    melaa: 5,
    international: 3,
    other: 2,
    count: 1,
  },
  {
    schoolId: '3',
    name: 'Christchurch Boys High School',
    city: 'Christchurch',
    lat: -43.53,
    lng: 172.63,
    total: 450,
    url: 'https://school3.nz',
    maori: 12,
    pacific: 18,
    european: 280,
    asian: 130,
    melaa: 7,
    international: 2,
    other: 1,
    count: 1,
  },
];
