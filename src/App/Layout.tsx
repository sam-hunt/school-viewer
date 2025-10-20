import { Outlet } from 'react-router';

import { Header } from '../components/Header';
import { Typography } from '@mui/material';
import './Layout.css';

export const Layout = () => (
  <>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    <Header />
    {/* TODO: Hoist MUI Container component from pages up to here */}
    <main id="main-content" style={{ padding: '0px', height: 'calc(100vh - 90px)', overflowY: 'scroll' }}>
      <Outlet />
    </main>
    {/* Maybe inside container component? */}
    <footer role="contentinfo" style={{ height: '18px', textAlign: 'right', marginRight: '8px' }}>
      <Typography variant="body2" component="div">
        {`Sam Hunt ${new Date().getFullYear().toString()}`}
      </Typography>
    </footer>
  </>
);
