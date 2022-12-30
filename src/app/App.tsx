import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '../components/ThemeProvider';
import { AboutPage } from '../pages/about-page/AboutPage';
import { ClustersPage } from '../pages/clusters-page/ClustersPage';
import { SchoolPage } from '../pages/school-page/SchoolPage';
import { SchoolsListPage } from '../pages/schools-list-page/SchoolsListPage';
import { Layout } from './Layout';
import { NotFound } from './NotFound';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Navigate replace to="/schools" />} />
            <Route path="/schools" element={<SchoolsListPage />} />
            <Route path="/school/:schoolId" element={<SchoolPage />} />
            <Route path="/clusters" element={<ClustersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );

}

export default App;
