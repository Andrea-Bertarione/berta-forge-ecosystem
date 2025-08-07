import { UserAppMetadata, UserIdentity, UserResponse } from "@supabase/supabase-js";
import { database } from "../config/database.config";

import { ProjectCreationData } from "../interfaces/projects.interface";

export const createProject = async (projectData: ProjectCreationData) => {
    const { error } = await database.from("projects").insert(projectData);

    if (error) {
        throw new Error(`[Service.Projects.New] couldn't create project details: ${error.message}`);
    }
}

export const listProjects = async (userData: any) => {
    const { data, error } = await database.from("projects").select("*").eq("owner", userData.id);

    if (error) {
        throw new Error(`[Service.Projects.List] couldn't retrieve projects details: ${error.message}`);
    }

    return data;
}