import {createContext, useContext, useEffect, useState} from "react";
import {HttpError, request} from "../../../lib/http.ts";
import { PostFormSchema, type PostFormValues, type PostList, PostListSchema, PostSchema} from "../schemas.ts";
import {useAuth} from "../../../components/context/AuthContext.tsx";
import {z} from "zod";

type PostContextValues = {
    posts: PostList
    loading: boolean,
    error: string | null
    reloadPosts: () => void
    addPost: (postData: PostFormValues) => Promise<void>
}

const EMPTY_POST_LIST: PostList = {posts: [], total: 0, skip: 0, limit: 0}
const PostContext = createContext<PostContextValues | null>(null)

const CreatePostSchema = PostFormSchema.extend({
    userId: z.number(),
})

type CreatePostRequestValues = z.infer<typeof CreatePostSchema>

function makeCreatePostRequest(payload: CreatePostRequestValues, token: string) {
    return request<unknown>('/auth/posts/add', {
        token,
        method: "POST",
        body: payload
    })
}



export function PostProvider ({children}: { children: React.ReactNode }) {
    const {token, logout, user} = useAuth()
    const [posts, setPosts] = useState<PostList>(EMPTY_POST_LIST)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [reloadKey, setReloadKey] = useState(0)

    useEffect(() => {
        const controller = new AbortController()
        async function loadPosts() {
            try {
                const postsResponse = await request<unknown>('/auth/posts?limit=5', {
                    token,
                    signal: controller.signal
                })
                if(controller.signal.aborted) return;

                const posts = PostListSchema.parse(postsResponse)
                setPosts(posts)
            }catch (e) {
                if (controller.signal.aborted) return;
                if (e instanceof HttpError && e.status === 401) {
                    logout()
                }  else {
                    setError('Something went wrong. Please try again')
                }
            } finally {
                if(!controller.signal.aborted) setLoading(false);
            }
        }
        loadPosts()

        return () => controller.abort()
    }, [reloadKey, token, logout]);


    async function addPost(postData: PostFormValues) {
        if (!user || !token) throw new Error('no authenticated user');
        const response = await makeCreatePostRequest({...postData, userId: user.id}, token)
        const post = PostSchema.parse(response)
        const newPost = {...post, id: Date.now()}
        setPosts((p) => ({
            ...p,
            posts: [newPost, ...p.posts],
            total: p.total  + 1
        }))
    }

    function reloadPosts() {
        setLoading(true)
        setError(null)
        setReloadKey(prev => prev + 1)
    }

    return (
        <PostContext.Provider value={{
            posts, loading, error, reloadPosts, addPost: addPost
        }}>
            {children}
        </PostContext.Provider>
    )

}


export function usePost() {
    const context = useContext(PostContext)
    if (!context) {
        throw new Error("usePost() must be used within PostProvider")
    }
    return context
}