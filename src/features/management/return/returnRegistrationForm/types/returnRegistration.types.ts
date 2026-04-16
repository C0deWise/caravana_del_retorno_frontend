export type ReturnRegistrationAnswer = 0 | 1;

export interface ReturnRegistrationApi {
    id: number;
    user_code: number;
    return_code: number;
    accomodation: ReturnRegistrationAnswer;
    transport: ReturnRegistrationAnswer;
    parking: ReturnRegistrationAnswer;
}

export type ReturnRegistrationItem = Omit<ReturnRegistrationApi, "id" | "user_code" | "return_code">;