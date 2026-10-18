import {Outlet} from "react-router";

export default function AuthLayout() {
    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            <Outlet />
        </main>
    )
}