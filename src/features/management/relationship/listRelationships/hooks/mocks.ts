import type { RelationshipItem, RelationshipResponse } from '../types/relationship.type';

const MOCK_DELAY = 500;

/**
 * Datos de prueba para listar parentescos.
 * Incluye registros donde `targetUserId` aparece como `userId` y como `relatedUserId`.
 */
export const mockRelationships: RelationshipItem[] = [
	{
		codigo: 'REL-001',
		user: {
			codigo: '1001',
			nombre: 'Juan',
			apellido: 'Pérez',
		},
		relatedUser: {
			codigo: '2001',
			nombre: 'María',
			apellido: 'Gómez',
		},
		relationshipType: 'Hija',
		status: 'pendiente',
	},
	{
		codigo: 'REL-002',
		user: {
			codigo: '1001',
			nombre: 'Juan',
			apellido: 'Pérez',
		},
		relatedUser: {
			codigo: '2002',
			nombre: 'Carlos',
			apellido: 'Rojas',
		},
		relationshipType: 'Hermano',
		status: 'rechazada',
	},
	{
		codigo: 'REL-003',
		user: {
			codigo: '2003',
			nombre: 'Luisa',
			apellido: 'Martínez',
		},
		relatedUser: {
			codigo: '1001',
			nombre: 'Juan',
			apellido: 'Pérez',
		},
		relationshipType: 'Madre',
		status: 'pendiente',
	},
	{
		codigo: 'REL-004',
		user: {
			codigo: '1002',
			nombre: 'Ana',
			apellido: 'Silva',
		},
		relatedUser: {
			codigo: '2004',
			nombre: 'Pedro',
			apellido: 'Ramírez',
		},
		relationshipType: 'Hijo',
		status: 'pendiente',
	},
	{
		codigo: 'REL-005',
		user: {
			codigo: '1003',
			nombre: 'Diego',
			apellido: 'López',
		},
		relatedUser: {
			codigo: '1001',
			nombre: 'Juan',
			apellido: 'Pérez',
		},
		relationshipType: 'Primo',
		status: 'aceptada',
	},
	{
		codigo: 'REL-006',
		user: {
			codigo: '1004',
			nombre: 'Sofía',
			apellido: 'Torres',
		},
		relatedUser: {
			codigo: '2005',
			nombre: 'Miguel',
			apellido: 'Vargas',
		},
		relationshipType: 'Tío',
		status: 'rechazada',
	},
];

/**
 * Simula la llamada de listado de parentescos.
 */
export const mockGetRelationships = async (): Promise<RelationshipResponse<RelationshipItem[]>> => {
	await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

	return {
		success: true,
		message: 'Parentescos cargados correctamente (mock)',
		data: mockRelationships,
	};
};
