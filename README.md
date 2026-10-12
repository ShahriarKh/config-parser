# Install

```sh
npm i @shahriarkh/config-parser
```

# Example

```ts
import { readZodConfig, type Config } from "@shahriarkh/config-parser";

import z from "zod";

const exampleConfig: Config = {
  port: {
    env: "PORT",
    schema: z.int(),
  },
  db: {
    name: {
      env: "DB_NAME",
      schema: z.string().min(1),
    },
    pass: {
      secret: "db_pass",
      env: "DB_PASS",
      schema: z.string().min(1),
    },
  },
};

const config = readZodConfig({ config: exampleConfig });
```
