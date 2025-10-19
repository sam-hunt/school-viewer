# School Viewer Modernization Plan

Last Updated: 2025-10-20

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
- [ ] Add mui skeletons for individual loading states rather than full page spinner

### 6. Add Path Aliases
- [ ] Configure path aliases in tsconfig.json (@/ → src/)
- [ ] Configure path aliases in vite.config.ts
- [ ] Refactor imports to use aliases (start with most nested files)
- [ ] Test build and development mode
- [ ] Update ESLint to recognize path aliases

### 7. Code Splitting & Bundle Optimization
- [ ] Implement lazy loading for top-level page routes (ClustersPage, SchoolPage, SchoolsListPage, AboutPage)
- [ ] Add Suspense boundaries with loading fallbacks for lazy-loaded routes
- [ ] Configure Vite code-splitting via build.rollupOptions.output.manualChunks
- [ ] Split large dependencies into separate chunks (Mapbox, MUI, Nivo)
- [ ] Test that lazy loading works correctly in production build
- [ ] Verify bundle sizes are under 500KB per chunk

### 8. Evaluate Mapbox GL vs React-Map-GL Migration
- [ ] Update Mapbox GL v2.15.0 → v3.15.0 (major rewrite) or migrate to map-tiler
- [ ] Analyze current Mapbox GL usage in MapboxglClusteredMap.tsx
- [ ] Analyze current Mapbox GL usage in MapboxglPointMap.tsx
- [ ] Research react-map-gl clustering capabilities
- [ ] Research react-map-gl custom layer support
- [ ] Create proof-of-concept for clustering in react-map-gl
- [ ] Document findings and recommendation
- [ ] Update README screenshots (outdated - from before major style refactor)
- [ ] **Decision:** Migrate / Stay with Mapbox GL / Hybrid approach
- [ ] If migrating: Create migration plan
- [ ] If migrating: Execute migration
- [ ] If migrating: Update CLAUDE.md

### 9. Improve TypeScript Strictness
- [ ] Add stricter null checks where needed
- [ ] Fix any loose typing in usePromise (if not replaced)
- [ ] Add proper return types to all functions
- [ ] Enable additional strict flags in tsconfig if not already
- [ ] Fix any new type errors

## ⚡ Phase 3: Performance & UX

### 10. Performance Optimizations
- [ ] Evaluate virtual scrolling for PaginatedSchoolsTable
- [ ] Install TanStack Virtual if needed
- [ ] Implement virtual scrolling if beneficial
- [ ] Add React.memo to expensive map components
- [ ] Use useDeferredValue for search input
- [ ] Profile application with React DevTools Profiler

### 11. Error Boundaries
- [ ] Create ErrorBoundary component
- [ ] Add error boundary around route components
- [ ] Add error boundary around map components
- [ ] Create user-friendly error UI
- [ ] Add error logging/reporting mechanism
- [ ] Test error scenarios

### 12. Accessibility Improvements
- [ ] Install eslint-plugin-jsx-a11y
- [ ] Configure accessibility linting rules
- [ ] Fix any accessibility violations
- [ ] Add keyboard navigation for map interactions
- [ ] Audit color contrast ratios
- [ ] Add proper ARIA labels where missing
- [ ] Test with screen reader

## 🏗️ Phase 4: Architecture & Developer Experience

### 13. API Service Layer
- [ ] Create src/services/api.ts
- [ ] Extract SQL query builders from hooks
- [ ] Move API endpoint configuration to service
- [ ] Create typed API response handlers
- [ ] Update hooks to use service layer
- [ ] Add JSDoc documentation for API functions

### 14. Developer Experience
- [ ] Add vite-plugin-bundle-analyzer
- [ ] Analyze bundle size and identify optimizations
- [ ] Consider Biome as ESLint+Prettier replacement (research first)
- [ ] Add pre-push hooks for additional checks
- [ ] Document development workflow in CLAUDE.md

### 15. Quick Fixes & Polish
- [x] Fix TODO in SchoolsListPage.tsx (migrate to slotProps API)
- [x] Fix TODO in PaginatedSchoolsTable.tsx (migrate to slotProps API)
- [x] Add dropdown caret icon to cluster map dataset picker (using MUI ExpandMoreIcon)
- [x] Fix console.log error handling in useLocalStorage (changed to console.error with descriptive context)
- [x] Replace search icon with pseudo-element implementation (already on MUI icon)
- [x] Improve text overflow CSS on school detail page (fixed in 3.0.0)
- [x] Update all error messages to be user-friendly (clear messages with retry actions)

## 🧪 Phase 5: Testing ✅ Complete

### 16. Testing Infrastructure
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
