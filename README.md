# 📍 MarkerMap - React Map Library

**MarkerMap** is a React library built on top of Mapbox GL JS. It simplifies rendering interactive maps with customizable markers in your React applications.

## 🚀 Installation

```bash
npm install @tracktor/map
```

or

```bash
yarn add @tracktor/map
```

## 📦 Dependencies

This library depends on:

- `@tracktor/design-system` for theming and styling
- `mapbox-gl` for map rendering
- React 19+

## 🔧 Usage

```tsx
import { MapProvider, MarkerMap } from "@tracktor/map";

const markers = [
  {
    id: 1,
    lng: 2.3522,
    lat: 48.8566,
    Tooltip: <div>Paris</div>,
    iconImage: "marker-icon.png",
    size: 40,
    onClick: () => alert("Marker clicked!"),
  },
];

<MapProvider licenseMuiX="your-muix-licence" licenceMapbox="your-mapbox-licence">
    <MarkerMap
      markers={markers}
      center={[2.3522, 48.8566]}
      zoom={10}
      fitBounds
      height={400}
      width="100%"
    />
</MapProvider>
```

## 🧩 Props

### MarkerMap Props

| Prop               | Type                                 | Description                                            |
|--------------------|--------------------------------------|--------------------------------------------------------|
| `markers`          | `MarkerProps[]`                      | List of markers to display                             |
| `center`           | `LngLatLike` or `[number, number]`   | Initial map center coordinates                         |
| `zoom`             | `number`                             | Initial zoom level                                     |
| `fitBounds`        | `boolean`                            | Automatically fit the map to the bounds of all markers |
| `fitBoundsPadding` | `number`                             | Padding around markers when fitting bounds             |
| `zoomFlyFrom`      | `number`                             | Zoom level to fly in from                              |
| `popupMaxWidth`    | `string`                             | Max width for popups                                   |
| `width`            | `number` or `string`                 | Map width                                              |
| `height`           | `number` or `string`                 | Map height                                             |
| `loading`          | `boolean`                            | Whether to show a loading state                        |
| `markerImageURL`   | `string`                             | Default marker image URL                               |
| `containerStyle`   | `SxProps`                            | Custom styles for the map container                    |
| `disableFlyTo`     | `boolean`                            | Disable flyTo animation on marker click                |
| `flyToDuration`    | `number`                             | Duration of the flyTo animation                        |
| `fitBoundDuration` | `number`                             | Duration of the fitBounds animation                    |
| `square`           | `boolean`                            | Forces the map to be square-shaped                     |
| `openPopup`        | `number` or `string`                 | ID of the marker with an open popup                    |
| `openPopupOnHover` | `boolean`                            | Automatically open popups on marker hover              |
| `onMapClick`       | `(lng: number, lat: number) => void` | Callback triggered when clicking on the map            |

### MarkerProps

| Prop        | Type                 | Description                                                   |
|-------------|----------------------|---------------------------------------------------------------|
| `id`        | `number` or `string` | Unique marker identifier                                      |
| `lng`       | `number`             | Longitude                                                     |
| `lat`       | `number`             | Latitude                                                      |
| `Tooltip`   | `ReactNode`          | Tooltip content displayed in a popup                          |
| `iconImage` | `string`             | Image URL used as marker icon                                 |
| `size`      | `number`             | Marker size in pixels                                         |
| `zIndex`    | `number`             | Z-index to control stacking order                             |
| `onClick`   | `() => void`         | Function triggered on marker click                            |
| `type`      | `string`             | Custom marker type (optional, for filtering or styling)       |
| `name`      | `string`             | Name of the marker                                            |
| `Icon`      | `ReactNode`          | Custom React component to render instead of default image     |


## 🧑‍💻 Contributing

Contributions are welcome! Please follow the coding conventions and include tests when necessary.

## 📄 License

MIT © [Kevin Graff / Tracktor]


## GH-Pages
This project uses GitHub Pages for documentation hosting. To deploy the documentation, run:

```
bun run deploy:example
```
This will build the documentation and push it to the `gh-pages` branch.

GH-Pages URL: https://tracktor.github.io/map/