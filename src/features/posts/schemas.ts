import {z} from "zod";

export const PostSchema = z.object({
    id: z.number(),
    title: z.string(),
    body: z.string(),
    userId: z.number()
})

export const PostListSchema = z.object({
    posts: z.array(PostSchema),
    total: z.number(),
    skip: z.number(),
    limit: z.number(),
})


export const PostFormSchema =z.object({
    title: z.string().min(5, 'Title must have at least 5 characters.')
        .max(100, 'Title must have at max 100 characters.'),
    body: z.string().max(255)
})

export type Post = z.infer<typeof PostSchema>
export type PostList = z.infer<typeof PostListSchema>
export type PostFormValues = z.infer<typeof PostFormSchema>