import {createContext, useContext, useEffect, useState} from "react";
import {HttpError, request} from "../../lib/http.ts";
import {
    LoginResponseSchema, StoredAuthSchema,
    type StoredAuthValues,
    type User,
    UserSchema
} from "../../features/auth/schemas.ts";

type AuthContextValues = {
    user: User | null,
    token: string | null,
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValues | null>(null)


async function makeLoginRequest(payload: {username: string, password: string}) {
    return request<unknown>('/auth/login', {
        method: "POST",
        body: payload
    })
}
async function fetchMe(token: string, signal: AbortSignal) {
    return request<unknown>('/auth/me', {
        token, signal
    })
}

function readStoredAuth(): StoredAuthValues | null  {
    const stored = localStorage.getItem('auth')
    if (!stored) return null

    try {
        const info = JSON.parse(stored)
        const result = StoredAuthSchema.safeParse(info)
        if (!result.success) {
            localStorage.removeItem('auth')
            return null
        }
        return result.data
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

const isAborted = (signal: AbortSignal) => signal.aborted

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        async function restore() {
            const data = readStoredAuth()
            try {
                if (!data) {
                    setLoading(false);
                    return;
                }
                const me = await fetchMe(data.token, controller.signal)
                if (isAborted(controller.signal)) return;
                const newUser = UserSchema.parse(me)
                setUser(newUser)
                setToken(data.token)
            } catch (e) {
                if (isAborted(controller.signal)) return;
                if (e instanceof HttpError && e.status === 401) localStorage.removeItem('auth')
                setToken(null)
                setUser(null)
            }
            finally {
                if (!isAborted(controller.signal)) setLoading(false);
            }
        }
        restore()

        return () => controller.abort()
    }, []);

    async function login(username: string, password: string) {
        const loginResponse = await makeLoginRequest({username, password})
        const authData = LoginResponseSchema.parse(loginResponse)

        const newToken = authData.accessToken
        const newUser = UserSchema.parse(authData)

        setUser(newUser)
        setToken(newToken)
        localStorage.setItem('auth', JSON.stringify({token: newToken, user: newUser}))
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
