import { z } from "zod"

export const pollStatusSchema = z.enum(["active", "paused", "finished"])
const optionTextSchema = z.string().trim().min(1, "Введите вариант ответа").max(160, "Не более 160 символов")

export const optionsSchema = z.array(optionTextSchema)
    .min(2, "Добавьте хотя бы два варианта ответа")
    .max(100, "Можно добавить не более 100 вариантов")
    .superRefine((options, context) => {
        const seen = new Set<string>()
        options.forEach((option, index) => {
            const normalized = option.toLowerCase()
            if (seen.has(normalized)) {
                context.addIssue({ code: "custom", path: [index], message: "Такой вариант ответа уже есть" })
            }
            seen.add(normalized)
        })
    })

export const pollCreateSchema = z.object({
    title: z.string().trim().min(1, "Введите название опроса").max(160, "Не более 160 символов"),
    description: z.string().trim().max(500, "Не более 500 символов"),
    options: optionsSchema,
})

const pollOptionSchema = z.object({
    id: z.string().min(1),
    text: optionTextSchema,
    votes: z.number().int().nonnegative(),
})

export const pollSchema = z.object({
    id: z.string().min(1),
    title: pollCreateSchema.shape.title,
    description: pollCreateSchema.shape.description,
    status: pollStatusSchema,
    totalVotes: z.number().int().nonnegative(),
    options: z.array(pollOptionSchema).min(2).max(100),
    createdAt: z.iso.datetime(),
})

export type PollStatus = z.infer<typeof pollStatusSchema>
export type Poll = z.infer<typeof pollSchema>
export type PollOption = z.infer<typeof pollOptionSchema>
export type PollOptionDraft = Pick<PollOption, "id" | "text">
export type PollCreate = z.infer<typeof pollCreateSchema>
