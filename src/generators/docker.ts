import { logContent } from "../loggers";
import type { Config, Item, ComposeGeneratorOptions } from "../types";
import { generateFile } from "./shared";

const indent = "  "; // because \t is not allowed in YAML

function parseEnv(item: Item, options: ComposeGeneratorOptions): string {
  const { style, envForSecrets, addComments } = options;

  if (item.secret && envForSecrets === false) return "";

  const envIndent = indent.repeat(3);

  const mode = item.schema._zod.optin;
  const comment = addComments && mode ? ` # ${mode}` : "";

  switch (style) {
    case "list":
      return envIndent + `- ${item.env}=` + comment;

    case "mapping-no-value":
      return envIndent + `- ${item.env}` + comment;

    case "mapping":
      return envIndent + `${item.env}:` + comment;

    case "interpolation":
      return envIndent + `${item.env}: \${${item.env}}` + comment;

    case "substitution":
      return envIndent + `${item.env}: '{{ ${item.env} }}'` + comment;

    default:
      return envIndent + item.env + comment;
  }
}

function parseConfigEnvs(
  config: Config,
  options: ComposeGeneratorOptions,
): Array<string> {
  return Object.values(config).flatMap((val) =>
    "schema" in val
      ? parseEnv(val as Item, options)
      : parseConfigEnvs(val as Config, options),
  );
}

function parseSecret(item: Item, options: ComposeGeneratorOptions): string {
  const secretIndent = indent.repeat(3);

  return secretIndent + "- " + item.secret!;
}

function parseConfigSecrets(
  config: Config,
  options: ComposeGeneratorOptions,
): Array<string> {
  return Object.values(config).flatMap((val) =>
    "schema" in val
      ? "secret" in val
        ? parseSecret(val as Item, options)
        : []
      : parseConfigSecrets(val as Config, options),
  );
}

function createFileContent(envs: string, secrets: string) {
  return [
    "services:",
    indent + "example:",
    indent + indent + "environment:",
    envs,
    indent + indent + "secrets:",
    secrets,
  ].join("\n");
}

const defaultOptions: ComposeGeneratorOptions = {
  outputFile: "./compose.example.yml",
  createFile: true,
  showInTerminal: true, // change to false
  style: "list",
  envForSecrets: false,
  addComments: true,
  externalSecrets: true,
};

export function generateDockerComposeExample(
  config: Config,
  options?: Partial<ComposeGeneratorOptions>,
) {
  const finalOptions = {
    ...defaultOptions,
    ...options,
  };

  const envs = parseConfigEnvs(config, finalOptions).join("\n");
  const secrets = parseConfigSecrets(config, finalOptions).join("\n");

  const content = createFileContent(envs, secrets);

  if (finalOptions.showInTerminal) logContent(content, "compose");

  if (finalOptions.createFile) generateFile(content, finalOptions.outputFile);
}
