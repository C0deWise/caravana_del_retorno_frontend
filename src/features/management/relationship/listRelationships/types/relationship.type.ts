import { UserData } from "@/shared/types/user/user.types";

export interface RelationshipData {
    codigo?: string;
    userId: string;
    relatedUserId: string;
    relationshipType: string;
    status: string;
}

export type User = Pick<
    UserData,
    | 'codigo'
    | 'nombre'
    | 'apellido'
>;

export interface RelationshipItem {
    codigo?: string;
    user: User;
    relatedUser: User;
    relationshipType: string;
    status: string;
}

export interface RelationshipResponse<TData = unknown> {
    success: boolean;
    message: string;
    data?: TData;
}