import { UserSearchResult } from "@/types/user.types";

export type InviteMemberError = 
    | "already_in_group"
    | "already_registered_individually" 
    | "invite_failed";

    export interface InviteMemberValidation {
        user: UserSearchResult;
        error: InviteMemberError | null;
    }

    export interface RemoveMemberRequest {
        grupo_id: number,
        usuario_id: number
    }