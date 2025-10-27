import { render, screen } from "@testing-library/react";
import { describe, test, expect, mock } from "bun:test";
import MarkerMap from "@/Features/MarkerMap/MarkerMap";

mock.module("react-map-gl", () => ({
    __esModule: true,
    // @ts-ignore
    default: ({ children, ...props }) => (
        <div data-testid={props["data-testid"]}>{children}</div>
    ),
    // @ts-ignore
    Marker: ({ children }) => <div>{children}</div>,
    // @ts-ignore
    Popup: ({ children }) => <div>{children}</div>,
    // @ts-ignore
    Source: ({ children }) => <div>{children}</div>,
    // @ts-ignore
    Layer: ({ children }) => <div>{children}</div>,
}));

// 🧭 Mock du hook MarkerMap pour éviter la logique mapbox
mock.module("@/Features/MarkerMap/useMarkerMap", () => ({
    default: () => ({
        selectedMarker: null,
        setSelected: mock(),
        handleMarkerClick: mock(),
        handleMarkerHover: mock(),
        handleMapLoad: mock(),
        mapRef: { current: null },
        dblZoom: true,
        initialCenter: { latitude: 48.8566, longitude: 2.3522, zoom: 5 },
        coreStyle: "mapbox://styles/mapbox/streets-v11",
        coopGestures: true,
        route: null,
    }),
}));

describe("🗺️ MarkerMap", () => {
    test("rend sans crash", () => {
        render(<MarkerMap onMapClick={() => {}} />);
        // @ts-ignore
        expect(screen.getByTestId("mapbox-container")).toBeInTheDocument();
    });
});
