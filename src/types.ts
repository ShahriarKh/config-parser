import type { ZodType } from "zod/v4";

export type Item = {
  //<T extends z.ZodType = z.ZodType> = {
  env: string;
  schema: ZodType; //T;
  secret?: string;
};

export type Config = {
  [x: string]: Item | Config;
};

// ParsedItem may be undefined. It's zod's role to validate it.
export type ParsedItem = string | number | boolean | bigint | undefined;

export type ParsedConfig = {
  [name: string]: ParsedItem | ParsedConfig;
};
