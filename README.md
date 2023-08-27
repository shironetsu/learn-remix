# Remix を学ぶ

## テンプレートから初期化

https://remix.run/docs/en/1.19.3/tutorials/blog

TS か JS か聞かれる。

```
$ npx create-remix@latest --template remix-run/indie-stack blog-tutorial
Need to install the following packages:
  create-remix@1.19.3
Ok to proceed? (y) y
npm WARN deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs
? TypeScript or JavaScript? TypeScript
? Do you want me to run `npm install`? Yes
```

Dependencies のインストール。

```
npm WARN deprecated @npmcli/move-file@1.1.2: This functionality has been moved to @npmcli/fs

added 1337 packages, and audited 1338 packages in 2m

295 packages are looking for funding
  run `npm fund` for details

2 moderate severity vulnerabilities

To address all issues (including breaking changes), run:
  npm audit fix --force

Run `npm audit` for details.
```

`remix.init` というのが走る。SQLite で Prisma の DB の初期化+シーディングが行われる。

```
💿 Running remix.init script

> setup
> prisma generate && prisma migrate deploy && prisma db seed

Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

✔ Generated Prisma Client (4.16.2 | library) to ./node_modules/@prisma/client in 117ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
     ```
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
    ```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": SQLite database "data.db" at "file:./data.db?connection_limit=1"

SQLite database data.db created at file:./data.db?connection_limit=1

1 migration found in prisma/migrations

Applying migration `20220713162558_init`

The following migration have been applied:

migrations/
  └─ 20220713162558_init/
    └─ migration.sql
      
All migrations have been successfully applied.
┌─────────────────────────────────────────────────────────┐
│  Update available 4.16.2 -> 5.2.0                       │
│                                                         │
│  This is a major update - please follow the guide at    │
│  https://pris.ly/d/major-version-upgrade                │
│                                                         │
│  Run the following to update                            │
│    npm i --save-dev prisma@latest                       │
│    npm i @prisma/client@latest                          │
└─────────────────────────────────────────────────────────┘
Environment variables loaded from .env
Running seed command `ts-node --require tsconfig-paths/register prisma/seed.ts` ...
Database has been seeded. 🌱

🌱  The seed command has been executed.
```

フォーマットがかかる。
```
> format
> prettier --write . --loglevel warn

[warn] Ignored unknown option --loglevel=warn. Did you mean --log-level?
```

必要なファイルが一通り作られる。
```
.eslintrc.js 63ms
.github/workflows/deploy.yml 74ms
.gitpod.yml 15ms
app/db.server.ts 161ms
app/entry.client.tsx 19ms
app/entry.server.tsx 86ms
app/models/note.server.ts 40ms
app/models/user.server.ts 39ms
app/root.tsx 18ms
app/routes/_index.tsx 42ms
app/routes/healthcheck.tsx 19ms
app/routes/join.tsx 40ms
app/routes/login.tsx 44ms
app/routes/logout.tsx 12ms
app/routes/notes._index.tsx 9ms
app/routes/notes.$noteId.tsx 17ms
app/routes/notes.new.tsx 38ms
app/routes/notes.tsx 22ms
app/session.server.ts 21ms
app/singleton.server.ts 15ms
app/tailwind.css 19ms
app/utils.test.ts 10ms
app/utils.ts 20ms
cypress.config.ts 9ms
cypress/.eslintrc.js 7ms
cypress/e2e/smoke.cy.ts 14ms
cypress/fixtures/example.json 3ms
cypress/support/commands.ts 29ms
cypress/support/create-user.ts 23ms
cypress/support/delete-user.ts 8ms
cypress/support/e2e.ts 5ms
cypress/tsconfig.json 5ms
mocks/index.js 12ms
mocks/README.md 31ms
package-lock.json 308ms
package.json 47ms
postcss.config.js 15ms
prisma/seed.ts 33ms
README.md 118ms
remix.config.js 10ms
remix.env.d.ts 6ms
remix.init/index.js 86ms
remix.init/package-lock.json 16ms
remix.init/package.json 0ms
tailwind.config.ts 12ms
test/setup-test-env.ts 3ms
tsconfig.json 9ms
vitest.config.ts 8ms
Setup is complete. You're now ready to rock and roll 🤘

Start development with `npm run dev `
💿 That's it! `cd` into "/path/to/learn-remix/blog-tutorial" and check the README for development and deploy instructions!
```

devで起動してみる。
```
$ npm run dev

> dev
> remix dev -c "npm run dev:serve"


 💿  remix dev

 info  building...
 info  built (1.7s)

> dev:serve
> binode --require ./mocks -- @remix-run/serve:remix-serve ./build

🔶 Mock server running
Remix App Server started at http://localhost:3000 (http://192.168.11.2:3000)
```

![localhost:3000](localhost_3000_.png)

## 触ってみる

Sign Up → 投稿。

HTTPリクエストの概要がコンソール出力される。

```
GET / 200 - - 67.472 ms
GET /join?_data=routes%2Fjoin 200 - - 7.281 ms
POST /join?_data=routes%2Fjoin 204 - - 162.594 ms
GET /?_data=root 200 - - 6.367 ms
GET /notes?_data=routes%2Fnotes 200 - - 11.772 ms
POST /notes/new?_data=routes%2Fnotes.new 204 - - 25.866 ms
GET /notes/clltiiyb00001sa4y9nzm7c7d?_data=root 200 - - 22.561 ms
GET /notes/clltiiyb00001sa4y9nzm7c7d?_data=routes%2Fnotes 200 - - 19.618 ms
GET /notes/clltiiyb00001sa4y9nzm7c7d?_data=routes%2Fnotes.%24noteId 200 - - 15.107 ms
GET /notes?_data=root 200 - - 31.606 ms
GET /notes?_data=routes%2Fnotes 200 - - 23.030 ms
GET /notes/clltiiyb00001sa4y9nzm7c7d?_data=routes%2Fnotes.%24noteId 200 - - 14.326 ms
GET / 200 - - 41.244 ms

```