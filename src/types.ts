import { z, type ZodType } from "zod/v4";

export type Item<T extends ZodType = ZodType> = {
  env: string;
  // schema: ZodType; //T;
  schema: T;
  secret?: string;
};

export type Config = {
  [key: string]: Item | Config;
};

export type InferConfig<T> = T extends { schema: infer S extends ZodType }
  ? z.infer<S>
  : T extends object
    ? { [K in keyof T]: InferConfig<T[K]> }
    : never;

// ParsedItem may be undefined. It's zod's role to validate it.
export type ParsedItem = string | number | boolean | bigint | undefined;

export type ParsedConfig = {
  [name: string]: ParsedItem | ParsedConfig;
};

export type ReadZodConfigOptions = {
  showLogs: boolean;
  secretsDir: string;
};

export type ComposeStyle =
  | "list"
  | "mapping-no-value"
  | "mapping"
  | "interpolation"
  | "substitution";

export type EnvGeneratorOptions = {
  outputFile: string;
  showInTerminal: boolean;
  createFile: boolean;
};

export type ComposeGeneratorOptions = {
  outputFile: string;
  showInTerminal: boolean;
  createFile: boolean;
  style: ComposeStyle;
  envForSecrets: boolean;
  addComments: boolean;
  externalSecrets: boolean;
};
