import { User } from "./user.types";

export interface Request {
    requestId: number;
    user: User;
    colonyId: number;
    requestStatus: "pendiente" | "aceptado" | "rechazado" | "expirado" | string;
    createdAt: string;
}