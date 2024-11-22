/**
 * Converts a camelCase string to snake_case
 * @example
 * toSnakeCase('camelCase') // returns 'camel_case'
 * toSnakeCase('ThisIsATest') // returns 'this_is_a_test'
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "");
}

/**
 * Converts a snake_case string to camelCase
 * @example
 * toCamelCase('snake_case') // returns 'snakeCase'
 * toCamelCase('this_is_a_test') // returns 'thisIsATest'
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
