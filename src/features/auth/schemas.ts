import * as z from "zod";

export const UserSchema = z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.string(),
    image: z.string(),
})

export const LoginResponseSchema = UserSchema.extend({
    accessToken: z.string().min(1),
})

export const StoredAuthSchema = z.object({
    user: UserSchema,
    token: z.string().min(1)
})
export const LoginFormSchema  = z.object({
    username: z.string().trim().min(1, 'username is required'),
    password: z.string().trim().min(1, 'password is required')
})

export type StoredAuthValues = z.infer<typeof StoredAuthSchema>
export type LoginFormValues = z.infer<typeof LoginFormSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type User = z.infer<typeof UserSchema>
