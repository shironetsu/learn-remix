import type { LoaderArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { ProjectView } from "~/components/project";
import { findProject } from "~/models/project.server";

export async function loader({ params }: LoaderArgs) {
  invariant(typeof params.id === "string", "id must be a string");
  const { project } = await findProject(params.id)
  invariant(project !== null, "project must exist");
  return json(project);
}

export default function ProjectRoute() {
  const project = useLoaderData<typeof loader>();
  return <ProjectView project={project} />;
}
