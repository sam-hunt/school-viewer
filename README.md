# School Viewer

[![Deploy to GitHub Pages](https://github.com/sam-hunt/school-viewer/actions/workflows/deploy.yml/badge.svg)](https://github.com/sam-hunt/school-viewer/actions/workflows/deploy.yml)

A visualizer for the New Zealand Government's Schooling Directory API, featuring interactive maps and data exploration.

**Live Demo:** [https://sam-hunt.github.io/school-viewer/](https://sam-hunt.github.io/school-viewer/)

![Map View](screenshot1.png?raw=true "Map View")
![School Search](screenshot2.png?raw=true "School Search")
![School View](screenshot3.png?raw=true "School View")

## Tech Stack

- **React 18** with TypeScript
- **Vite** - Build tool and dev server
- **Material-UI (MUI) v6** - Component library
- **Mapbox GL JS** - Interactive mapping
- **Nivo** - Data visualizations
- **React Router v7** - Client-side routing

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

### `npm run deploy`

Manually trigger a deployment to github pages, pushing the build to the `gh-pages` branch

## Project Structure

```
src/
├── App/              # Root app component and routing
├── components/       # Reusable components (Header, Maps, etc.)
├── hooks/            # Custom React hooks
├── models/           # TypeScript interfaces
└── pages/            # Page components
    ├── about-page/
    ├── clusters-page/
    ├── school-page/
    └── schools-list-page/
```

## Features

- 🗺️ **Interactive Map** - Clustered view of all NZ schools with Mapbox GL
- 🔍 **Search** - Find schools by name
- 📊 **Demographics** - View enrollment breakdowns by ethnicity
- 📍 **Location** - School addresses and coordinates
- 📱 **Responsive** - Works on mobile, tablet, and desktop

## Data Source

Data is fetched from the [New Zealand Government's Schooling Directory API](https://catalogue.data.govt.nz/dataset/directory-of-educational-institutions).

## TODO

- Add a down caret icon in the dataset picker on the cluster map page so that it's clear it's a dropdown
- Replace the search icon on the find a school page text input with a similar pseudo-element implementation
- Improve text overflow CSS on school detail page

## Contributing

This is a personal project, but suggestions and bug reports are welcome! Please open an issue to discuss any changes.
