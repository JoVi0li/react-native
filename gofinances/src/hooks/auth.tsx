import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

import * as Apple from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";

import AsyncStorage from "@react-native-async-storage/async-storage";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    },
    type: string;
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {

    const [user, setUser] = useState<User>({} as User);

    async function signInWithGoogle() {
        try {
            const RESPONSE_TYPE = "token";
            const SCOPE = encodeURI("profile email");
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { params, type } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;

            if (type === "success") {
                const response = await fetch(`https://googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();

                const userLogged = {
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.give_name,
                    photo: userInfo.picture,

                };

                setUser(userLogged);
                await AsyncStorage.setItem("@gofinances:user", JSON.stringify(userLogged));
            }

        } catch (error) {
            throw new Error(String(error));
        }
    }

    async function signInWithApple() {
        try {
            const credential = await Apple.signInAsync({
                requestedScopes: [
                    Apple.AppleAuthenticationScope.FULL_NAME,
                    Apple.AppleAuthenticationScope.EMAIL,
                ]
            });

            if (credential) {
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name: credential.fullName!.givenName!,
                    photo: undefined,
                };

                setUser(userLogged);

                await AsyncStorage.setItem("@gofinances:user", JSON.stringify(userLogged));
            }

        } catch (error) {
            throw new Error(String(error));
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple
        }}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth }