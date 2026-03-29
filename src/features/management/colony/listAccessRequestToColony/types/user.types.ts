import { UserData } from "@/types/user.types";

export type User = Pick<UserData, "id" | "nombre" | "apellido" | "celular">;
