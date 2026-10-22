import {usePost} from "../context/PostContext.tsx";
import PostLoading from "../components/PostLoading.tsx";
import PostTryAgain from "../components/PostTryAgain.tsx";
import PostEmpty from "../components/PostEmpty.tsx";
import PostsList from "../components/PostsList.tsx";

function PostContent() {
    const {posts, loading, error} = usePost()
    if (loading) return <PostLoading />
    if (error) return <PostTryAgain />
    if (posts.posts.length ===0) return <PostEmpty />
    return <PostsList posts={posts} />
}

export default function PostPage() {

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
                    <p className="mt-1 text-sm text-slate-600">Data from JSONPlaceholder. New posts are added to the
                        local list.</p>
                </div>
                <span
                    className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700">100 posts</span>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">

                {/*<CreatePostForm />*/}
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <form className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                          noValidate>
                        <h2 className="font-semibold">New post</h2>

                        <div>
                            <label htmlFor="title"
                                   className="block text-sm font-medium text-slate-700">Title</label>
                            <input id="title" type="text" value="Hi" aria-invalid="true"
                                   aria-describedby="title-error"
                                   className="mt-1.5 block w-full rounded-lg border border-red-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"/>
                            <div className="mt-1.5 flex justify-between text-xs">
                                <p id="title-error" className="text-red-600">Title must have at least 5
                                    characters.</p>
                                <span className="text-slate-400">2/100</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="body" className="block text-sm font-medium text-slate-700">Body</label>
                            <textarea id="body" rows={5} placeholder="Write something…"
                                      className="mt-1.5 block w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"></textarea>
                        </div>

                        <div className="flex items-center gap-3">
                            <button type="submit"
                                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
                                Publish
                            </button>
                            <button type="reset"
                                    className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100">Clear
                            </button>
                        </div>

                        {/*Success feedback after POST*/}
                        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
                           role="status">Post published.</p>
                    </form>
                </aside>

                {/*<PostList /> */}
                <section aria-labelledby="list-title">
                    <h2 id="list-title" className="sr-only">Post list</h2>
                    <PostContent />
                </section>
            </div>
        </main>
    )

}