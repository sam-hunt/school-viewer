import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ThemeProvider } from '../components/ThemeProvider';
import { AboutPage } from '../pages/about-page/AboutPage';
import { ClustersPage } from '../pages/clusters-page/ClustersPage';
import { SchoolPage } from '../pages/school-page/SchoolPage';
import { SchoolsListPage } from '../pages/schools-list-page/SchoolsListPage';
import { Layout } from './Layout';
import { NotFound } from './NotFound';
import './App.css';

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
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
