export interface Member {
  id: number;
  documentNumber: string;
  documentType: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F" | "O";
  birthDate: string;
  phone: string;
  role: "usuario" | "lider_colonia" | "admin";
  colonyId: number;
}
