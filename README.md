# Remix を学ぶ

Next.js の App Router や Server Actions の思想の源流があるのを察知したため…。

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

## ルーティング

`app/routes/_index.tsx` に

```tsx
<div className="mx-auto mt-16 max-w-7xl text-center">
  <Link
    to="/posts"
    className="text-xl text-blue-600 underline"
  >
    Blog Posts
  </Link>
</div>
```

を追加する。Remix にも専用のリンクコンポーネントがあって、

```ts
import { Link } from "@remix-run/react";
```

と、`@remix-run/react` に入っている。HTML上では `<a>` タグとして描画される。

ドキュメント上での記載はここ: https://remix.run/docs/en/1.19.3/components/link

`/posts` に対応するコンポーネントを作るために、`app/routes/posts._index.tsx` を作る。

この時点では `/posts` へ遷移してもデバッグ用エラーが出る。

```tsx
export default function Posts() {
  return (
    <main>
      <h1>Posts</h1>
    </main>
  );
}
```

を追加して、戻る→進む　しても変わらない（＝キャッシュが効いている）。
リロードすると反映。

## Loading Data

"Fetching Data" ではないのが肝か？ Remixにおいては「fetchしなくても良い」と訴えている。
APIをはやしてコンポーネントにfetchさせるという常套手段を使わなくて良い。

> In Remix your frontend component is also its own API route, and it already knows how to talk to itself on the server from the browser.

らしい。

"progressive enhancement" って結局何なんだ？

→ MDN に説明がある。

[Progressive Enhancement \- MDN Web Docs Glossary: Definitions of Web\-related terms \| MDN](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement)

全然最近できた言葉ではなかった。2003年。

