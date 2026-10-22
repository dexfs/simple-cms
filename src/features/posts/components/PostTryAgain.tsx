import {usePost} from "../context/PostContext.tsx";

export default function PostTryAgain() {
    const {reloadPosts} = usePost()
    return (
        <div className="flex flex-col items-center rounded-xl border border-red-200 bg-white px-6 py-10 text-center"
             role="alert">
            <span className="grid size-10 place-items-center rounded-full bg-red-100 text-lg text-red-600">!</span>
            <h3 className="mt-3 font-semibold">We couldn't load the posts</h3>
            <p className="mt-1 text-sm text-slate-600">Check your connection and try again.</p>
            <button
                className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
                onClick={reloadPosts}
            >Try
                again
            </button>
        </div>
    )
}