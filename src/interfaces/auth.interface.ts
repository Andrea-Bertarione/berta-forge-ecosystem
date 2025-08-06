export interface registerUserData {
    name: string,
    email: string,
    password: string
}

export interface registerSuccessResponse {
    message: string,
    data: object | null
}