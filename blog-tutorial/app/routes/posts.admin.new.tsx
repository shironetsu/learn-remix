import type { ActionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createPost } from "~/models/post.server";
import { usePosts } from "./posts.admin";
import { useEffect } from "react";
import { AdminIndex } from "~/components/admin";

export const action = async ({ request }: ActionArgs) => {
  // TODO: remove me
  await new Promise((res) => setTimeout(res, 3000));
  const formData = await request.formData();

  const title = formData.get("title");
  const slug = formData.get("slug");
  const markdown = formData.get("markdown");

  const errors = {
    title: title ? null : "Title is required",
    slug: slug ? null : "Slug is required",
    markdown: markdown ? null : "Markdown is required",
  };

  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof markdown === "string", "markdown must be a string");

  await createPost({ title, slug, markdown });

  return redirect("/posts/admin");
};

const inputClassName =
  "w-full rounded border border-gray-500 px-2 py-1 text-lg";

export default function NewPost() {
  const errors = useActionData<typeof action>();

  const { state: navigationState, formData } = useNavigation();
  const isCreating = Boolean(navigationState === "submitting");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [posts, setPosts] = usePosts();
  useEffect(()=>{
    if(formData){
      const title = formData.get('title') as string
      const slug = formData.get('slug') as string
      const markdown = formData.get('markdown') as string
      setPosts((prev)=>([
        ...(prev ?? []),
        {
          slug, // slug が重複した時、1.keyエラーが出る->2.actionが失敗する
          title,
          markdown,
        }
      ]))
    }
  }, [formData, setPosts])

  if (formData) {
    return <AdminIndex />
  } else {
    return (
      <Form method="post">
        <p>
          <label>
            Post Title:{" "}
            {errors?.title ? (
              <em className="text-red-600">{errors.title}</em>
            ) : null}
            <input type="text" name="title" className={inputClassName} />
          </label>
        </p>
        <p>
          <label>
            Post Slug:{" "}
            {errors?.slug ? (
              <em className="text-red-600">{errors.slug}</em>
            ) : null}
            <input type="text" name="slug" className={inputClassName} />
          </label>
        </p>
        <p>
          <label htmlFor="markdown">
            Markdown:{" "}
            {errors?.markdown ? (
              <em className="text-red-600">{errors.markdown}</em>
            ) : null}
          </label>
          <br />
          <textarea
            id="markdown"
            rows={20}
            name="markdown"
            className={`${inputClassName} font-mono`}
          />
        </p>
        <p className="text-right">
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400 disabled:bg-blue-300"
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Post"}
          </button>
        </p>
      </Form>
    );
  }
}
