import type { ZodSafeParseResult } from "zod";

export function logCantReadSecret(path: string, keyName: string) {
  console.warn(`- ⚠️  ${keyName}\treading ${path} failed; falls back to env.`);
}

export function logParseResult(
  parseResult: ZodSafeParseResult<unknown>,
  keyName: string,
  isUsingDefault: boolean,
  isIntentionallyEmpty: boolean,
) {
  console.log(
    parseResult.success
      ? `- ✅ ${keyName}\t${isUsingDefault ? "(using default value)" : isIntentionallyEmpty ? "(empty - optional) " : ""}`
      : `- ❌ ${keyName}\t${parseResult.error?.issues
          .map((issue) => issue.message.replace(/^Invalid input:\s*/, ""))
          .join(", ")}`,
  );
}

export function logContent(content: string, title: "env" | "compose") {
  console.log(
    `⚙️  ${title === "env" ? "Environment Variables" : "Docker Compose"}:\n`,
  );
  console.log(content, "\n");
}

export function logFileGenStart() {
  console.log("⚙️  Generating env file...");
}

export function logFileGenResult(
  isSuccessful: boolean,
  filepath: string,
  err: unknown,
) {
  if (isSuccessful) console.log("✅ File created at " + filepath);
  else console.error("❌ Failed to create file: ", err);
}

export function logStart() {
  console.log("⚙️  Reading config...");
}
