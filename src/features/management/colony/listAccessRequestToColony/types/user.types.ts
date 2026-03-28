import { UserData } from "@/shared/types/user/user.types";

export type User = Pick<
UserData,
   "codigo" 
 | "nombre" 
 | "apellido" 
 | "celular"
 >;