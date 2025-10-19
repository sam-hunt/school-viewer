# MapTiler Migration Plan

**Date:** 2025-10-19
**Status:** ✅ RECOMMENDED - Free for open source

## Why MapTiler?

### Cost Savings
- ✅ **FREE plan for non-commercial/open-source projects**
- Current Mapbox costs: Potentially expensive at scale
- MapTiler free tier: Suitable for personal projects
- No vendor lock-in concerns

### Open Source Commitment
MapTiler actively contributes to:
- MapLibre GL (open-source Mapbox fork)
- OpenMapTiles
- EPSG.io
- TileServer

## Migration Options

### Option 1: react-map-gl + MapLibre GL + MapTiler Tiles ⭐ RECOMMENDED
**Best for:** Declarative React patterns, full control, TypeScript support

**Approach:**
- Use `react-map-gl` with `maplibre-gl` as the renderer
- Point map style URL to MapTiler: `https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY`
- Keep all existing clustering logic (clusterProperties, custom paint expressions)
- Get all benefits of react-map-gl declarative API

**Installation:**
```bash
npm install react-map-gl maplibre-gl
npm uninstall mapbox-gl
```

**Code Example:**
```tsx
import Map, { Source, Layer } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

<Map
  initialViewState={{ longitude: 173, latitude: -41, zoom: 5 }}
  mapStyle="https://api.maptiler.com/maps/streets-v2-dark/style.json?key=YOUR_KEY"
>
  <Source
    id="points"
    type="geojson"
    data={features}
    cluster={true}
    clusterMaxZoom={14}
    clusterRadius={50}
    clusterProperties={{
      [clusterByProperty]: ['+', ['get', clusterByProperty]]
    }}
  >
    <Layer {...clusterLayer} />
    <Layer {...unclusteredLayer} />
  </Source>
</Map>
```

**Pros:**
- ✅ 100% compatible with existing clustering logic
- ✅ Declarative React patterns
- ✅ Excellent TypeScript support
- ✅ Actively maintained
- ✅ No vendor lock-in (MapLibre is open source)
- ✅ Can use any Mapbox/MapLibre examples

**Cons:**
- MapLibre GL has ~95% API compatibility with Mapbox GL (minor differences)

---

### Option 2: MapTiler SDK (Native)
**Best for:** Simpler API, less code, built-in helpers

**Approach:**
- Use MapTiler's own SDK (`@maptiler/sdk`)
- Built-in `helpers.addPoint()` with clustering
- More opinionated, less configuration

**Installation:**
```bash
npm install @maptiler/sdk
npm uninstall mapbox-gl
```

**Code Example:**
```tsx
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

const map = new maptilersdk.Map({
  container: mapContainer.current,
  style: maptilersdk.MapStyle.STREETS.DARK,
  center: [173, -41],
  zoom: 5
});

// Simplified clustering
helpers.addPoint(map, {
  data: schoolsGeoJSON,
  cluster: true,
  // Custom cluster properties are less documented
});
```

**Pros:**
- ✅ Simpler API with built-in helpers
- ✅ First-class TypeScript support
- ✅ Direct MapTiler integration

**Cons:**
- ⚠️ Less control over cluster customization
- ⚠️ Custom `clusterProperties` support unclear
- ⚠️ Smaller community (newer SDK)
- ⚠️ Would require rewriting map components more significantly

---

## Recommendation: Option 1 (react-map-gl + MapLibre)

**Rationale:**
1. **Minimal migration effort** - Similar API to current Mapbox GL implementation
2. **Full clustering control** - All current features supported (clusterProperties, custom expressions)
3. **React best practices** - Declarative component model
4. **Future-proof** - Open source, large community, no vendor lock-in
5. **TypeScript first-class** - Excellent type definitions
6. **Free tiles** - MapTiler provides free map tiles for OSS projects

## Migration Steps

### 1. Get MapTiler API Key
- [ ] Sign up at https://www.maptiler.com/cloud/
- [ ] Select free plan (non-commercial)
- [ ] Generate API key
- [ ] Add to `.env` as `VITE_MAPTILER_KEY`
- [ ] Update `.env.example`

### 2. Replace Dependencies
- [ ] `npm uninstall mapbox-gl @types/mapbox-gl`
- [ ] `npm install maplibre-gl react-map-gl`
- [ ] `npm install -D @types/maplibre-gl` (if needed)

### 3. Update Map Components
- [ ] Change CSS import: `mapbox-gl.css` → `maplibre-gl/dist/maplibre-gl.css`
- [ ] Change import: `from 'react-map-gl'` → `from 'react-map-gl/maplibre'`
- [ ] Update mapStyle URL to MapTiler endpoint
- [ ] Replace imperative map creation with `<Map>` component
- [ ] Convert sources/layers to `<Source>` and `<Layer>` components
- [ ] Test clustering behavior

### 4. Style Selection
MapTiler provides multiple dark styles suitable for the app:
- `streets-v2-dark` - General purpose (similar to current)
- `dataviz-dark` - Optimized for data visualization
- `backdrop-dark` - Minimal, good for overlays
- `basic-v2-dark` - Simple, fast loading

Full URL format:
```
https://api.maptiler.com/maps/{style}/style.json?key={YOUR_KEY}
```

### 5. Test & Validate
- [ ] Verify clustering works identically
- [ ] Test cluster expansion on click
- [ ] Verify custom cluster properties aggregate correctly
- [ ] Test all ethnicity grouping options
- [ ] Verify marker clicks work
- [ ] Test navigation controls
- [ ] Check mobile responsiveness
- [ ] Performance comparison

## Breaking Changes to Watch

### MapLibre vs Mapbox Differences
- Mapbox v2 → MapLibre v3/v4: ~95% compatible
- Most style spec is identical
- Event handlers same API
- Some advanced features may differ (3D, etc.)
- Our use case is basic - should have zero issues

## Bundle Size Impact

| Current | After Migration |
|---------|----------------|
| mapbox-gl: ~450KB gzipped | maplibre-gl: ~380KB gzipped |
| (no react wrapper) | react-map-gl: ~10KB gzipped |
| **Total: ~450KB** | **Total: ~390KB** |

**Result:** ~60KB smaller bundle + better code organization

## Timeline

**Estimated effort:** 4-6 hours
1. Setup (1 hour): API key, deps, config
2. Simple map migration (1-2 hours): MapboxglPointMap
3. Clustered map migration (2-3 hours): MapboxglClusteredMap
4. Testing & polish (1 hour): Visual regression, interactions

## Rollback Plan

If issues arise:
1. Keep old components in `src/pages/*/legacy/`
2. Git branch for migration
3. Can easily revert commits
4. MapLibre is 95% compatible so issues unlikely

## Next Steps After Migration

- [ ] Remove `VITE_MAPBOX_KEY` from `.env`
- [ ] Update CLAUDE.md with MapTiler info
- [ ] Update MODERNIZATION.md checkboxes
- [ ] Consider contributing improvements back to MapTiler docs

## References

- [MapTiler Cloud Pricing](https://www.maptiler.com/cloud/pricing/)
- [react-map-gl MapLibre docs](https://visgl.github.io/react-map-gl/docs/get-started/get-started#using-with-a-mapbox-gl-fork)
- [MapLibre GL JS docs](https://maplibre.org/maplibre-gl-js/docs/)
- [MapTiler React examples](https://docs.maptiler.com/react/)
