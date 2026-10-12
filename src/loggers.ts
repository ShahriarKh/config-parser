import type { ZodSafeParseResult } from "zod";

export function logCantReadSecret(path: string, keyName: string) {
  console.warn(`- ⚠️  ${keyName}\treading ${path} failed; falls back to env.`);
}

export function logParseResult(
  parseResult: ZodSafeParseResult<unknown>,
  keyName: string,
) {
  console.log(
    parseResult.success
      ? `- ✅ ${keyName}`
      : `- ❌ ${keyName}\t${parseResult.error?.issues
          .map((issue) => issue.message.replace(/^Invalid input:\s*/, ""))
          .join(", ")}`,
  );
}
