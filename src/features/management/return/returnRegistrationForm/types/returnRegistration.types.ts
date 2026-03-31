export type ReturnRegistrationAnswer = "si" | "no";

export interface ReturnRegistrationApi {
    id: number;
    user_code: number;
    return_code: number;
    accomodation: ReturnRegistrationAnswer;
    transport: ReturnRegistrationAnswer;
    people_in_charge: number;
}

export type ReturnRegistrationItem = Omit<ReturnRegistrationApi, "id" | "user_code" | "return_code">;