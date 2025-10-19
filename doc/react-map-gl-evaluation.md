# React-Map-GL Migration Feasibility Analysis

**Date:** 2025-10-19
**Status:** ✅ FEASIBLE - Recommended to proceed

## Executive Summary

Migration from vanilla `mapbox-gl` to `react-map-gl` is **feasible and recommended**. All current features are supported, and the migration would result in cleaner, more maintainable React code with better TypeScript integration.

## Current Implementation Analysis

### MapboxglClusteredMap.tsx (Complex)
**Current approach:** Imperative with manual lifecycle management

**Features used:**
- ✅ GeoJSON source with clustering enabled
- ✅ Custom `clusterProperties` for aggregating enrollment data
- ✅ Multiple layers (clusters, cluster-count, unclustered-point, unclustered-count)
- ✅ Dynamic paint expressions with step functions
- ✅ Cluster expansion on click
- ✅ Custom cursor on hover
- ✅ Navigation controls
- ✅ Dynamic layer updates when `clusterByProperty` changes

**Complexity level:** High
- Manual layer add/remove on updates (lines 167-172)
- Imperative event listeners
- Complex sizing calculations based on data

### MapboxglPointMap.tsx (Simple)
**Current approach:** Imperative with manual lifecycle management

**Features used:**
- ✅ Basic map with marker
- ✅ Disabled interactions (drag, zoom, etc.)
- ✅ Navigation controls

**Complexity level:** Low
- Simple marker placement
- Minimal interactivity

## React-Map-GL Capabilities

### Supported Features
| Feature | Native mapbox-gl | react-map-gl | Notes |
|---------|------------------|--------------|-------|
| Clustering | ✅ | ✅ | Full support via `<Source>` props |
| clusterProperties | ✅ | ✅ | Custom aggregation supported |
| Multiple layers | ✅ | ✅ | `<Layer>` components |
| Paint expressions | ✅ | ✅ | All Mapbox style spec supported |
| Event handlers | ✅ | ✅ | React-friendly event props |
| Markers | ✅ | ✅ | `<Marker>` component |
| Navigation controls | ✅ | ✅ | `<NavigationControl>` component |
| TypeScript | ⚠️ Manual | ✅ Better | Improved types |

### Code Comparison

#### Current (Imperative):
```tsx
// Manual lifecycle management
useEffect(() => {
  if (!map) {
    const map = new mapboxgl.Map({...});
    map.on('load', () => {
      map.addSource('points', {...});
      map.addLayer({...});
    });
  }
  // Cleanup on prop change
  if (map) {
    map.removeLayer('clusters');
    map.removeSource('points');
    initLayers(map);
  }
}, [map, features, clusterByProperty]);
```

#### With react-map-gl (Declarative):
```tsx
<Map
  initialViewState={{ longitude: lng, latitude: lat, zoom }}
  mapStyle="mapbox://styles/mapbox/dark-v10"
>
  <Source
    id="points"
    type="geojson"
    data={features}
    cluster={true}
    clusterMaxZoom={14}
    clusterRadius={50}
    clusterProperties={{ [clusterByProperty]: ['+', ['get', clusterByProperty]] }}
  >
    <Layer {...clusterLayer} />
    <Layer {...clusterCountLayer} />
    <Layer {...unclusteredPointLayer} />
    <Layer {...unclusteredCountLayer} />
  </Source>
  <NavigationControl position="top-right" />
</Map>
```

## Migration Benefits

### ✅ Pros
1. **Declarative React patterns** - No manual lifecycle management
2. **Automatic cleanup** - React handles layer/source removal
3. **Better TypeScript support** - Improved types for props and events
4. **Simpler state management** - React state works naturally
5. **Reduced boilerplate** - ~40% less code estimated
6. **Better testability** - Easier to unit test declarative components
7. **Active maintenance** - react-map-gl is actively developed by Mapbox's parent company
8. **React 18/19 compatible** - Better concurrent rendering support

### ⚠️ Cons / Challenges
1. **Learning curve** - Team needs to learn declarative map patterns
2. **Migration effort** - ~1-2 days of focused work
3. **Testing required** - Need to verify all interactions work identically
4. **Bundle size** - Minimal increase (~10KB gzipped for wrapper)

## Migration Strategy

### Phase 1: Setup (1-2 hours)
1. Install `react-map-gl` v7.x (or latest)
2. Keep `mapbox-gl` as peer dependency
3. Update types if needed

### Phase 2: Simple Component First (2-3 hours)
1. Migrate `MapboxglPointMap.tsx` → `MapPointMap.tsx`
2. Replace imperative map creation with `<Map>` component
3. Replace manual marker with `<Marker>` component
4. Test thoroughly

### Phase 3: Complex Component (4-6 hours)
1. Migrate `MapboxglClusteredMap.tsx` → `MapClusteredMap.tsx`
2. Convert sources/layers to declarative components
3. Migrate event handlers to react-map-gl patterns
4. Extract layer definitions to separate configs
5. Test cluster expansion, clicks, hover states

### Phase 4: Testing & Polish (2-3 hours)
1. Visual regression testing
2. Interaction testing (clicks, hovers, zoom)
3. Performance comparison
4. Update documentation

**Total estimated effort:** 1-2 days

## Recommendation

**✅ PROCEED WITH MIGRATION**

**Rationale:**
1. All required features are fully supported
2. Code quality and maintainability will improve significantly
3. Better alignment with modern React patterns
4. Minimal risk - can keep old components as fallback during migration
5. Future-proof for React 19 and concurrent features

**Timing:**
- Best done after React 19 migration but before major new features
- Could be done in parallel with TanStack Query migration (no conflicts)

## Next Steps

1. ✅ Create proof-of-concept for simple map (MapboxglPointMap)
2. Validate clustering works identically in POC
3. If POC successful, proceed with full migration
4. Update MODERNIZATION.md with decision
5. Update CLAUDE.md after migration complete

## References

- [react-map-gl Documentation](https://visgl.github.io/react-map-gl/)
- [react-map-gl Clustering Example](https://visgl.github.io/react-map-gl/examples/clusters)
- [Mapbox GL JS Style Spec](https://docs.mapbox.com/mapbox-gl-js/style-spec/)
