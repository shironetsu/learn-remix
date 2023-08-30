import type { ActionArgs } from "@remix-run/node"; // or cloudflare/deno
import {json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Form, useActionData, useNavigation } from "@remix-run/react";
import invariant from "tiny-invariant";

import { ProjectView } from "~/components/project";
import { createProject } from "~/models/project.server";

export const action = async ({ request }: ActionArgs) => {
  await new Promise((res) => setTimeout(res, 3000));
  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  invariant(typeof title === "string", "title must be a string");
  invariant(typeof description === "string", "description must be a string");
  const newProject = { title, description };

  try{
    const rand = Math.random()
    if(rand < 0.5){
        throw new Error("💥 Something went wrong!");
    }

    const project = await createProject(newProject);
    return redirect(`/projects/${project.id}`);
  } catch(error: unknown){
    console.error(error)
    return json("Sorry, we couldn't create the project", {
        status: 500
    })
  }
};

export default function NewProject() {
  const navigation = useNavigation();
  const error = useActionData<typeof action>();

  if (navigation.formData) {
    const title = navigation.formData.get("title") as string;
    const description = navigation.formData.get("description") as string;
    const project = {
      title,
      description,
      tasks: [],
    };
    return <ProjectView project={project} />;
  } else {
    return (
      <main className="flex flex-col justify-center items-center w-full">
        <h1 className="my-2">New Project</h1>
        <Form method="post">
          <div className="flex flex-col justify-center items-center">
            <label htmlFor="title">
              Title:{" "}
              <input
                id="title"
                name="title"
                type="text"
                className="border border-gray-500 rounded"
                required
              />
            </label>
            <label htmlFor="description">Description:</label>
            <textarea
              className="border border-gray-500 rounded w-full"
              name="description"
              id="description"
            />
            {/* <button type="submit" disabled={navigation.state === "submitting"}>
            {navigation.state === "submitting"
              ? "Creating project..."
              : "Create Project"}
          </button> */}
            <button
              className="border bg-blue-600 text-gray-100 rounded p-2 mt-4"
              type="submit"
            >
              Create Project
            </button>
          </div>
        </Form>
        {error ? <p>{error}</p> : null}
      </main>
    );
  }
}
