export default function PostLoading() {
    return (
        <>
            <ul className="space-y-3" aria-busy="true" aria-label="Loading posts">
                <li className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
                    <div className="h-3 w-24 rounded bg-slate-200"></div>
                    <div className="mt-3 h-4 w-2/3 rounded bg-slate-200"></div>
                    <div className="mt-2 h-3 w-full rounded bg-slate-100"></div>
                    <div className="mt-1.5 h-3 w-5/6 rounded bg-slate-100"></div>
                </li>
                <li className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
                    <div className="h-3 w-24 rounded bg-slate-200"></div>
                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-200"></div>
                    <div className="mt-2 h-3 w-full rounded bg-slate-100"></div>
                    <div className="mt-1.5 h-3 w-4/6 rounded bg-slate-100"></div>
                </li>
            </ul>
        </>
    )
}