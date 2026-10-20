import {Outlet} from "react-router";
import AuthBrand from "./AuthBrand.tsx";

export default function AuthLayout() {
    return (
        <main className="grid min-h-screen lg:grid-cols-2">
            <AuthBrand/>
            <section className="flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm">
                    <Outlet/>
                </div>
            </section>
        </main>
    )
}