type Props = {
    project: {
        title: string,
        description: string,
        tasks: {
            id: string,
            name: string,
        }[]
    }
}

export function ProjectView({ project }:  Props) {
  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
      <ul>
        {project.tasks.map((task) => (
          <li key={task.id}>{task.name}</li>
        ))}
      </ul>
    </div>
  );
}
