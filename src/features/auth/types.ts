export interface User {
    email: string
}

export type AuthContextValue = {
    token: string | null;
    user: User | null;
    loading: boolean;
};