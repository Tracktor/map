const isMac = () => {
  const nav = navigator as any;
  if (nav.userAgentData && nav.userAgentData.platform) {
    return nav.userAgentData.platform === "macOS";
  }
  return /Macintosh|MacIntel|MacPPC|Mac68K/.test(navigator.userAgent);
};

export default isMac;
