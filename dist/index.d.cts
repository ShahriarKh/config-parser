import { ZodType, z } from "zod/v4";
//#region src/types.d.ts
type Item<T extends ZodType = ZodType> = {
  env: string;
  schema: T;
  secret?: string;
};
type Config = {
  [key: string]: Item | Config;
};
type InferConfig<T> = T extends {
  schema: infer S extends ZodType;
} ? z.infer<S> : T extends object ? { [K in keyof T]: InferConfig<T[K]>; } : never;
type ReadZodConfigOptions = {
  showLogs: boolean;
  secretsDir: string;
};
//#endregion
//#region src/index.d.ts
export declare function readZodConfig<T extends Config>(config: T, options?: Partial<ReadZodConfigOptions>): Promise<InferConfig<T>>;
//#endregion
export type { Config };