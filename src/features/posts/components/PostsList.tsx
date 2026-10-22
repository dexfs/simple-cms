import type {Post, PostList} from "../schemas.ts";

function PostItem({post}: { post: Post }) {
    return (
        <li className="rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span>by Leanne Graham</span>
                <span>4 comments</span>
            </div>
            <h3 className="mt-2 font-semibold capitalize">{post.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.body}</p>
        </li>
    )
}

export default function PostsList({posts}: { posts: PostList }) {
    return (
        <ul className="space-y-3">
            {/*<PostItem /> : just created (highlight)*/}
            <li className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span
                                        className="rounded bg-indigo-600 px-1.5 py-0.5 font-semibold text-white">New</span>
                    <span>by Eve Holt</span>
                </div>
                <h3 className="mt-2 font-semibold">My first post from the form</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">This post was sent via POST and
                    added to the list without reloading the page.</p>
            </li>
            {/*<PostItem />*/}
            {posts.posts.map(p => <PostItem post={p} key={p.id}/>)}
        </ul>
    )
}