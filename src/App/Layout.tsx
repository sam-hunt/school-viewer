import { Outlet } from 'react-router';

import { Header } from '../components/Header';

export const Layout = () => (
  <>
    <Header />
    <div style={{ padding: '0px', height: 'calc(100vh - 90px)', overflowY: 'scroll' }}>
      <Outlet />
    </div>
    <footer style={{ height: '18px', textAlign: 'right', marginRight: '8px' }}>&copy;{new Date().getFullYear()} Sam Hunt</footer>
  </>
);
