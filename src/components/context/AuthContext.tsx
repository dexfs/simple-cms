import {createContext, useContext, useEffect, useState} from "react";

type AuthContextValues = {
    user: User | null,
    token: string | null,
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}


const AuthContext = createContext<AuthContextValues | null>(null)


type StoredAuthValues = {
    user: User,
    token: string
}

type User = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    avatar: string
}

async function makeLoginRequest(payload: {email: string, password: string}) {
    return fetch('https://reqres.in/api/login', {
        headers: {"Content-Type": 'application/json'},
        method: "POST",
        body: JSON.stringify(payload)
    })
}

async function makeUsersRequest() {
    return fetch('https://reqres.in/api/users?page=1')
}

function findLoggedUserInfo(users: User[], email:string): User | undefined {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function readStoredAuth(): StoredAuthValues | null  {
    const stored = localStorage.getItem('auth')
    if (!stored) return null

    try {
        const info = JSON.parse(stored)
        const isInvalidInfo = typeof info?.token !== 'string' || typeof info.user?.email !== 'string' || typeof info.user?.first_name !== 'string'
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

    async function login(email: string, password: string) {
        const response = await makeLoginRequest({email, password})
        const authData: {token?: string, error?: string} = await response.json()
        if (!response.ok || !authData.token) {
            throw new Error(authData.error ?? "Login failed!")
        }

        const responseUsers = await makeUsersRequest()
        if (!responseUsers.ok) {
            throw new Error( 'Login failed!')
        }

        const usersData: {data: User[]} = await responseUsers.json()
        const newUser = findLoggedUserInfo(usersData.data, email)
        if (!newUser) {
            throw new Error('User not found!')
        }
        const newToken = authData.token
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





