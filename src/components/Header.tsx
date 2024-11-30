import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, useTheme, Box, Stack } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';
import { NavLink } from 'react-router';

export const Header = () => {
  const { toggleTheme } = useContext(ThemeContext);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const inactiveLinkStyle = {
    color: 'white',
    textDecoration: 'none',
  };
  const activeLinkStyle = {
    ...inactiveLinkStyle,
    color: isDark ? theme.palette.primary.main : theme.palette.secondary.main, // Always Lavender
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <SchoolIcon sx={{ mr: 2, width: 32, height: 32 }} />
        <Typography variant="h5" component="div">
          School Viewer
        </Typography>

        <Stack direction="row" ml={6} spacing={2} alignItems="center">
          <NavLink to="/schools" style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <SearchIcon />
              <Typography variant="h6" component="div">
                Schools
              </Typography>
            </Stack>
          </NavLink>
          <NavLink to="/clusters" style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <BubbleChartIcon />
              <Typography variant="h6" component="div">
                Clusters
              </Typography>
            </Stack>
          </NavLink>
          <NavLink to="/about" style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <InfoOutlinedIcon />
              <Typography variant="h6" component="div">
                About
              </Typography>
            </Stack>
          </NavLink>
        </Stack>

        <Box flexGrow="1" />

        <Tooltip title="Toggle Dark Mode">
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme.palette.mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
