import { writeFile } from "node:fs";

import { logFileGenResult, logFileGenStart } from "../loggers";

export function generateFile(content: string, path: string) {
  logFileGenStart();
  writeFile(path, content, (err) => {
    if (err) {
      logFileGenResult(false, "", err);
    } else {
      logFileGenResult(true, path, undefined);
    }
  });
}
