import { UUID } from "crypto"

export interface ProjectCreationData {
    name: string,
    description: string,
    owner: object
}

export type InviteType = "link" | "direct"
export type PermissionType = "read" | "write" 

export interface InvitePermissions {
    endpoints: { name: PermissionType } | null,
    keys: PermissionType | null,
    invites: PermissionType | null
}

export interface InviteCreationData {
    id?: UUID,
    type: InviteType,
    target?: string,
    link?: string,
    expire: Date,
    project: string,
    permisisons: InvitePermissions
}