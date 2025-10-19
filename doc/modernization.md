# School Viewer Modernization Plan

Last Updated: 2025-10-19

## 🚀 Phase 1: Infrastructure & Deployment

### 1. GitHub Pages Deployment
- [x] Add GitHub Actions workflow for automated deployment
- [x] Configure Vite for GitHub Pages (base path)
- [x] Add deployment status badge to README

### 2. Update Dependencies
- [ ] Update React 18.3.1 → 19.2.0
- [ ] Update React DOM 18.3.1 → 19.2.0
- [ ] Update MUI v6.1.9 → v7.3.4 (breaking changes expected)
- [ ] Update Vite 6.0.1 → 7.1.10
- [ ] Update @nivo packages 0.88.0 → 0.99.0
- [ ] Update all other dependencies (excluding mapbox-gl) to latest compatible versions
- [ ] Test application thoroughly after each major update
- [ ] Update CLAUDE.md with any architecture changes

### 3. Remove CRA References
- [x] Update README.md to replace `npm start` with `npm run dev`
- [x] Remove references to `npm run eject`
- [x] Update port references (3000 → 5173)
- [x] Remove any CRA-specific documentation
- [ ] Update README screenshots (outdated - from before major style refactor)

## 🎨 Phase 2: Code Quality & Patterns

### 4. Replace usePromise with TanStack Query
- [ ] Install @tanstack/react-query and @tanstack/react-query-devtools
- [ ] Set up QueryClient and QueryClientProvider in App.tsx
- [ ] Migrate useSchool hook to use useQuery
- [ ] Migrate useSchoolList hook to use useQuery
- [ ] Remove custom usePromise hook
- [ ] Add query devtools for development
- [ ] Configure cache times and stale times appropriately
- [ ] Test all API-dependent components

### 5. Evaluate Mapbox GL vs React-Map-GL Migration
- [ ] Update Mapbox GL v2.15.0 → v3.15.0 (major rewrite) or migrate to map-tiler
- [ ] Analyze current Mapbox GL usage in MapboxglClusteredMap.tsx
- [ ] Analyze current Mapbox GL usage in MapboxglPointMap.tsx
- [ ] Research react-map-gl clustering capabilities
- [ ] Research react-map-gl custom layer support
- [ ] Create proof-of-concept for clustering in react-map-gl
- [ ] Document findings and recommendation
- [ ] **Decision:** Migrate / Stay with Mapbox GL / Hybrid approach
- [ ] If migrating: Create migration plan
- [ ] If migrating: Execute migration
- [ ] If migrating: Update CLAUDE.md

### 6. Interface Naming Refactor (Remove "I" Prefix)
- [ ] Rename ISchool → School
- [ ] Rename ISchoolListItem → SchoolListItem
- [ ] Rename IApiSuccessResult → ApiSuccessResult
- [ ] Rename IApiErrorResult → ApiErrorResult
- [ ] Rename IApiResult → ApiResult
- [ ] Rename IMapboxGLMapProps → MapboxGLMapProps
- [ ] Rename ISchoolFeature → SchoolFeature
- [ ] Update all imports and usages across codebase
- [ ] Update CLAUDE.md to reflect new naming convention

### 7. Add Path Aliases
- [ ] Configure path aliases in tsconfig.json (@/ → src/)
- [ ] Configure path aliases in vite.config.ts
- [ ] Refactor imports to use aliases (start with most nested files)
- [ ] Test build and development mode
- [ ] Update ESLint to recognize path aliases

### 8. Improve TypeScript Strictness
- [ ] Add stricter null checks where needed
- [ ] Fix any loose typing in usePromise (if not replaced)
- [ ] Add proper return types to all functions
- [ ] Enable additional strict flags in tsconfig if not already
- [ ] Fix any new type errors

### 9. Code Splitting & Bundle Optimization
- [ ] Implement lazy loading for top-level page routes (ClustersPage, SchoolPage, SchoolsListPage, AboutPage)
- [ ] Add Suspense boundaries with loading fallbacks for lazy-loaded routes
- [ ] Configure Vite code-splitting via build.rollupOptions.output.manualChunks
- [ ] Split large dependencies into separate chunks (Mapbox, MUI, Nivo)
- [ ] Test that lazy loading works correctly in production build
- [ ] Verify bundle sizes are under 500KB per chunk

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
- [ ] Fix TODO in SchoolsListPage.tsx (migrate to slotProps API)
- [ ] Fix console.log error handling in useLocalStorage
- [ ] Add dropdown caret icon to cluster map dataset picker
- [ ] Replace search icon with pseudo-element implementation
- [ ] Improve text overflow CSS on school detail page
- [ ] Update all error messages to be user-friendly

## 🧪 Phase 5: Testing (Future)

### 16. Testing Infrastructure
- [ ] Install Vitest and @testing-library/react
- [ ] Configure Vitest with jsdom environment
- [ ] Install @testing-library/jest-dom
- [ ] Install MSW for API mocking
- [ ] Write tests for utility hooks (useLocalStorage, useWindowSize)
- [ ] Write tests for data transformation logic
- [ ] Write tests for SchoolsListPage search functionality
- [ ] Write integration tests for key user flows
- [ ] Set up test coverage reporting
- [ ] Add test command to package.json
- [ ] Consider E2E testing with Playwright (optional)

---

## Notes

- Each checkbox represents a subtask that should be committed separately when possible
- Major dependency updates should be tested in isolation before proceeding
- Update this file as progress is made
- Document any blockers or decisions in GitHub issues
- The react-map-gl evaluation is critical before making other map-related changes
