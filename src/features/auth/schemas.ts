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
    username: z.string().default(''),
    password: z.string().default('')
})

export type StoredAuthValues = z.infer<typeof StoredAuthSchema>
export type LoginFormValues = z.infer<typeof LoginFormSchema>
export type FormTouchedValues = Partial<Record<keyof LoginFormValues, boolean>>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type User = z.infer<typeof UserSchema>
