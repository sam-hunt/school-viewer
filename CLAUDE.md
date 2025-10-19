# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

School Viewer is a React/TypeScript application that visualizes data from the New Zealand Government's Schooling Directory API. The app displays NZ schools on an interactive map with clustering capabilities and provides detailed information about individual schools including enrollment demographics, contact details, and location data.

**Key Technologies:**
- React 19 with TypeScript
- Vite 7 (build tool, migrated from Create React App)
- Material-UI (MUI) v7 for UI components
- Mapbox GL JS v2 for interactive mapping
- Nivo v0.99 for data visualizations (bar charts, pie charts)
- React Router v7 for routing

## Development Commands

```bash
# Start development server (runs on http://localhost:5173 with Vite)
npm run dev

# Build for production (runs TypeScript compiler + Vite build)
npm run build

# Lint all TypeScript files
npm run lint

# Preview production build locally
npm run preview

# Initialize git hooks (Husky)
npm run prepare
```

## Architecture

### Data Flow

The application fetches data from the NZ Government's Schooling Directory API using SQL queries:
- API endpoint: `https://catalogue.data.govt.nz/api/3/action/datastore_search_sql`
- Resource ID: `4b292323-9fcc-41f8-814b-3c7b19cf14b3`
- Data fetching logic is centralized in `src/hooks/use-school.ts`

### Core Hooks

**`usePromise` (`src/hooks/use-promise.ts`)**: Generic hook that wraps async operations, returning a tuple of `[value, error, isPending]`. This is the foundation for all API data fetching in the app.

**`useSchool` and `useSchoolList` (`src/hooks/use-school.ts`)**: Built on top of `usePromise`, these hooks fetch individual school data or the complete list of schools. They construct SQL queries to fetch specific fields from the API and transform the response into the `ISchool` or `ISchoolListItem` interfaces.

### Routing Structure

Routes are defined in `src/App/App.tsx`:
- `/` → redirects to `/schools`
- `/schools` → SchoolsListPage (searchable table of all schools)
- `/schools/:schoolId` → SchoolPage (detailed view of a single school)
- `/clusters` → ClustersPage (interactive clustered map view)
- `/about` → AboutPage (about the project)

### Page Components

**ClustersPage** (`src/pages/clusters-page/`):
- Displays all NZ schools on an interactive Mapbox GL clustered map
- Users can switch between different clustering metrics (school count, enrollment by ethnicity, total enrollment)
- Clicking a school/cluster navigates to the school detail page
- Map clustering is implemented in `MapboxglClusteredMap.tsx`

**SchoolsListPage** (`src/pages/schools-list-page/`):
- Paginated table of all schools with search functionality
- Uses Material-UI Table with custom pagination component

**SchoolPage** (`src/pages/school-page/`):
- Detailed view split into multiple card components (in `cards/` subdirectory):
  - `ContactCard.tsx`: Contact information
  - `DetailsCard.tsx`: School type, authority, education region
  - `EnrolmentsCard.tsx`: Enrollment demographics with Nivo visualizations
  - `MapCard.tsx`: Single school location on Mapbox
  - `MiscellaneousCard.tsx`: Additional school metadata

### State Management

No global state management library is used. State is managed through:
- React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`)
- Custom `usePromise` hook for async data
- `useLocalStorage` hook for persisting theme preference
- URL parameters for navigation state (school ID)

### Theming

The app uses MUI's theming system with a custom dark/light theme toggle:
- Theme provider: `src/components/ThemeProvider.tsx`
- Theme preference persisted to localStorage
- Uses MUI's `createTheme` with custom color schemes

### MUI v7 Migration Notes

The project uses MUI v7, which introduced breaking changes to the Grid component:
- The `item` prop has been removed
- Sizing props (`xs`, `sm`, `md`, etc.) are now passed via the `size` prop as an object
- Example: `<Grid size={{ md: 6, sm: 12 }}>` instead of `<Grid item md={6} sm={12}>`

## Environment Variables

Required environment variable (create `.env` file based on `.env.example`):
- `VITE_MAPBOX_KEY`: Mapbox API access token for map rendering

## Code Style

- TypeScript strict type checking enabled
- ESLint with TypeScript plugin and React Hooks rules
- Prettier for formatting (integrated with ESLint via `eslint-config-prettier`)
- Husky + lint-staged for pre-commit hooks (auto-formats and lints staged files)
- Interfaces prefixed with `I` (e.g., `ISchool`, `ISchoolListItem`)

## Key Data Models

**`ISchool`** (`src/models/school.interface.ts`): Complete school record with all fields including addresses, coordinates, enrollment demographics, contact info, and metadata.

**`ISchoolListItem`** (`src/models/school-list-item.interface.ts`): Lightweight version used for map clustering and table views, containing only essential fields.

## Important Notes

- The API sometimes returns null for ethnicity counts; queries use CASE statements to convert nulls to 0
- Mapbox clustering uses custom properties to aggregate enrollment numbers across clusters
- All API responses follow the structure: `{ success: boolean, result: { records: Array }, help: string, error?: Object }`
- React 19 changes: Ref callbacks must return void or a cleanup function (not the element itself)
