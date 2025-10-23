# School Viewer Modernization Plan

Last Updated: 2025-10-23

## 🚀 Phase 1: Infrastructure & Deployment

### 1. GitHub Pages Deployment
- [x] Add GitHub Actions workflow for automated deployment
- [x] Configure Vite for GitHub Pages (base path)
- [x] Add deployment status badge to README

### 2. Update Dependencies
- [x] Update React 18.3.1 → 19.2.0
- [x] Update React DOM 18.3.1 → 19.2.0
- [x] Update MUI v6.1.9 → v7.3.4 (breaking changes expected)
- [x] Update Vite 6.0.1 → 7.1.10
- [x] Update @nivo packages 0.88.0 → 0.99.0
- [x] Update all other dependencies (excluding mapbox-gl) to latest compatible versions
- [x] Test application thoroughly after each major update
- [x] Update CLAUDE.md with any architecture changes

### 3. Remove CRA References
- [x] Update README.md to replace `npm start` with `npm run dev`
- [x] Remove references to `npm run eject`
- [x] Update port references (3000 → 5173)
- [x] Remove any CRA-specific documentation

## 🎨 Phase 2: Code Quality & Patterns

### 4. Interface Naming Refactor (Remove "I" Prefix)
- [x] Rename ISchool → School
- [x] Rename ISchoolListItem → SchoolListItem
- [x] Rename IApiSuccessResult → ApiSuccessResult
- [x] Rename IApiErrorResult → ApiErrorResult
- [x] Rename IApiResult → ApiResult
- [x] Rename IMapboxGLMapProps → MapboxGLMapProps
- [x] Rename ISchoolFeature → SchoolFeature
- [x] Update all imports and usages across codebase
- [x] Update CLAUDE.md to reflect new naming convention

### 5. Replace usePromise with TanStack Query
- [x] Install @tanstack/react-query and @tanstack/react-query-devtools
- [x] Set up QueryClient and QueryClientProvider in App.tsx
- [x] Add query devtools for development
- [x] Migrate useSchool hook to use useQuery
- [x] Migrate useSchoolList hook to use useQuery
- [x] Configure cache times and stale times appropriately
- [x] Remove custom usePromise hook
- [x] Add comprehensive test suite with Vitest and React Testing Library:
  - [x] Add tests for all custom hooks (useSchool, useSchoolList, useLocalStorage, useWindowSize)
  - [x] Add tests for app route resolution (8 tests)
  - [x] Add tests for all page components (SchoolsListPage, SchoolPage, ClustersPage, AboutPage)
  - [x] Add tests for all display components (Header, all cards, tables, pagination)
  - [x] Add tests for map components (MapboxGLPointMap, MapboxGLClusteredMap, MapCard)
  - [x] Achieve 97%+ code coverage (158 tests across 21 test files)
  - [x] Fix all act() warnings in async tests using waitFor
  - [x] Configure coverage exclusions (main.tsx, .d.ts files, test utilities)
- [x] Add mui skeletons for individual loading states rather than full page spinner

### 6. Add Path Aliases
- [ ] Configure path aliases in tsconfig.json (@/ → src/)
- [ ] Configure path aliases in vite.config.ts
- [ ] Refactor imports to use aliases (start with most nested files)
- [ ] Test build and development mode
- [ ] Update ESLint to recognize path aliases

### 7. Code Splitting & Bundle Optimization
- [x] Implement lazy loading for top-level page routes (ClustersPage, SchoolPage, SchoolsListPage, AboutPage)
- [x] Add Suspense boundaries with loading fallbacks for lazy-loaded routes
- [x] Configure Vite code-splitting via build.rollupOptions.output.manualChunks
- [x] Split large dependencies into separate chunks (Mapbox, MUI, Nivo)
- [x] Test that lazy loading works correctly in production build
- [x] Verify bundle sizes are under 500KB per chunk

### 8. Evaluate Mapbox GL vs React-Map-GL Migration ✅ Complete
- [x] Analyze current Mapbox GL usage in MapboxglClusteredMap.tsx
- [x] Analyze current Mapbox GL usage in MapboxglPointMap.tsx
- [x] **Decision:** Migrate to react-map-gl with MapLibre GL and MapTiler
- [x] Install react-map-gl and maplibre-gl dependencies
- [x] Migrate MapboxglPointMap to react-map-gl (simplified to 37 lines, removed all TypeScript suppressions)
- [x] Migrate MapboxglClusteredMap to react-map-gl with clustering (cleaner declarative API)
- [x] Update environment variables to use VITE_MAPTILER_KEY
- [x] Remove old mapbox-gl and @types/mapbox-gl dependencies
- [x] Update CLAUDE.md to reflect new mapping technology
- [x] Verify build succeeds and all TypeScript errors resolved
- [ ] Update README screenshots (outdated - from before major style refactor)

