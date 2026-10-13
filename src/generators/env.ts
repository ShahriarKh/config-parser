import { logContent } from "../loggers";
import type { Config, Item, EnvGeneratorOptions } from "../types";
import { generateFile } from "./shared";

function parseItem(item: Item): string {
  const mode = item.schema._zod.optin;
  return `${item.env}=\t${mode ? "# " + mode : ""}`;
}

function parseConfig(config: Config): Array<string> {
  return Object.entries(config).flatMap(([key, val]) =>
    "schema" in val
      ? [parseItem(val as Item)]
      : [`\n# ${key}`, ...parseConfig(val as Config)],
  );
}

const defaultOptions: EnvGeneratorOptions = {
  outputFile: "./env.example",
  createFile: true,
  showInTerminal: true,
};

export function generateEnvExample(
  config: Config,
  options?: Partial<EnvGeneratorOptions>,
) {
  const { showInTerminal, createFile, outputFile } = {
    ...defaultOptions,
    ...options,
  };
  const content = parseConfig(config).join("\n");

  if (showInTerminal) logContent(content, "env");

  if (createFile) generateFile(content, outputFile);
}
