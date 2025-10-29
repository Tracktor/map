/**
 * Split an array into evenly sized chunks.
 *
 * @param items - The array to split.
 * @param chunkSize - The maximum number of elements per chunk.
 * @returns An array of chunks (each being a subarray of `items`).
 */
const chunkArray = <T>(items: T[], chunkSize: number): T[][] => {
  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0");
  }

  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
};

export default chunkArray;
