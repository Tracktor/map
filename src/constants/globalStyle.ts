import { Theme } from "@tracktor/design-system";

const mapboxGlobalStyles = (theme: Theme) => ({
  ".mapboxgl-popup-content": {
    backgroundColor: "transparent!important",
    borderRadius: "0px !important",
    boxShadow: "none!important",
    padding: "0px 0px!important",
    width: "fit-content!important",
  },
  ".mapboxgl-popup-tip": {
    borderTopColor: theme.palette.mode === "dark" ? "#1e1e1e !important" : "#ffffff !important",
  },
});

export default mapboxGlobalStyles;
