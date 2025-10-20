import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { School } from '../models/School';
import type { SchoolListItem } from '../models/SchoolListItem';

const API_URL = 'https://catalogue.data.govt.nz/api/3/action/datastore_search_sql';

// Mock data
export const mockSchool: School = {
  schoolId: '1',
  orgName: 'Test School',
  orgType: 'Full Primary',
  authority: 'State',
  add1City: 'Auckland',
  add1Suburb: 'Test Suburb',
  add1Line1: '123 Test St',
  add2City: 'Auckland',
  add2Suburb: 'Test Suburb',
  add2Line1: 'PO Box 123',
  add2PostalCode: '1010',
  latitude: -36.8485,
  longitude: 174.7633,
  maori: 10,
  pacific: 20,
  european: 30,
  asian: 25,
  melaa: 10,
  international: 5,
  other: 0,
  total: 100,
  telephone: '09-123-4567',
  email: 'test@school.nz',
  url: 'https://testschool.nz',
  contact1Name: 'John Doe',
  educationRegion: 'Auckland',
  generalElectorate: 'Test Electorate',
  maoriElectorate: 'Test Māori Electorate',
  schoolDonations: 'No',
  isolationIndex: 'Low',
  coEdStatus: 'Co-Ed',
  eqiIndex: '5',
  definition: 'Primary',
  rollDate: '2024-01-01',
};

export const mockSchoolList: SchoolListItem[] = [
  {
    schoolId: '1',
    name: 'Test School 1',
    city: 'Auckland',
    url: 'https://testschool1.nz',
    lat: -36.8485,
    lng: 174.7633,
    maori: 10,
    pacific: 20,
    european: 30,
    asian: 25,
    melaa: 10,
    international: 5,
    other: 0,
    total: 100,
    count: 1,
  },
  {
    schoolId: '2',
    name: 'Test School 2',
    city: 'Wellington',
    url: 'https://testschool2.nz',
    lat: -41.2865,
    lng: 174.7762,
    maori: 15,
    pacific: 25,
    european: 40,
    asian: 10,
    melaa: 5,
    international: 3,
    other: 2,
    total: 100,
    count: 1,
  },
];

// API handlers
export const handlers = [
  // Handler for fetching a single school
  http.get(API_URL, ({ request }) => {
    const url = new URL(request.url);
    const sql = url.searchParams.get('sql');

    if (!sql) {
      return HttpResponse.json({
        success: false,
        help: 'https://example.com/help',
        error: {
          __type: 'Validation Error',
          info: {
            params: [],
            statement: [],
            orig: ['SQL query required'],
          },
        },
      });
    }

    // Check if it's a single school query (contains WHERE clause with School_Id)
    if (sql.includes('WHERE') && sql.includes('School_Id')) {
      const schoolIdMatch = /"School_Id"\s*=\s*'(\d+)'/.exec(sql);
      const schoolId = schoolIdMatch ? schoolIdMatch[1] : null;

      if (schoolId === '999') {
        // Return error for school ID 999
        return HttpResponse.json({
          success: false,
          help: 'https://example.com/help',
          error: {
            __type: 'Not Found',
            info: {
              params: [],
              statement: [],
              orig: ['School not found'],
            },
          },
        });
      }

      return HttpResponse.json({
        success: true,
        help: 'https://example.com/help',
        result: {
          records: [mockSchool],
          fields: [],
          sql,
        },
      });
    }

    // Otherwise, return school list
    return HttpResponse.json({
      success: true,
      help: 'https://example.com/help',
      result: {
        records: mockSchoolList,
        fields: [],
        sql,
      },
    });
  }),
];

// Create and export the server
export const server = setupServer(...handlers);
