import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AboutPage } from '../pages/about-page/AboutPage';
import { HomePage } from '../pages/home-page/HomePage';
import { SchoolPage } from '../pages/school-page/SchoolPage';
import { SchoolsListPage } from '../pages/schools-list-page/SchoolsListPage';
import { Layout } from './Layout';
import { NotFound } from './NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter basename={process.env.REACT_APP_BASE_PATH}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/schools" element={<SchoolsListPage />} />
          <Route path="/school/:schoolId" element={<SchoolPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default App;
