import type { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"

export type Project = {
    title: string,
    description: string,
    tasks: {
        id: string,
        name: string
    }[]
}

export async function findProject(id: string){
    const project = await prisma.project.findUnique({
        where: {
            id,
        },
        select: {
            title: true,
            description: true,
            tasks: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    })
    return {
        project
    }
}

export async function createProject(data: Pick<Prisma.ProjectCreateInput, 'title' | 'description'>){
    return prisma.project.create({
        data
    })
}