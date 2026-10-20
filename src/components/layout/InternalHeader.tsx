import {Link, NavLink} from "react-router";
import {useAuth} from "../context/AuthContext.tsx";

const navLinkClass = ({isActive}: { isActive: boolean }) => isActive ? 'active-page' : 'normal-link'

export function InternalHeader() {
    const auth = useAuth()

    return (
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-semibold">
                    <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white">M</span>
                    MiniShop
                </Link>
                <nav className="hidden gap-6 text-sm font-medium md:flex">
                    <NavLink to="/posts" className={navLinkClass}>Posts</NavLink>
                    <NavLink to="/users" className={navLinkClass}>Users</NavLink>
                </nav>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                        <span
                            className="grid size-8 place-items-center rounded-full bg-slate-200 text-xs font-semibold">{auth?.user?.first_name.slice(0,3).toUpperCase()}</span>
                        <button className="text-sm text-slate-600 hover:text-slate-900"
                                onClick={() => auth.logout()}>Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}