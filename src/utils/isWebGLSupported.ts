/**
 * Checks if WebGL is supported by the browser using a similar approach to
 * the Firefox MDN example, with TypeScript typing
 *
 * @returns {boolean} True if WebGL is supported, false otherwise
 */
export const isWebGLSupported = (): boolean => {
  try {
    // Create canvas element (not added to document)
    const canvas = document.createElement("canvas");
    // Get WebGLRenderingContext from canvas element
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    // Return true if we got a valid WebGLRenderingContext
    return gl instanceof WebGLRenderingContext;
  } catch (e) {
    return false;
  }
};

export default isWebGLSupported;
