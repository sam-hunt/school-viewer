import { Outlet } from 'react-router';

import { Header } from '../components/Header';
import { Typography } from '@mui/material';

export const Layout = () => (
  <>
    <Header />
    {/* TODO: Hoist MUI Container component from pages up to here */}
    <div style={{ padding: '0px', height: 'calc(100vh - 90px)', overflowY: 'scroll' }}>
      <Outlet />
    </div>
    {/* Maybe inside container component? */}
    <footer style={{ height: '18px', textAlign: 'right', marginRight: '8px' }}>
      <Typography variant="body2" component="div">
        {`Sam Hunt ${new Date().getFullYear()}`}
      </Typography>
    </footer>
  </>
);
