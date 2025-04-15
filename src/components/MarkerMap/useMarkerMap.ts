import { useTheme } from "@tracktor/design-system";
import { Map, MapMouseEvent, LngLatBounds } from "mapbox-gl";
import { ComponentRef, useEffect, useRef, useState } from "react";
import { isValidLatLng } from "@/main.ts";
import { MarkerMapProps } from "@/types/MarkerMapProps.ts";
import addPopup from "@/utils/addPopup";
import coordinateConverter from "@/utils/coordinateConverter";
import { handleMapClick } from "@/utils/handleMapClick";
import isWebGLSupported from "@/utils/isWebGLSupported.ts";
import { loadMarkers } from "@/utils/loadMarkers.tsx";
import mapOptions from "@/utils/mapOptions";

export const DEFAULT_CENTER_LNG = 2.333;
export const DEFAULT_CENTER_LAT = 46.8677;

/**
 * Custom React hook to integrate and manage a Mapbox map instance with dynamic markers,
 * popups, zooming, centering, and click handling.
 *
 * This hook:
 * - Initializes a Mapbox map inside a container
 * - Loads and displays markers on the map
 * - Adds popups to specific markers when requested
 * - Adjusts the map center or fits bounds based on markers
 * - Handles map click events with a provided callback
 * - Supports customizable flyTo behavior, zoom levels, and map style
 */
const useMarkerMap = ({
  markers,
  loading,
  center,
  openPopup,
  onMapClick,
  flyToDuration = 5000,
  fitBoundDuration = 1000,
  fitBounds = true,
  disableFlyTo = false,
  fitBoundsPadding = 50,
  mapStyle = "mapbox://styles/mapbox/streets-v12?optimize=true",
  zoom = 6,
  zoomFlyFrom = 3,
}: MarkerMapProps) => {
  const { palette } = useTheme();
  const [loadingMapBox, setLoadingMapBox] = useState<boolean>(true);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const mapContainer = useRef<ComponentRef<"div"> | null>(null);
  const map = useRef<Map | null>(null);
  const markersAreInvalid = !markers || markers.some((marker) => marker.lat === undefined || marker.lng === undefined);

  // Initialize the Mapbox map only once when the component mounts
  useEffect(() => {
    if (!isWebGLSupported()) {
      setWebGLSupported(false);
      setLoadingMapBox(false);
      return;
    }

    if (map.current || !mapContainer.current || loading) {
      return;
    }

    // Clean up container if needed
    if (mapContainer.current.innerHTML !== "") {
      mapContainer.current.innerHTML = "";
    }

    const options = mapOptions({ center, mapContainer, mapStyle, markers, zoomFlyFrom });

    map.current = new Map(options);
  }, [center, loading, mapStyle, markers, zoomFlyFrom]);

  // Add or refresh markers when the map or marker data changes
  useEffect(() => {
    if (!map.current || markersAreInvalid) return;

    const handleLoadMarkers = () => {
      loadMarkers({ map, markers, palette, setLoadingMapBox });
    };

    // If the map is already loaded, immediately add markers
    // Otherwise, wait for the "load" event
    if (map.current.loaded()) {
      handleLoadMarkers();
    } else {
      map.current.once("load", handleLoadMarkers);
    }
  }, [markers, markersAreInvalid, palette]);

  // Add popup to the selected marker, and clean up existing popups
  useEffect(() => {
    if (!map.current || !markers) return undefined;

    // Remove all existing popups
    // eslint-disable-next-line no-underscore-dangle
    const popupMps = map.current._popups;
    if (popupMps.length) {
      popupMps.forEach((popup) => popup.remove());
    }

    // Open the specified popup if provided
    if (openPopup) {
      const marker = markers.find((getMarker) => getMarker.id === openPopup);
      const coordinates: [number, number] = [Number(marker?.lng) || 0, Number(marker?.lat) || 0];
      addPopup({ coordinates, map, tooltip: marker?.Tooltip });
    }

    // Add click handler to the map (for identifying clicked markers, etc.)
    const handleOnMapClick = (event: MapMouseEvent) => {
      handleMapClick({ event, map, markers });
    };

    map.current.on("click", handleOnMapClick);

    // Cleanup on unmount or re-run
    return () => {
      map.current?.off("click", handleOnMapClick);
    };
  }, [map, markers, openPopup]);

  // Update map center when `center` prop changes
  useEffect(() => {
    if (!map.current || !center) return;

    const mapCenter =
      Array.isArray(center) && isValidLatLng(center[1], center[0])
        ? coordinateConverter(center)
        : { lat: DEFAULT_CENTER_LAT, lng: DEFAULT_CENTER_LNG };

    if (!mapCenter) return;

    map.current.setCenter(mapCenter);
  }, [center]);

  // Trigger `onMapClick` when user clicks on the map
  useEffect(() => {
    if (!map.current || !onMapClick) return undefined;

    const handleClick = (e: MapMouseEvent) => onMapClick(e.lngLat.lng, e.lngLat.lat);
    map.current.on("click", handleClick);

    // Cleanup on unmount or change
    return () => {
      map.current?.off("click", handleClick);
    };
  }, [onMapClick]);

  // Animate camera or fit map bounds depending on props
  useEffect(() => {
    if (!map.current) return;

    // Optionally animate camera fly-to
    if (!disableFlyTo) {
      map.current.flyTo({
        duration: flyToDuration,
        zoom,
      });
    }

    // If enabled and multiple valid markers exist, fit the map to show all markers
    if (!fitBounds || !markers?.length || markers?.length < 2) return;

    const bounds = new LngLatBounds();

    const validMarkers = markers.filter((marker) => {
      const lng = Number(marker.lng);
      const lat = Number(marker.lat);
      return isValidLatLng(lat, lng);
    });

    if (validMarkers.length < 2) return;

    for (let i = 0; i < validMarkers.length; i += 1) {
      const lng = Number(validMarkers[i].lng);
      const lat = Number(validMarkers[i].lat);

      bounds.extend([lng, lat]);
    }

    map.current.fitBounds(bounds, {
      duration: fitBoundDuration,
      padding: fitBoundsPadding,
    });
  }, [markers, fitBounds, fitBoundsPadding, flyToDuration, zoom, fitBoundDuration, disableFlyTo]);

  // Cleanup the map instance on component unmount
  useEffect(
    () => () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    },
    [],
  );

  return {
    loading: loadingMapBox || loading,
    map,
    mapContainer,
    markers,
    webGLSupported,
  };
};

export default useMarkerMap;
