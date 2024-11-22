export type FilterOperator =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "nin"
  | "contains"
  | "startsWith"
  | "endsWith";

export type FilterFieldConfig = {
  [Operator in FilterOperator]?: unknown;
};

export type FilterConfig<TField extends string> = Partial<
  {
    [Field in TField]: FilterFieldConfig;
  }
>;
