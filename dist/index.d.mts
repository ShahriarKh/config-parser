import { ZodType } from "zod/v4";
//#region src/types.d.ts
type Item = {
  env: string;
  schema: ZodType;
  secret?: string;
};
type Config = {
  [x: string]: Item | Config;
};
type ParsedItem = string | number | boolean | bigint | undefined;
type ParsedConfig = {
  [name: string]: ParsedItem | ParsedConfig;
};
//#endregion
//#region src/index.d.ts
export declare function readZodConfig({ config, secretsDir }: {
  config: Config;
  secretsDir?: string;
}): Promise<ParsedConfig>;
//#endregion
export type { Config };