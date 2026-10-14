import { z } from "zod"

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Введите корректный email"))
const passwordSchema = z.string().min(8, "Пароль должен содержать хотя бы 8 символов").max(128, "Не более 128 символов")
    .refine(value => value.trim().length > 0, "Пароль не может состоять только из пробелов")

export const loginSchema = z.object({ email: emailSchema, password: passwordSchema })
export const registrationSchema = loginSchema.extend({
    name: z.string().trim().min(1, "Введите имя").max(160, "Не более 160 символов"),
})

export interface User {
    id: string
    name: string
    email: string
}
