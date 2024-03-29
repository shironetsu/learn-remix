import { json } from "@remix-run/node";
import {
  Link,
  Outlet,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { useEffect, useState } from "react";

import { getPosts } from "~/models/post.server";

export const loader = async () => {
  return json({ posts: await getPosts() });
};

//🤯
type ContextType = ReturnType<typeof useState<ReturnType<typeof useLoaderData<typeof loader>>['posts']>>;

export default function PostAdmin() {
  const { posts: loaderPosts } = useLoaderData<typeof loader>();
  const [posts, setPosts] = useState<typeof loaderPosts>();
  useEffect(() => {
    setPosts(loaderPosts);
  }, [loaderPosts]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="my-6 mb-2 border-b-2 text-center text-3xl">Blog Admin</h1>
      <div className="grid grid-cols-4 gap-6">
        <nav className="col-span-4 md:col-span-1">
          <ul>
            {(posts ?? loaderPosts).map((post) => (
              <li key={post.slug}>
                <Link to={post.slug} className="text-blue-600 underline">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <main className="col-span-4 md:col-span-3">
          <Outlet context={[posts, setPosts] satisfies ContextType} />
        </main>
      </div>
    </div>
  );
}

export function usePosts() {
  return useOutletContext<ContextType>();
}
