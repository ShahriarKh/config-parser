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

// access values from the object
console.log(config.db.name);
```

# API

Each config item requires a `schema` for validation, an `env` name to read the
value from, and an optional `secret` which is a path to a file to read the
secret from it.

If a secret is defined but the file can't be opened or read, it falls back to
env. It's also useful for development, where you want secrets defined in .env
and are not using files.

```ts
const appConfig: Config = {
  apiKey: {
    secret: "/keys/api_key",    // read from `/path/to/secrets/keys/api_key`
    env: "API_KEY",             // read from process.env.API_KEY if secret file can't be read
    schema: z.string().min(10), // zod schema to validate
  },
};
```

The `readZodCOnfig` function returns the parsed object which you can use in your
app. Note that secrets and envs are not injected into the process and are only
placed in this object. You can call this function in the entrypoint of your app
or wherever you think is the best.

```ts
const myAppConfig = readZodConfig({
  config: configObject,
  secretsDir: "/path/to/secrets",
});
```

Default secrets directory is `/run/secrets`. You can change it with a relative
or an absolute path.

# Development

```sh
npm publish --access public
```
