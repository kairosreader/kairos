/**
 * Converts an object of string literals to a tuple type suitable for Drizzle enums
 * @param obj The enum object to convert
 * @returns A tuple of the enum values
 */
export function enumValues<T extends { [K in string]: string }>(
  obj: T,
): [string, ...string[]] {
  const values = Object.values(obj);
  if (values.length === 0) {
    throw new Error("Enum must have at least one value");
  }
  return values as [string, ...string[]];
}
