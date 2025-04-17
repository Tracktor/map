import { Popup, Map } from "mapbox-gl";
import { RefObject, ReactNode } from "react";
import { createRoot } from "react-dom/client";

interface AddPopupProps {
  coordinates?: [number, number];
  tooltip?: ReactNode;
  map: RefObject<Map | null>;
}

/**
 * Creates a customized close button for a Mapbox popup
 *
 * @param {Popup} popup - The Mapbox popup instance to which the close button will be attached
 * @returns {HTMLButtonElement} - The configured close button element
 * @private
 */
const createCloseButton = (popup: Popup): HTMLButtonElement => {
  const closeButton = document.createElement("button");
  closeButton.innerText = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "5px";
  closeButton.style.right = "5px";
  closeButton.style.background = "transparent";
  closeButton.style.border = "none";
  closeButton.style.fontSize = "16px";
  closeButton.style.padding = "0";
  closeButton.style.margin = "0";
  closeButton.style.cursor = "pointer";
  closeButton.type = "button";
  closeButton.setAttribute("aria-label", "Close popup");
  closeButton.removeAttribute("aria-hidden");

  closeButton.onclick = () => popup.remove();

  return closeButton;
};

/**
 * Adds a React-based popup to a Mapbox map
 *
 * This function creates and displays a popup on a Mapbox map with custom content rendered
 * using React. The popup includes a styled close button and properly handles React component
 * lifecycle to prevent memory leaks.
 *
 * @param {Object} options - The configuration options
 * @param {MutableRefObject<Map | null>} options.map - Reference to the Mapbox map instance
 * @param {ReactNode} [options.tooltip] - React node to render inside the popup
 * @param {[number, number]} [options.coordinates] - [longitude, latitude] where the popup should appear
 * @returns {void}
 *
 * @example
 * // Basic usage
 * addPopup({
 *   map: mapRef,
 *   coordinates: [-73.985, 40.748],
 *   tooltip: <div>Empire State Building</div>
 * });
 *
 * @example
 * // With complex React content
 * addPopup({
 *   map: mapRef,
 *   coordinates: marker.position,
 *   tooltip: (
 *     <InfoWindow title={marker.title}>
 *       <p>{marker.description}</p>
 *       <button onClick={handleAction}>More Info</button>
 *     </InfoWindow>
 *   )
 * });
 */
const addPopup = ({ map, tooltip, coordinates }: AddPopupProps): Popup | null => {
  if (!coordinates || !tooltip || !map.current || !Array.isArray(coordinates) || coordinates.length !== 2) {
    return null;
  }

  const popupContainer = document.createElement("div");
  popupContainer.style.position = "relative";
  popupContainer.style.overflow = "hidden";

  const contentContainer = document.createElement("div");
  contentContainer.style.padding = "10px";

  popupContainer.style.zIndex = "1000";

  const root = createRoot(contentContainer);
  root.render(tooltip);

  const popup = new Popup({
    closeButton: false,
  })
    .setLngLat(coordinates)
    .setDOMContent(popupContainer)
    .addTo(map.current);

  popup.on("close", () => {
    queueMicrotask(() => {
      root.unmount();
    });
  });

  const closeButton = createCloseButton(popup);
  popupContainer.appendChild(closeButton);

  popupContainer.appendChild(contentContainer);

  return popup;
};

export default addPopup;
