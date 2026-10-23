import {usePost} from "../context/PostContext.tsx";
import PostLoading from "../components/PostLoading.tsx";
import PostTryAgain from "../components/PostTryAgain.tsx";
import PostEmpty from "../components/PostEmpty.tsx";
import PostsList from "../components/PostsList.tsx";
import PostFormCreate from "../components/PostFormCreate.tsx";

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
                <PostFormCreate />

                {/*<PostList /> */}
                <section aria-labelledby="list-title">
                    <h2 id="list-title" className="sr-only">Post list</h2>
                    <PostContent />
                </section>
            </div>
        </main>
    )

}