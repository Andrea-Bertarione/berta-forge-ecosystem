export interface loginUserData {
    email: string,
    password: string
}

export interface registerUserData extends loginUserData{
    name: string,
}