[Progressive enhancement \- Wikipedia](https://en.wikipedia.org/wiki/Progressive_enhancement)

`app/routes/posts._index.tsx` ファイル内に `loader` async 関数を追加する。

## A little refactoring

`models` にデータ取得用の非同期関数を定義。

`app/models/post.server.ts`

この `.server.` は何か実行上の動作を持つ？

## Pulling from a data source

Prisma で `Posts` スキーマの定義。

`prisma migrate dev` について、

> Let's generate a migration file for our schema changes, which will be required if you deploy your application rather than just running in dev mode locally.

と、

- マイグレーションファイルそれ自体はデプロイ用のものであること
- ローカル開発環境では即時反映されること

が書かれていて親切。

全然関係ないが、ターミナルのウィンドウを小さくしすぎてコミットの署名に失敗した。

```
error: gpg failed to sign the data
fatal: failed to write commit object
```

## Dynamic Route Params

動的ルーティング。Remixは `posts.$slug.tsx` というスタイル。

これが`/posts/[slug]/` というURLに変換される。

```ts
import type { LoaderArgs } from "@remix-run/node";

export const loader = async ({ params }: LoaderArgs) => {
  return json({ slug: params.slug });
};
```

`LoaderArgs` という型があるが、

```ts
export interface DataFunctionArgs {
    request: Request;
    context: AppLoadContext;
    params: Params;
}
export type LoaderArgs = DataFunctionArgs;
```

という固定値。SvelteKitは動的に生成してくれたりするが、そこまで面倒は見てくれない。

> Let's make TypeScript happy with our code:

このフレーズ覚えておこう…。

[tiny-invariant](https://github.com/alexreardon/tiny-invariant) ライブラリでアサーションを行う。`invariant` というライブラリがあり、その軽量版。

アサーションが失敗するとエラーがそのまま投げられるので500エラーになる。

http://localhost:3000/posts/non-existent-article
```
Error: Invariant failed: Post not found: non-existent-article
```


Markdownパーサーに[marked](https://www.npmjs.com/package/marked)を使う。サニタイズなしなので注意。

コンソールにメッセージが出る。

```
 warn  esm-only package: marked
┃ marked is possibly an ESM-only package.
┃ To bundle it with your server, include it in `serverDependenciesToBundle`
┃ -> https://remix.run/docs/en/main/file-conventions/remix-config#serverdependenciestobundle
┗
```

`remix.config.js` の `serverDependenciesToBundle` にパッケージ名（のパターン）が書かれた場合、
サーバー側でのバンドルにマッチするパッケージを含めることができるらしい（？）。

## Nested Routing

`blog-tutorial/app/routes/posts._index.tsx` 内から `<Link>` コンポーネントで `to="admin"` とリンクを張ると、
`/posts/admin` への相対リンクになる。

## Index Routes

なんだこれは...。

`posts.admin.tsx` ← こっちに `<Outlet>` というのを埋め込んでやると...

`posts.admin._index.tsx` ← これが埋め込まれる。Next.js の layout に通ずる。

https://reactrouter.com/en/6.15.0/components/outlet

もし `posts.admin._index.tsx` がなければ、`posts.admin.tsx` がそのまま `/posts/admin` に対応するページとして描画される。

## Actions

> If you've been doing a lot of `<form onSubmit>` and `<button onClick>` you're about to have your mind blown by HTML.

完全にこれ。

`action` という関数を default export すると、フォームを処理する関数になる。

バリデーションエラーを返すと `useActionData` という hook からコンポーネント内で利用できる。

## Progressive Enhancement

`action` に
```ts
  await new Promise((res) => setTimeout(res, 1000));
```
を足して、故意にレスポンスを悪化させる。

JavaScript なしでも機能することを保証して、あくまでもより良い体験を提供するためにJSを利用するというスタンス。

## Homework

### Update/Delete

404 になっている `http://localhost:3000/posts/admin/my-first-post` 等を表示できるようにするため、  `posts.admin.$slug.tsx` を独力で作ってみる。

投稿済みポストのデータの取得に `loader` 、データの更新に `action` と両方がいる。
`loader` は `posts.$slug.tsx` から拝借する。~うーん、どこに置けばいいんだろう。とりあえずコピペ。~
Markdownのパースをしなくて良いため共通化は避ける。

非制御コンポーネントなので `defaultValue` に入れた値が再描画で変わらない。`key` で強制更新できることは分かっているが、これって本当にベストな方法なのだろうか。

https://github.com/facebook/react/issues/4101

更新機能はとりあえずできた。削除機能はどうしよう。

form内に2つのボタンを置くので `formaction` + API エンドポイントか…と思ったが "Routes Are There Own API" の思想に沿わない。

https://remix.run/docs/en/1.19.3/guides/api-routes#routes-are-their-own-api

`<button>` に `name` + `value` を持たせて、押したボタンに応じてサーバー側の動作を切り替える方法で実現。

ただ、本来削除動作にはid（今の場合 `slug`）だけ指定すれば良いので、`FormData` 丸ごとを送信するのはごくわずかだが無駄がある。メソッドを `DELETE` にできないのも若干気になる。

### Optimistic UI
楽観的UI。

https://remix.run/docs/en/main/guides/optimistic-ui

```tsx
export default function Page(){
  const navigation = useNavigation()
  const { formData } = navigation

  if(formData){
    // 送信と同時に `formData` に値が入るので、そのデータを元にして「更新に成功した場合のコンポーネント」を描画。
    return <OnSuccessComponent />
  } else {
    return <MyForm />
  }
}
```

楽観的更新を行った時点ではナビゲーションが発生しない。
`action` が成功した場合に、レスポンスを受け取ると画面の切り替わりなしにlocationが変わる。

失敗した場合には元の画面に戻る。

当然ながらクライアント側でJSを使うので、無効にすると動かない。

これを踏まえて実装する。

`/posts/admin/new` のフォームの送信が成功した場合、`/posts/admin` に飛ぶことになっている。
楽観的更新としては、`/posts/admin` っぽい画面が見えて、`/posts/admin/*` の画面左に共通であるリンクが増えていれば良い。

問題は `posts.admin.tsx` (レイアウト相当)の `loader` がこのデータを持っていること。
`posts.admin.new.tsx` からこのデータにアクセスするには?

→ `useOutletContext` が使えそう。

https://reactrouter.com/en/6.15.0/hooks/use-outlet-context

親（レイアウト）側で `<Outlet context={/* loaderの返り値など */}>` でデータを渡してやると、
子側でコンテキストとしてデータを読み取れる。親側のデータを子側から変える場合、`setState` をコンテキストを通じて渡す。
エレガントさが失われてきた。