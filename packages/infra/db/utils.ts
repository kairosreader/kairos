export type DatabaseResult<T> = {
  [K in keyof T]: T[K] extends undefined | string ? string | null : T[K];
};

/**
 * Maps null values in a database result to undefined.
 * This is needed to transform the results from the database
 * to the expected entity type since null values are not allowed.
 *
 * @param obj - The database result to map
 * @returns - The mapped object
 */
export function mapNullToUndefined<T extends object>(
  obj: DatabaseResult<T>,
): T {
  const result = { ...obj };

  for (const key in result) {
    if (result[key] === null) {
      // @ts-expect-error: Dynamic assignment
      result[key] = undefined;
    }
  }

  return result as T;
}

/**
 * Maps null values in an array of database results to undefined.
 * This is needed to transform the results from the database
 * to the expected entity type since null values are not allowed.
 *
 * @param arr - The array of database results to map
 * @returns - The mapped array
 */
export function mapArrayNullToUndefined<T extends object>(
  arr: DatabaseResult<T>[],
): T[] {
  return arr.map((item) => mapNullToUndefined(item));
}
