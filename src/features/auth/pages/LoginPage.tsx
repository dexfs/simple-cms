export default function LoginPage() {
    return (
        <>
            {/*Brand side (hidden on mobile)*/}
            <section className="hidden flex-col justify-between bg-indigo-600 p-12 text-indigo-50 lg:flex">
                <a href="index.html" className="flex items-center gap-2 text-lg font-semibold text-white">
                    <span className="grid size-9 place-items-center rounded-lg bg-white text-indigo-600">M</span>
                    MiniShop
                </a>
                <div>
                    <h1 className="text-3xl font-bold leading-tight text-white">Sign in to finish your order.</h1>
                    <p className="mt-3 max-w-sm text-indigo-100">Your cart is kept while you log in.</p>
                </div>
                <p className="text-sm text-indigo-200">Test account: eve.holt@reqres.in / cityslicka</p>
            </section>
            <section className="flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm">
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
                    <p className="mt-1 text-sm text-slate-600">Enter your email and password.</p>
                    <form className="mt-6 space-y-5" noValidate>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                            <input id="email" type="email" autoComplete="email" placeholder="you@example.com"
                                   className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"/>
                        </div>

                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-slate-700">Password</label>
                            <input id="password" type="password" autoComplete="current-password" aria-invalid="true"
                                   aria-describedby="password-error"
                                   className="mt-1.5 block w-full rounded-lg border border-red-400 bg-white px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"/>
                            <p id="password-error" className="mt-1.5 text-xs text-red-600">Password is required.</p>
                        </div>

                        <button type="submit"
                                className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                            Sign in
                        </button>
                    </form>
                </div>
            </section>
        </>
    )
}