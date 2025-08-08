import { UserAppMetadata, UserIdentity, UserResponse } from "@supabase/supabase-js";
import { database } from "../config/database.config";

import { InviteCreationData, ProjectCreationData } from "../interfaces/projects.interface";
import { randomUUID } from "crypto";

export const createProject = async (projectData: ProjectCreationData) => {
    const { error } = await database.from("projects").insert(projectData);

    if (error) {
        throw new Error(`[Service.Projects.New] couldn't create project details: ${error.message}`);
    }
}

export const listProjects = async (userData: any) => {
    const { data, error } = await database
        .from("projects")
        .select("*")
        .or(
            `owner.eq.${userData.id},collaborators->${userData.id}.not.is.null`
    );

    if (error) {
        throw new Error(`[Service.Projects.List] couldn't retrieve projects details: ${error.message}`);
    }

    return data;
}

export const generateInvite = async (userToken: string ,inviteData: InviteCreationData) => {
    const newUUID = randomUUID();
    inviteData.id = newUUID;

    const acceptLink = `/api/projects/accept?invite=${newUUID}`;
    const refuseLink = `/api/projects/refuse?invite=${newUUID}`;

    if (inviteData.type == "link") {
        inviteData.link = acceptLink;
    }
    else {
        const projectsResult = await database.from("projects").select().eq("id", inviteData.project);

        if (projectsResult.error || ! projectsResult.data[0]) {
            throw new Error(`[Service.Projects.Invite] couldn't find project associeted with invite, details: ${projectsResult.error?.message}`);
        }

        const notificationData = {
            name: projectsResult.data[0].name,
            description: "You've been invited to work in a new project press down here to accept or refuse",
            attachments: {
                acceptButton: { text: "Accept", link: acceptLink },
                refuseButton: { text: "Accept", link: refuseLink },
            },
            target: inviteData.target,
            author: (await database.auth.getUser(userToken)).data.user?.user_metadata.name

        }

        const { error } = await database.from("notifications").insert(notificationData);
        
        if (error) {
            throw new Error(`[Service.Projects.Invite] couldn't send notification and create a new invite, details: ${error.message}`);
        }
    }

    const { error } = await database.from("invites").insert(inviteData);

    if (error) {
        throw new Error(`[Service.Projects.Invite] couldn't create a new invite, details: ${error.message}`);
    }

    return inviteData;
}