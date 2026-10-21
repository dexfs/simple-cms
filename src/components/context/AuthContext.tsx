import {createContext, useContext, useEffect, useState} from "react";
import {request} from "../../lib/http.ts";

type AuthContextValues = {
    user: User | null,
    token: string | null,
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextValues | null>(null)


type StoredAuthValues = {
    user: User,
    token: string
}

type User = {
    id: number,
    username: string
    email: string,
    firstName: string
    lastName: string
    gender: string
    image: string
}

type LoginResponse = User & {
    accessToken: string
    refreshToken: string
}

async function makeLoginRequest(payload: {username: string, password: string}) {
    return request<LoginResponse>('/auth/login', {
        method: "POST",
        body: payload
    })
}

function readStoredAuth(): StoredAuthValues | null  {
    const stored = localStorage.getItem('auth')
    if (!stored) return null

    try {
        const info = JSON.parse(stored)
        const isInvalidInfo = typeof info?.token !== 'string' || typeof info?.user.email !== 'string' || typeof info?.user.firstName !== 'string'
        if (isInvalidInfo) {
            localStorage.removeItem('auth')
            return null
        }
        return info
    } catch {
        localStorage.removeItem('auth')
        return null
    }
}

function LoadingPage() {
    return (
        <div role="status" className="flex flex-col items-center mt-6">
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="size-8 animate-[spin_0.8s_linear_infinite] fill-blue-600" viewBox="0 0 24 24"
                 aria-hidden="true">
                <path
                    d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
                    data-original="#000000"/>
            </svg>
            <span className="sr-only">Loading…</span>
        </div>
    )
}

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const data = readStoredAuth()
        if (data) {
            setToken(data.token)
            setUser(data.user)
        }
        setLoading(false)
    }, []);

    async function login(username: string, password: string) {
        const authData: LoginResponse = await makeLoginRequest({username, password})
        if (!authData.accessToken) {
            throw new Error("Login failed!")
        }

        const {accessToken, refreshToken: _, ...user} = authData
        const newToken = accessToken

        setUser(user)
        setToken(newToken)
        localStorage.setItem('auth', JSON.stringify({token: newToken, user}))
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
            {loading ? <LoadingPage /> : children }
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





