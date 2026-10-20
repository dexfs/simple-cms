import {useAuth} from "./context/AuthContext.tsx";
import {Navigate, Outlet, useLocation} from "react-router";

export default function ProtectedRoute() {
    const auth = useAuth()
    const location = useLocation()

    if (!auth.token) return <Navigate to='/login' replace state={{from: location}}/>
    return <Outlet />
}