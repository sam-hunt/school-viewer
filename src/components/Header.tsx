import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, useTheme, Box, Stack } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { NavLink } from 'react-router';

export const Header = () => {
  const { toggleTheme } = useContext(ThemeContext);

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const inactiveLinkStyle = {
    color: 'white',
    textDecoration: 'none',
    borderBottom: '2px solid transparent',
    paddingBottom: '4px',
  };
  const activeLinkStyle = {
    ...inactiveLinkStyle,
    color: isDark ? theme.palette.primary.main : theme.palette.secondary.main, // Always Lavender
    borderBottom: '2px solid white',
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <SchoolIcon sx={{ mr: 2, width: 32, height: 32 }} aria-hidden="true" />
        <Typography variant="h5" component="div">
          School Viewer
        </Typography>

        <nav aria-label="Main navigation">
          <Stack
            direction="row"
            ml={6}
            spacing={2}
            alignItems="center"
            component="ul"
            sx={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
            }}
          >
            <Box component="li">
              <NavLink
                to="/schools"
                aria-label="Schools list page"
                style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <SearchIcon aria-hidden="true" />
                  <Typography variant="h6" component="span">
                    Schools
                  </Typography>
                </Stack>
              </NavLink>
            </Box>

            <Box component="li">
              <NavLink
                to="/clusters"
                aria-label="School clusters map page"
                style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <BubbleChartIcon aria-hidden="true" />
                  <Typography variant="h6" component="span">
                    Clusters
                  </Typography>
                </Stack>
              </NavLink>
            </Box>

            <Box component="li">
              <NavLink
                to="/about"
                aria-label="About this application"
                style={({ isActive }) => (isActive ? activeLinkStyle : inactiveLinkStyle)}
              >
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <InfoOutlinedIcon aria-hidden="true" />
                  <Typography variant="h6" component="span">
                    About
                  </Typography>
                </Stack>
              </NavLink>
            </Box>
          </Stack>
        </nav>

        <Box flexGrow="1" />

        <Tooltip title="Toggle Dark Mode">
          <IconButton
            sx={{ ml: 1 }}
            onClick={toggleTheme}
            color="inherit"
            aria-label={`Switch to ${theme.palette.mode === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme.palette.mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};
