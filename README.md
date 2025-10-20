# School Viewer

[![Deploy to GitHub Pages](https://github.com/sam-hunt/school-viewer/actions/workflows/deploy.yml/badge.svg)](https://github.com/sam-hunt/school-viewer/actions/workflows/deploy.yml)

A visualizer for the New Zealand Government's Schooling Directory API, featuring interactive maps and data exploration.

**Live Demo:** [https://sam-hunt.github.io/school-viewer/](https://sam-hunt.github.io/school-viewer/)

![Map View](screenshot1.png?raw=true "Map View")
![School Search](screenshot2.png?raw=true "School Search")
![School View](screenshot3.png?raw=true "School View")

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** - Build tool and dev server
- **Material-UI (MUI) v7** - Component library
- **TanStack Query v5** - Data fetching and caching
- **Mapbox GL JS v2** - Interactive mapping
- **Nivo v0.99** - Data visualizations
- **React Router v7** - Client-side routing
- **Vitest** - Unit testing framework
- **ESLint** with jsx-a11y plugin - Accessibility linting

## Getting Started

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Then add your Mapbox API key:

```
VITE_MAPBOX_KEY=your_mapbox_key_here
```

## Available Scripts

### `npm run dev`

Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will automatically reload when you make changes.
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

### `npm run preview`

Serves the production build locally for testing.
Open [http://localhost:4173/school-viewer/](http://localhost:4173/school-viewer/) to view it.

### `npm run lint`

Runs ESLint to check for code quality issues.

### `npm test`

Runs the test suite using Vitest.

### `npm test -- --coverage`

Runs tests with coverage reporting (97%+ coverage).

### `npm run deploy`

Manually trigger a deployment to github pages, pushing the build to the `gh-pages` branch

## Project Structure

```
src/
├── App/                    # Root app component and routing
├── components/             # Reusable components (Header, ThemeProvider, etc.)
├── hooks/                  # Custom React hooks
│   ├── useDocumentTitle/   # Document title management
│   ├── useFocusOnNavigation/ # Accessibility focus management
│   ├── useLocalStorage/    # Persistent local storage
│   ├── useSchool/          # Individual school data fetching
│   └── useSchoolList/      # School list data fetching
├── models/                 # TypeScript interfaces
├── pages/                  # Page components
│   ├── about-page/
│   ├── clusters-page/
│   ├── school-page/
│   └── schools-list-page/
└── test/                   # Test utilities and setup
```

## Testing

The project has comprehensive test coverage (97%+) using Vitest and React Testing Library:

- **219 tests** across 25 test files
- All custom hooks tested (useSchool, useSchoolList, useLocalStorage, useDocumentTitle, useFocusOnNavigation)
- All page components tested (with proper routing context)
- All display components tested (cards, tables, maps)
- Integration tests for key user flows

Run tests with:
```bash
npm test                    # Run all tests
npm test -- --coverage      # Run with coverage report
npm test -- --watch         # Run in watch mode
```

## Features

- 🗺️ **Interactive Map** - Clustered view of all NZ schools with Mapbox GL
- 🔍 **Search** - Find schools by name
- 📊 **Demographics** - View enrollment breakdowns by ethnicity
- 📍 **Location** - School addresses and coordinates
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- ♿ **Accessible** - WCAG compliant with semantic HTML, ARIA labels, and keyboard navigation
- 🌓 **Dark Mode** - Toggle between light and dark themes

## Data Source

Data is fetched from the [New Zealand Government's Schooling Directory API](https://catalogue.data.govt.nz/dataset/directory-of-educational-institutions).

## Contributing

This is a personal project, but suggestions and bug reports are welcome! Please open an issue to discuss any changes.