### 9. Improve TypeScript Strictness ✅ Complete
- [x] Document all TypeScript strict mode linting errors (`doc/typescript-strict-errors.md` since cleaned up)
- [x] Fix Priority 1 errors: Template literals, unused directives (quick wins)
- [x] Fix Priority 2 errors: Type safety for APIs, test mocks, localStorage
- [x] Add stricter null checks where needed
- [x] Fix any loose typing in usePromise (replaced with TanStack Query)
- [x] Add proper return types to all functions
- [x] Enable additional strict flags in tsconfig if not already
- [x] All ESLint strict mode errors resolved (except intentional Mapbox suppressions)

## ⚡ Phase 3: Performance & UX

### 10. Performance Optimizations
- [x] Evaluate virtual scrolling for PaginatedSchoolsTable (not needed - pagination already limits DOM to 12-24 rows)
- [x] Install TanStack Virtual if needed (skipped - not beneficial)
- [x] Implement virtual scrolling if beneficial (skipped - pagination is more appropriate)
- [ ] Add React.memo to expensive map components
- [x] Use useDeferredValue for search input
- [ ] Profile application with React DevTools Profiler

### 11. Error Boundaries
- [ ] Create ErrorBoundary component
- [ ] Add error boundary around route components
- [ ] Add error boundary around map components
- [ ] Create user-friendly error UI
- [ ] Add error logging/reporting mechanism
- [ ] Test error scenarios

### 12. Accessibility Improvements
- [x] Install eslint-plugin-jsx-a11y (approved)
- [x] Configure accessibility linting rules (approved)
- [x] Fix any accessibility violations (approved) - 0 violations found!
- [ ] Add keyboard navigation for map interactions
- [ ] Audit color contrast ratios
- [x] Add proper ARIA labels where missing (approved) - completed in Phases 1-3
- [ ] Test with screen reader

### 13. Mobile Layout Improvements
- [ ] Rebuild Header component with burger navigation menu for xs screens
  - [ ] Create mobile drawer/menu component
  - [ ] Move navigation items (Schools, Clusters, About) into burger menu
  - [ ] Keep theme toggle and (optionally) GitHub link in header
  - [ ] Ensure proper focus management and keyboard navigation
  - [ ] Test accessibility with burger menu
- [ ] Refactor container/layout architecture
  - [ ] Create/update Layout component to include Container
  - [ ] Hoist Container from individual pages to Layout component
  - [ ] Reduce Container padding at xs breakpoint for better mobile spacing
  - [ ] Audit and fix viewport unit (vw/vh) hacks across the codebase
  - [ ] Test all pages at various breakpoints to ensure consistent layout

## 🏗️ Phase 4: Architecture & Developer Experience

### 14. API Service Layer
- [ ] Create src/services/api.ts
- [ ] Extract SQL query builders from hooks
- [ ] Move API endpoint configuration to service
- [ ] Create typed API response handlers
- [ ] Update hooks to use service layer
- [ ] Add JSDoc documentation for API functions

### 15. Developer Experience
- [x] Add bundle analyzer (rollup-plugin-visualizer with `npm run build:analyze`)
- [x] Analyze bundle size and identify optimizations
- [ ] Configure Prettier with better defaults
  - [ ] Create/update .prettierrc configuration file
  - [ ] Configure print width, quotes, semicolons, trailing commas, etc.
  - [ ] Ensure ESLint integration remains compatible
  - [ ] Run formatting across entire codebase
- [ ] Consider Biome as ESLint+Prettier replacement (research first)
- [ ] Add pre-push hooks for additional checks
- [ ] Document development workflow in CLAUDE.md

### 16. Quick Fixes & Polish
- [x] Fix TODO in SchoolsListPage.tsx (migrate to slotProps API)
- [x] Fix TODO in PaginatedSchoolsTable.tsx (migrate to slotProps API)
- [x] Add dropdown caret icon to cluster map dataset picker (using MUI ExpandMoreIcon)
- [x] Fix console.log error handling in useLocalStorage (changed to console.error with descriptive context)
- [x] Replace search icon with pseudo-element implementation (already on MUI icon)
- [x] Improve text overflow CSS on school detail page (fixed in 3.0.0)
- [x] Update all error messages to be user-friendly (clear messages with retry actions)

## 🧪 Phase 5: Testing ✅ Complete

### 17. Testing Infrastructure
- [x] Install Vitest and @testing-library/react
- [x] Configure Vitest with happy-dom environment
- [x] Install @testing-library/jest-dom and @testing-library/user-event
- [x] Write tests for utility hooks (useLocalStorage, useWindowSize)
- [x] Write tests for data hooks (useSchool, useSchoolList with fetch functions)
- [x] Write tests for SchoolsListPage search functionality
- [x] Write integration tests for key user flows (routing, page composition)
- [x] Set up test coverage reporting (97%+ coverage achieved)
- [x] Add test command to package.json
- [x] Configure coverage exclusions for bootstrap and declaration files
- [ ] Consider E2E testing with Playwright (optional, future enhancement)

---

## Notes

- Each checkbox represents a subtask that should be committed separately when possible
- Major dependency updates should be tested in isolation before proceeding
- Update this file as progress is made
- Document any blockers or decisions in GitHub issues
- The react-map-gl evaluation is critical before making other map-related changes
