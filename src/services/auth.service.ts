import { database } from "../config/database.config";
import { registerUserData } from "../interfaces/auth.interface";

export const registerUser = async (userData: registerUserData) => {
    const { data, error } = await database.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                name: userData.name
            }
        }
    });

    if (error) { throw new Error(`[Service.Auth.Register] database sign up error: ${error.message}`)}

    return data;
}