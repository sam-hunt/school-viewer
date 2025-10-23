import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import GitHubIcon from '@mui/icons-material/GitHub';
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
        <NavLink
          to="/"
          aria-label="School Viewer home"
          style={{
            color: 'white',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <SchoolIcon sx={{ mr: 1.5, width: 32, height: 32 }} aria-hidden="true" />
          <Typography variant="h5" component="div" pr={3} fontSize={{ xs: '1rem', sm: '1.25rem', md: '1.5rem' }}>
            School Viewer
          </Typography>
        </NavLink>

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
                  <SearchIcon aria-hidden="true" sx={{ display: { xs: 'none', sm: 'block' } }} />
                  <Typography variant="h6" component="span" fontSize={{ xs: '0.875rem', sm: '1rem', md: '1.125rem' }}>
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
                  <BubbleChartIcon aria-hidden="true" sx={{ display: { xs: 'none', sm: 'block' } }} />
                  <Typography variant="h6" component="span" fontSize={{ xs: '0.875rem', sm: '1rem', md: '1.125rem' }}>
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
                  <InfoOutlinedIcon aria-hidden="true" sx={{ display: { xs: 'none', sm: 'block' } }} />
                  <Typography variant="h6" component="span" fontSize={{ xs: '0.875rem', sm: '1rem', md: '1.125rem' }}>
                    About
                  </Typography>
                </Stack>
              </NavLink>
            </Box>
          </Stack>
        </nav>

        <Box flexGrow="1" />

        <Stack direction="row" spacing={{ xs: 0, md: 1 }} alignItems="center">
          <Tooltip title="View on GitHub" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            <IconButton
              component="a"
              href="https://github.com/sam-hunt/school-viewer"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              aria-label="View source code on GitHub"
            >
              <GitHubIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Toggle Dark Mode">
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              aria-label={`Switch to ${theme.palette.mode === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme.palette.mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
