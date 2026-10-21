type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: unknown
    token?: string | null
    signal?: AbortSignal
}

export class HttpError extends Error {
    status: number
    constructor(status: number, message: string) {
        super(message);
        this.name = 'HttpError'
        this.status = status
    }
}

const baseURL = import.meta.env.VITE_API_URL

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const {method = 'GET', body, token, signal} = options
    const url = `${baseURL}${path}`

    const headers:Record<string, string> = {
        'Content-Type': 'application/json'
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal
    })

    const data: any = await response.json().catch(() => null)

    if (!response.ok) {
        throw new HttpError(response.status, data?.message ?? 'Unexpected error.');
    }

    return data as T
}
