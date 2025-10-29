/**
 * Process items in limited-size concurrent batches.
 *
 * @param items - The array of items to process.
 * @param batchSize - The maximum number of concurrent executions.
 * @param handler - An async function to process each item.
 * @returns A flattened array of results.
 */
const processInBatches = async <T, R>(items: T[], batchSize: number, handler: (item: T) => Promise<R>): Promise<R[]> => {
  const batches = Array.from({ length: Math.ceil(items.length / batchSize) }, (_, i) => items.slice(i * batchSize, (i + 1) * batchSize));

  const results = await Promise.all(batches.map(async (batch) => Promise.all(batch.map(handler))));

  return results.flat();
};

export default processInBatches;
