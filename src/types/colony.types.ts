export interface ColonyData {
    id: number;
    country: string;
    department: string | null;
    city: string | null;
}

export interface ColonyResponse {
    success: boolean;
    message: string;
    data?: ColonyData | null;
}

export type ColonyItem = Pick<ColonyData, "country" | "department" | "city">;