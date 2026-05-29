import { KinshipType } from "../../types/relationship.type";

export interface RequestRelationshipDto {
  codigo_solicitante: number;
  codigo_destinatario: number;
  tipo_parentesco: KinshipType;
}
