# 🗺️ @tracktor/map

A modern, lightweight React map library built on top of Mapbox GL JS and react-map-gl. Designed for simplicity, flexibility, and visual elegance.

Easily combine markers, routes, GeoJSON features, isochrones, and nearest-point calculations — all with a declarative, type-safe API.

[![npm version](https://img.shields.io/npm/v/@tracktor/map.svg)](https://www.npmjs.com/package/@tracktor/map)
[![License](https://img.shields.io/badge/license-UNLICENSED-red.svg)](LICENSE)

---

## 🚀 Installation
```bash
npm install @tracktor/map
```

or
```bash
yarn add @tracktor/map
```

or
```bash
bun add @tracktor/map
```

---

## ⚙️ Requirements

| Dependency | Version | Purpose |
|------------|---------|---------|
| `react` | 17+ / 18+ / 19+ | Core React runtime |
| `react-dom` | 17+ / 18+ / 19+ | React DOM rendering |
| `mapbox-gl` | ≥3.0.0 | Map rendering engine |
| `@tracktor/design-system` | ≥4.0.0 | UI theming and components |
| `@mui/icons-material` | * | Material UI icons |
| `@mui/x-license` | * | MUI X license integration |

🪶 **You'll also need a Mapbox access token** to render maps. Get one at [mapbox.com](https://account.mapbox.com/access-tokens/).

---

## ✨ Features

✅ **Declarative API** — manage complex map interactions with simple props  
✅ **Markers & Popups** — customizable React components or image-based icons  
✅ **Routing & Isochrones** — visualize travel-time areas or compute optimal routes  
✅ **GeoJSON Layers** — render vector data dynamically  
✅ **Nearest Marker Search** — find and highlight closest points instantly  
✅ **Type-safe API** — full TypeScript support with smart IntelliSense  
✅ **Responsive Design** — automatically adapts to any container or screen size  
✅ **Built for performance** — minimal re-renders, efficient map updates  
✅ **Multiple Routing Engines** — supports both OSRM (free) and Mapbox Directions API  
✅ **Flexible Map Styles** — works with Mapbox styles, OpenStreetMap, or custom raster tiles

---

## 🧩 Quick Start
```tsx
import { MapProvider, MarkerMap } from "@tracktor/map";

const markers = [
  {
    id: 1,
    lng: 2.3522,
    lat: 48.8566,
    Tooltip: <div>Paris</div>,
    color: "primary",
    variant: "default",
  },
  {
    id: 2,
    lng: -0.1276,
    lat: 51.5074,
    Tooltip: <div>London</div>,
    color: "secondary",
    variant: "default",
  },
];

function App() {
  return (
    <MapProvider
      licenseMuiX="your-muix-license"
      licenceMapbox="your-mapbox-token"
    >
      <MarkerMap
        markers={markers}
        center={[2.3522, 48.8566]}
        zoom={5}
        fitBounds
        height={500}
        width="100%"
        onMapClick={(lng, lat, marker) => {
          console.log("Clicked at:", lng, lat);
          if (marker) console.log("Marker clicked:", marker);
        }}
      />
    </MapProvider>
  );
}
```

---

## 🧭 Components Overview

### `MapProvider`

Wraps your map components and injects required providers (theme, tokens, MUI X license).

**Required Props:**
- `licenseMuiX` — Your MUI X license key
- `licenceMapbox` — Your Mapbox access token
```tsx
<MapProvider
  licenseMuiX="your-license"
  licenceMapbox="your-token"
>
  {/* Your map components */}
</MapProvider>
```

### `MapView` / `MarkerMap`

Main map component that handles:
- Marker rendering with custom icons or React components
- Interactive popups with hover/click modes
- Automatic bounds fitting
- Map click events
- Responsive container sizing

### Specialized Components

- **`RouteMap`** → Draw routes between two points using OSRM or Mapbox
- **`IsochroneMap`** → Compute and display travel-time polygons
- **`FeatureMap`** → Display custom GeoJSON layers with styling

---

## 🧱 Props Reference

### `MapView` Props

#### Core Map Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `[lng, lat]` | `[2.3522, 48.8566]` | Initial map center coordinates |
| `zoom` | `number` | `5` | Initial zoom level (0-22) |
| `width` | `string \| number` | `"100%"` | Map container width |
| `height` | `string \| number` | `300` | Map container height |
| `loading` | `boolean` | `false` | Show skeleton loader |
| `square` | `boolean` | `false` | Enforce 1:1 aspect ratio |
| `containerStyle` | `SxProps` | `undefined` | Custom MUI sx styles |

#### Map Appearance

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `"light" \| "dark"` | `"light"` | Map color theme |
| `baseMapView` | `"street" \| "satellite"` | `"street"` | Base map layer type |
| `mapStyle` | `string` | - | Custom Mapbox style URL |
| `projection` | `ProjectionSpecification` | `"mercator"` | Map projection system |

#### Interaction Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cooperativeGestures` | `boolean` | `true` | Require modifier key for zoom/pan |
| `doubleClickZoom` | `boolean` | `true` | Enable double-click to zoom |
| `onMapClick` | `(lng, lat, marker?) => void` | - | Callback for map clicks |

#### Marker Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `markers` | `MarkerProps[]` | `[]` | Array of markers to display |
| `openPopup` | `string \| number` | `undefined` | ID of marker with open popup |
| `openPopupOnHover` | `boolean` | `false` | Open popups on hover instead of click |
| `popupMaxWidth` | `string` | `"300px"` | Maximum popup width |

#### Bounds & Animation

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fitBounds` | `boolean` | `true` | Auto-fit map to show all markers |
| `fitBoundsPadding` | `number` | `0` | Padding (px) around fitted bounds |
| `fitBoundDuration` | `number` | `500` | Animation duration (ms) |
| `disableAnimation` | `boolean` | `false` | Disable all animations |
| `fitBoundsAnimationKey` | `unknown` | - | Change to re-trigger fit bounds |

---

### Marker Props (`MarkerProps`)

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string \| number` | ✅ | Unique marker identifier |
| `lng` | `number` | ✅ | Longitude coordinate |
| `lat` | `number` | ✅ | Latitude coordinate |
| `Tooltip` | `ReactNode` | - | Content for popup/tooltip |
| `IconComponent` | `React.ComponentType` | - | Custom React icon component |
| `iconProps` | `object` | - | Props passed to IconComponent |
| `color` | `string` | - | Marker color (MUI palette) |
| `variant` | `string` | - | Marker style variant |

**Example with custom icon:**
```tsx
import LocationOnIcon from '@mui/icons-material/LocationOn';

const marker = {
  id: 1,
  lng: 2.3522,
  lat: 48.8566,
  IconComponent: LocationOnIcon,
  iconProps: { fontSize: 'large', color: 'error' },
  Tooltip: <div>Custom Icon Marker</div>
};
```

---

### Routing Props

Add a route between two points by providing `from` and `to` coordinates.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `from` | `[lng, lat]` | - | Route starting point |
| `to` | `[lng, lat]` | - | Route ending point |
| `profile` | `"driving" \| "walking" \| "cycling"` | `"driving"` | Transportation mode |
| `engine` | `"OSRM" \| "Mapbox"` | `"OSRM"` | Routing service to use |
| `itineraryLineStyle` | `{ color, width, opacity }` | `{ color: "#3b82f6", width: 4, opacity: 0.8 }` | Route line appearance |

**Example:**
```tsx
<MapView
  from={[2.3522, 48.8566]} // Paris
  to={[-0.1276, 51.5074]}   // London
  profile="driving"
  engine="OSRM"
  itineraryLineStyle={{
    color: "#10b981",
    width: 5,
    opacity: 0.9
  }}
/>
```

---

### Nearest Marker Search

Find and highlight the closest marker to a given point within a maximum distance.

| Prop | Type | Description |
|------|------|-------------|
| `findNearestMarker.origin` | `[lng, lat]` | Starting point for search |
| `findNearestMarker.destinations` | `Array<{lng, lat, id}>` | Candidate destinations |
| `findNearestMarker.maxDistanceMeters` | `number` | Maximum search radius |
| `onNearestFound` | `(id, coords, distance) => void` | Callback with nearest result |

**Example:**
```tsx
<MapView
  findNearestMarker={{
    origin: [2.3522, 48.8566],
    destinations: markers.map(m => ({ 
      lng: m.lng, 
      lat: m.lat, 
      id: m.id 
    })),
    maxDistanceMeters: 5000,
  }}
  onNearestFound={(id, coords, distance) => {
    console.log(`Nearest: ${id} at ${distance}m`);
  }}
/>
```

---

### Isochrone Props

Compute and display areas reachable within specific time intervals.

| Prop | Type | Description |
|------|------|-------------|
| `isochrone.origin` | `[lng, lat]` | Center point for isochrone |
| `isochrone.profile` | `"driving" \| "walking" \| "cycling"` | Transportation mode |
| `isochrone.intervals` | `number[]` | Time intervals in minutes |
| `isochrone.onIsochroneLoaded` | `(data) => void` | Callback with GeoJSON result |

**Example:**
```tsx
<MapView
  isochrone={{
    origin: [2.3522, 48.8566],
    profile: "driving",
    intervals: [5, 10, 15, 20], // 5, 10, 15, 20 minutes
    onIsochroneLoaded: (geojson) => {
      console.log("Isochrone data:", geojson);
    }
  }}
/>
```

---

### GeoJSON Features

Display custom vector features like polygons, lines, or points.

| Prop | Type | Description |
|------|------|-------------|
| `features` | `Feature \| Feature[] \| FeatureCollection` | GeoJSON data to render |

**Example:**
```tsx
<MapView
  features={{
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [
        [2.3, 48.8],
        [2.4, 48.9],
        [2.5, 48.85]
      ]
    },
    properties: {
      color: "#ef4444"
    }
  }}
/>
```

---

## 🧠 Advanced Use Cases

### 🧭 Real-time GPS Tracking
```tsx
function LiveTracking() {
  const [position, setPosition] = useState([2.3522, 48.8566]);
  
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((pos) => {
      setPosition([pos.coords.longitude, pos.coords.latitude]);
    });
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <MapView
      markers={[{
        id: 'current',
        lng: position[0],
        lat: position[1],
        Tooltip: <div>You are here</div>
      }]}
      center={position}
      zoom={15}
      fitBounds={false}
    />
  );
}
```

### 🔄 Dynamic Data with React Query
```tsx
import { useQuery } from '@tanstack/react-query';

function DynamicMarkers() {
  const { data: markers } = useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
    refetchInterval: 5000 // Refresh every 5s
  });

  return (
    <MapView
      markers={markers}
      fitBounds
      fitBoundsAnimationKey={markers?.length}
    />
  );
}
```

### 🎨 Custom Marker Components
```tsx
function CustomMarker({ isActive, count }) {
  return (
    <Box
      sx={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        bgcolor: isActive ? 'success.main' : 'grey.500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        border: '2px solid white',
        boxShadow: 2
      }}
    >
      {count}
    </Box>
  );
}

<MapView
  markers={[{
    id: 1,
    lng: 2.3522,
    lat: 48.8566,
    IconComponent: CustomMarker,
    iconProps: { isActive: true, count: 5 }
  }]}
/>
```

### 🗺️ Multi-Route Comparison
```tsx
<MapView
  features={[
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: route1
      },
      properties: { color: "#3b82f6" }
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: route2
      },
      properties: { color: "#ef4444" }
    }
  ]}
/>
```

### 🎯 Click-to-Add Markers
```tsx
function InteractiveMap() {
  const [markers, setMarkers] = useState([]);

  const handleMapClick = (lng, lat) => {
    setMarkers(prev => [...prev, {
      id: Date.now(),
      lng,
      lat,
      Tooltip: <div>Point {markers.length + 1}</div>
    }]);
  };

  return (
    <MapView
      markers={markers}
      onMapClick={handleMapClick}
    />
  );
}
```

---

## 💡 Tips & Best Practices

### Performance Optimization

- **Memoize marker data** to prevent unnecessary re-renders
- **Use `fitBoundsAnimationKey`** to control when bounds recalculate
- **Disable animations** for large datasets: `disableAnimation={true}`
- **Debounce dynamic updates** when tracking real-time data

### UX Improvements

- Combine `openPopupOnHover` and `disableAnimation` for smooth interactions
- Use `fitBoundsPadding` to ensure markers aren't at screen edges
- Set appropriate `popupMaxWidth` for mobile responsiveness
- Provide visual feedback with custom `IconComponent` states

### Routing Best Practices

- **Use OSRM** (free) for basic routing needs
- **Use Mapbox** for production apps requiring SLA and support
- Cache route results to minimize API calls
- Handle network errors gracefully

---

## 🧑‍💻 Development

### Prerequisites

- **Bun** ≥1.1.0 (recommended) or Node.js 18+
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/tracktor-tech/tracktor-map.git
cd tracktor-map

# Install dependencies
bun install

# Start development sandbox
bun run sandbox
# or
bun run dev:sandbox
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun run sandbox` | Start interactive development playground |
| `bun run build` | Build library for production |
| `bun run build:sandbox` | Build sandbox demo site |
| `bun run deploy:sandbox` | Deploy sandbox to GitHub Pages |
| `bun run lint` | Check code quality and types |
| `bun run lint:fix` | Auto-fix linting issues |
| `bun run test` | Run test suite |
| `bun run test:watch` | Run tests in watch mode |
| `bun run version` | Bump version with changelog |
| `bun run release` | Build and publish to npm |

### Project Structure
```
@tracktor/map/
├── src/
│   ├── components/       # Reusable map and UI components (Marker, Popup, etc.)
│   ├── constants/        # Shared configuration values and styling constants
│   ├── context/          # React context providers (e.g. map state)
│   ├── features/         # Core map features (routes, isochrones, nearest, etc.)
│   ├── services/         # External APIs and utility services
│   ├── types/            # TypeScript interfaces and types
│   ├── utils/            # Generic helpers and formatting functions
│   └── main.ts           # Library entry point
│
├── sandbox/              # Development playground (example app & live demos)
│   ├── context/          # Demo context providers
│   ├── examples/         # Interactive usage examples
│   ├── features/         # Components used in the docs/demo
│   ├── public/           # Static assets (images, previews, etc.)
│   ├── App.tsx           # Sandbox root component
│   └── index.tsx         # Sandbox entry file
│
└── test/                 # Unit and integration tests
```

### Testing
```bash
# Run all tests
bun test

# Watch mode
bun test:watch

# Run specific test file
bun test src/components/MapView.test.tsx
```

### Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`bun run test && bun run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

**Code Style:**
- Follow existing patterns and conventions
- Use TypeScript for all new code
- Add tests for new features
- Update documentation as needed

---

## 📘 Documentation & Examples

Explore interactive examples and comprehensive API documentation:

👉 **[Live Documentation & Sandbox](https://tracktor.github.io/map)**

The sandbox includes:
- Interactive code examples
- Live preview of all features
- Copy-paste ready snippets
- API reference with search

---

## 📦 Publishing & Deployment

### Publish to npm
```bash
# Update version and generate changelog
bun run version

# Build and publish
bun run release
```

### Deploy Sandbox to GitHub Pages
```bash
bun run deploy:sandbox
```

This will:
1. Build the sandbox with production optimizations
2. Generate a 404.html for client-side routing
3. Push to the `gh-pages` branch
4. Update the live documentation site

---

## 🔧 Troubleshooting

### Common Issues

**Map not rendering:**
- Verify your Mapbox token is valid
- Check browser console for errors
- Ensure mapbox-gl CSS is imported

**TypeScript errors:**
- Run `bun install` to update type definitions
- Check peer dependency versions match

**Performance issues:**
- Reduce marker count or use clustering
- Disable animations for large datasets
- Memoize marker data

### Getting Help

- 📖 Check the [documentation](https://tracktor.github.io/map)
- 🐛 [Report bugs](https://github.com/tracktor-tech/tracktor-map/issues)
- 💬 Join discussions in GitHub Discussions

---

## 📄 License

**UNLICENSED** — This package is proprietary software.  
© [Tracktor — Kevin Graff]

---

## 🧭 Links

- 📦 **npm**: [@tracktor/map](https://www.npmjs.com/package/@tracktor/map)
- 💻 **GitHub**: [tracktor-tech/tracktor-map](https://github.com/tracktor-tech/tracktor-map)
- 🌐 **Docs**: [tracktor.github.io/map](https://tracktor.github.io/map)
- 🎨 **Design System**: [@tracktor/design-system](https://www.npmjs.com/package/@tracktor/design-system)

---

## 🙏 Acknowledgments

Built with:
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) — Powerful map rendering
- [react-map-gl](https://visgl.github.io/react-map-gl/) — React wrapper for Mapbox
- [OSRM](http://project-osrm.org/) — Free routing engine
- [@tracktor/design-system](https://www.npmjs.com/package/@tracktor/design-system) — UI components