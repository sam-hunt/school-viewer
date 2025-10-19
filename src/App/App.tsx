import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '../components/ThemeProvider';
import { Layout } from './Layout';
import { LazyLoadingFallback } from './LazyLoadingFallback';
import { NotFound } from './NotFound';
import './App.css';

// Lazy load page components for code splitting
const AboutPage = lazy(() => import('../pages/about-page/AboutPage').then(module => ({ default: module.AboutPage })));
const ClustersPage = lazy(() => import('../pages/clusters-page/ClustersPage').then(module => ({ default: module.ClustersPage })));
const SchoolPage = lazy(() => import('../pages/school-page/SchoolPage').then(module => ({ default: module.SchoolPage })));
const SchoolsListPage = lazy(() => import('../pages/schools-list-page/SchoolsListPage').then(module => ({ default: module.SchoolsListPage })));

// Configure TanStack Query client with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 24 * 60 * 60 * 1000, // Data is fresh for 24 hours
      gcTime: 24 * 60 * 60 * 1000, // Cache persists for 24 hours
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Suspense fallback={<LazyLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="" element={<Navigate replace to="/schools" />} />
                <Route path="/schools" element={<SchoolsListPage />} />
                <Route path="/schools/:schoolId" element={<SchoolPage />} />
                <Route path="/clusters" element={<ClustersPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
