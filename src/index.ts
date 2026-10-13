import { readFile } from "node:fs/promises";

import { logCantReadSecret, logParseResult, logStart } from "./loggers.js";
import type {
  Config,
  Item,
  ParsedConfig,
  ParsedItem,
  ReadZodConfigOptions,
} from "./types.js";

function readEnv(name: string): ParsedItem {
  return process.env[name];
}

async function readSecret(
  name: string,
  keyName: string,
  secretsDir: string,
): Promise<ParsedItem> {
  // to fix trailing slash
  const path = secretsDir.replace(/\/?$/, "/") + name;

  try {
    return (await readFile(path, "utf8")).trim();
  } catch {
    logCantReadSecret(path, keyName);
    return undefined;
  }
}

async function parseItem(
  item: Item,
  keyName: string,
  secretsDir: string,
): Promise<ParsedItem> {
  const valSecret = item.secret
    ? await readSecret(item.secret, keyName, secretsDir)
    : undefined;
  const valSecretOrEnv = valSecret ?? readEnv(item.env);
  const parseResult = item.schema.safeParse(valSecretOrEnv);
  const result = parseResult.data as ParsedItem;

  logParseResult(
    parseResult,
    keyName,
    item.schema._zod.optin === "defaulted",
    item.schema._zod.optin === "optional" && result === undefined,
  );

  return result;
}

async function parseConfig(
  config: Config,
  parentKey: string = "",
  secretsDir: string,
): Promise<ParsedConfig> {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(config).map(async ([key, val]) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        return [
          key,
          "schema" in val
            ? await parseItem(val as Item, fullKey, secretsDir)
            : await parseConfig(val as Config, fullKey, secretsDir),
        ];
      }),
    ),
  );
}

const defaultOptions: ReadZodConfigOptions = {
  showLogs: true,
  secretsDir: "/run/secrets",
};

export async function readZodConfig(
  config: Config,
  options?: Partial<ReadZodConfigOptions>,
) {
  const finalOptions = {
    ...defaultOptions,
    ...options,
  };
  logStart();
  const finalConfig = await parseConfig(config, "", finalOptions.secretsDir);
  return finalConfig;
}

export type { Config } from "./types.js";
