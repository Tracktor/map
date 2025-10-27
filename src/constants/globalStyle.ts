import { Theme } from "@tracktor/design-system";

const mapboxGlobalStyles = (theme: Theme) => ({
  ".mapboxgl-popup-close-button": {
    color: theme.palette.mode === "dark" ? "#fff !important" : "#000 !important",
    fontSize: "20px !important",
  },

  ".mapboxgl-popup-content": {
    backgroundColor: "transparent!important",
    borderRadius: "0px !important",
    boxShadow: "none!important",
    padding: "0px 0px!important",
    width: "fit-content!important",
  },

  ".mapboxgl-popup-tip": {
    borderTopColor: `${theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff"} !important`,
  },
});

export default mapboxGlobalStyles;
