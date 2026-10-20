import {useAuth} from "./context/AuthContext.tsx";
import {Navigate, Outlet, useLocation} from "react-router";

export default function GuestOnlyRoute() {
    const auth = useAuth()
    const location = useLocation()

    const from = location.state?.from
    const target = typeof from?.pathname === 'string' ? from : "/posts"

    if (auth.token) return <Navigate to={target} replace />

    return <Outlet />
}