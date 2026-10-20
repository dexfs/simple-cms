import {Link} from "react-router";

export default function AuthBrand() {
    return (
        <section className="hidden flex-col justify-between bg-indigo-600 p-12 text-indigo-50 lg:flex">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
                <span className="grid size-9 place-items-center rounded-lg bg-white text-indigo-600">M</span>
                MiniShop
            </Link>
            <div>
                <h1 className="text-3xl font-bold leading-tight text-white">Sign in to finish your order.</h1>
                <p className="mt-3 max-w-sm text-indigo-100">Your cart is kept while you log in.</p>
            </div>
            <p className="text-sm text-indigo-200">Test account: eve.holt@reqres.in / cityslicka</p>
        </section>
    )
}