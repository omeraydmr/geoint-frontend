# STRATYON Frontend

**Version:** 1.0.0
**Framework:** Next.js 15, React 19, TypeScript
**Market:** Turkiye

---

## Overview

The STRATYON Frontend is the user-facing application for the STRATYON Strategic Intelligence Platform. It provides interactive geographic intelligence dashboards, competitor analysis, AI strategy management, and keyword research interfaces built on Next.js with Mapbox GL JS for map visualization.

## Prerequisites

- Node.js 18+ and npm
- STRATYON Backend API running (default: `http://localhost:8000`)
- Mapbox access token (free tier available at https://account.mapbox.com)

## Quick Start

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your values
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# NEXT_PUBLIC_MAPBOX_TOKEN=pk.your-token-here

# Run development server
npm run dev
```

The app will be available at http://localhost:3000

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, PrimeReact, Tailwind CSS |
| Maps | Mapbox GL JS, react-map-gl |
| Charts | Recharts, Chart.js |
| State | Zustand, SWR |
| Language | TypeScript |

## Project Structure

```
src/
  app/              # Next.js App Router pages
    dashboard/      # Main dashboard
    geoint/         # Geographic Intelligence module
    competitors/    # Competitor analysis
    strategies/     # AI Strategy management
    keywords/       # Keyword research
  components/       # React components
    charts/         # Data visualization
    chatbot/        # AI chatbot
    competitors/    # Competitor UI
    geoint/         # Map and heatmap components
    strategy/       # Strategy management UI
    ui/             # Shared UI primitives
    layout/         # Navigation and layout
  contexts/         # React contexts (Auth, Theme, GEOINT)
  hooks/            # Custom React hooks
  services/         # API client layer
  styles/           # CSS and design tokens
  types/            # TypeScript type definitions
  lib/              # Utility functions
  utils/            # Helper utilities
public/
  geo/              # Static GeoJSON boundary files
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Yes | Mapbox GL access token |

## Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build the image directly
docker build -t stratyon-frontend .
docker run -p 3000:3000 stratyon-frontend
```

## Related

- **Backend Repository:** The STRATYON Backend provides the API this frontend consumes.
- **API Documentation:** Available at `{BACKEND_URL}/docs` when the backend is running.

---

**STRATYON** - Veriyi Stratejiye Donusturen Guc
