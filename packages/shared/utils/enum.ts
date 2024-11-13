/**
 * Returns an array of enum values from an enum-like object.
 * Ensures that the enum has at least one value.
 *
 * @param obj - An object with string values representing an enum
 * @returns An array of enum values
 * @throws {Error} If the enum object has no values
 *
 * @example
 * const ITEM_TYPE = {
 *   ARTICLE: "article",
 *   EMAIL: "email",
 * } as const;
 *
 * enumValues(ITEM_TYPE) // returns ["article", "email"]
 */
export function enumValues<T extends Record<string, string>>(
  obj: T,
): T[keyof T][] {
  const values = Object.values(obj);
  if (values.length === 0) {
    throw new Error("Enum must have at least one value");
  }
  return values as T[keyof T][];
}

/**
 * Returns a tuple of enum values from an enum-like object.
 * Useful for creating Zod enums with proper type inference.
 *
 * @param obj - An object with string values representing an enum
 * @returns A tuple of enum values with at least one element
 * @throws {Error} If the enum object has no values
 *
 * @example
 * const ITEM_TYPE = {
 *   ARTICLE: "article",
 *   EMAIL: "email",
 * } as const;
 *
 * // returns ["article", "email"] as ["article", ...string[]]
 * enumValuesTuple(ITEM_TYPE)
 *
 * // Usage with Zod
 * z.enum(enumValuesTuple(ITEM_TYPE))
 */
export function enumValuesTuple<T extends Record<string, string>>(
  obj: T,
): [T[keyof T], ...T[keyof T][]] {
  const values = enumValues(obj);
  return values as [T[keyof T], ...T[keyof T][]];
}

/**
 * Type utility to extract a tuple type from an enum-like object.
 * Used for type annotations when you need the tuple type but not the values.
 *
 * @example
 * const ITEM_TYPE = {
 *   ARTICLE: "article",
 *   EMAIL: "email",
 * } as const;
 *
 * type ItemTypeTuple = EnumValueTuple<typeof ITEM_TYPE>; // ["article", "email"]
 */
export type EnumValueTuple<T extends Record<string, string>> = [
  T[keyof T],
  ...T[keyof T][],
];
