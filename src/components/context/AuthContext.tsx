import {createContext, useContext, useState} from "react";

type AuthContextValues = {
    user: {email: string} | null,
    token: string | null,
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextValues | null>(null)

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))


export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<{email: string}| null>(null)
    const [token, setToken] = useState<string | null>(null)

    async function login(email: string, password: string) {
        await wait(1000)
        if (email !== "eve.holt@reqres.in" || password !== "cityslicka") {
            throw new Error("Invalid email or password.");   // failure = throw
        }
        const newUser = { email }
        const newToken = "fake-token"
        const tokenInfo = {token: newToken, user: newUser}
        setUser(newUser)
        setToken(newToken)
        localStorage.setItem('auth', JSON.stringify(tokenInfo))
    }

    function logout() {
        setToken(null)
        setUser(null)
        localStorage.removeItem('auth')
    }

    return (
        <AuthContext.Provider value={{
            login, logout, user, token
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }

    return context
}





