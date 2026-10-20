import {createContext, useContext, useState} from "react";

type AuthContextValues = {
    user: {email: string} | null,
    token: string | null,
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextValues | null>(null)


/**
 * curl -X POST https://reqres.in/api/login \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"eve.holt@reqres.in","password":"cityslicka"}'
 *
 * Error (returns 400 with {"error":"Missing password"}):
 *
 * curl -X POST https://reqres.in/api/login \
 *   -H "Content-Type: application/json" \
 *   -d '{"email":"eve.holt@reqres.in"}'
 */
function makeLoginRequest(payload: {email: string, password: string}) {
    return fetch('https://reqres.in/api/login', {
        headers: {"Content-Type": 'application/json'},
        method: "POST",
        body: JSON.stringify(payload)
    })
}

export function AuthProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<{email: string} | null>(null)
    const [token, setToken] = useState<string | null>(null)

    async function login(email: string, password: string) {
        const response = await makeLoginRequest({email, password})
        const data: {token?: string, error?: string} = await response.json()
        if (!response.ok || !data.token) {
            throw new Error(data.error ?? "Login failed!")
        }

        const newUser = { email }
        const newToken = data.token
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





