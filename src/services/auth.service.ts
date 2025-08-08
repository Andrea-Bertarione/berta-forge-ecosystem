import { database } from "../config/database.config";
import { loginUserData, registerUserData } from "../interfaces/auth.interface";

export const validateToken = async (token: string) => {
    const { data: { user }, error } = await database.auth.getUser(token);
    if (error || !user) {
      throw new Error("Invalid or expired token");
    }
    return user;
}

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
    if (data.user && data.user.identities && data.user.identities.length === 0) {
        throw new Error(`[Service.Auth.Register] Email already registered. Please login or reset your password.`);
    }

    return data;
}

export const validateUser = async (userData: loginUserData) => {
    const { data, error } = await database.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
    });

    if (error) { throw new Error(`[Service.Auth.Login] database sign in error: ${error.message}`)}

    return data;
}

export const refreshToken = async () => {
    const { data, error } = await database.auth.refreshSession();

    if (error) { throw new Error(`[Service.Auth.Refresh] database sign in error: ${error.message}`)}

    return data;
}

export const logoutUser = async () => {
    const { error } = await database.auth.signOut();

    if (error) { throw new Error(`[Service.Auth.Logout] database sign out error: ${error.message}`) }
}

/* In case i ever need to a function that handles verifications
// Should be handled like:
// Press Email confirmation link -> redirected to website based on service being handled -> fetch api/auth/verify
export const verifyEmail = async (token: string) => {
    if (!token) { throw new Error("[Service.Auth.Verify] Verification token is missing.");}

    const { data: user, error } = await database.auth.getUser(token);

    if (error || !user) { throw new Error("[Service.Auth.Verify] Invalid or expired confirmation token");}

    return user;
}
*/