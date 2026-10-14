import { useState } from "react"
import type { FormEvent } from "react"
import { Check, LockKeyhole } from "lucide-react"
import { z } from "zod"
import type { Poll } from "@/entities/poll/model"
import { usePolls } from "@/entities/poll/context"
import { useAction } from "@/shared/lib/useAction"
import { useValidation } from "@/shared/lib/useValidation"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Feedback } from "@/shared/ui/Feedback"
import { Label } from "@/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"

const voteSchema = z.object({ optionId: z.string().min(1, "Выберите вариант ответа") })

export function VoteForm({ poll }: { poll: Poll }) {
    const [selectedOption, setSelectedOption] = useState("")
    const [submitted, setSubmitted] = useState(false)
    const { errors, validate, clearError, inputProps } = useValidation()
    const { run, pending, error } = useAction()
    const { vote } = usePolls()

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = validate(voteSchema, { optionId: selectedOption })
        if (!data) return
        const result = await run(() => vote(poll.id, data.optionId))
        if (result.ok) setSubmitted(true)
    }

    if (submitted) return (
        <Card role="status" className="p-8 text-center">
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400"><Check className="size-6" /></span>
            <h2 className="mt-4 text-xl font-semibold">Ваш голос учтён</h2>
            <p className="mt-2 text-sm text-muted-foreground">Спасибо за участие!</p>
        </Card>
    )

    if (poll.status !== "active") return (
        <Card className="p-6">
            <h2 className="font-semibold">{poll.status === "paused" ? "Опрос на паузе" : "Опрос завершён"}</h2>
            <p className="text-sm text-muted-foreground">{poll.status === "paused" ? "Организатор временно остановил приём ответов." : "Приём ответов завершён."}</p>
        </Card>
    )

    return (
        <Card>
            <form noValidate onSubmit={submit}>
                <CardHeader>
                    <CardTitle>Ваш ответ</CardTitle>
                    <CardDescription>Выберите один вариант</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-5">
                    <RadioGroup aria-label="Варианты ответа" value={selectedOption} disabled={pending} onValueChange={value => { setSelectedOption(value ?? ""); clearError("optionId") }} {...inputProps("optionId", "vote-option")}>
                        {poll.options.map(option => (
                            <Label key={option.id} htmlFor={`answer-${option.id}`} className={`cursor-pointer rounded-xl border p-4 transition-colors hover:bg-muted/50 ${selectedOption === option.id ? "border-primary bg-primary/5" : ""}`}>
                                <RadioGroupItem id={`answer-${option.id}`} value={option.id} />
                                <span className="min-w-0 break-words text-sm font-medium">{option.text}</span>
                            </Label>
                        ))}
                    </RadioGroup>
                    <Feedback id="vote-option-error" message={errors.optionId} />
                    <Feedback message={error} />
                    <Button type="submit" disabled={pending} className="w-full sm:w-auto">{pending ? "Отправляем…" : "Отправить голос"}</Button>
                    <p className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5 shrink-0" /> Голосование анонимное. Результат увидит организатор.</p>
                </CardContent>
            </form>
        </Card>
    )
}
