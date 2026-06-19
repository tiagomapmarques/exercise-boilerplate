import { availableParallelism } from 'node:os';

const concurrency = availableParallelism();

/** Maps `items` through `mapper` with a sensible concurrency limit. */
export const parallelMap = async (items, mapper) => {
  const results = new Array(items.length);
  let cursor = 0;

  const next = async () => {
    if (cursor >= items.length) {
      return;
    }
    const index = cursor;
    cursor += 1;
    results[index] = await mapper(items[index], index);
    await next();
  };

  const workerCount = Math.min(concurrency, items.length);
  const workers = Array.from({ length: workerCount }, () => next());
  await Promise.all(workers);
  return results;
};
