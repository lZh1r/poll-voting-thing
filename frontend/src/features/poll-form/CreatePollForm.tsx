import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { pollCreateSchema } from "@/entities/poll/model"
import type { PollOptionDraft } from "@/entities/poll/model"
import { usePolls } from "@/entities/poll/context"
import { useAction } from "@/shared/lib/useAction"
import { useValidation } from "@/shared/lib/useValidation"
import { Button } from "@/shared/ui/button"
import { Feedback } from "@/shared/ui/Feedback"
import { FormField } from "@/shared/ui/FormField"
import { Input } from "@/shared/ui/input"
import { Separator } from "@/shared/ui/separator"
import { Textarea } from "@/shared/ui/textarea"
import { OptionsFields } from "./OptionsFields"

export function CreatePollForm() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [options, setOptions] = useState<PollOptionDraft[]>(() => [
        { id: crypto.randomUUID(), text: "" }, { id: crypto.randomUUID(), text: "" },
    ])
    const { errors, validate, clearError, inputProps } = useValidation()
    const { run, pending, error } = useAction()
    const { createPoll } = usePolls()
    const navigate = useNavigate()

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = validate(pollCreateSchema, { title, description, options: options.map(option => option.text) })
        if (!data) return
        const result = await run(() => createPoll(data))
        if (result.ok) void navigate(`/polls/${result.value.id}`, { state: { created: true } })
    }

    return (
        <form noValidate onSubmit={submit}>
            <fieldset className="space-y-6" disabled={pending}>
                <FormField id="poll-title" label="Название опроса" error={errors.title}>
                    <Input id="poll-title" value={title} maxLength={160} placeholder="Например: Как?" onChange={event => { setTitle(event.target.value); clearError("title") }} {...inputProps("title", "poll-title")} />
                </FormField>
                <FormField id="poll-description" label={<>Описание <span className="font-normal text-muted-foreground">(необязательно)</span></>} error={errors.description}>
                    <Textarea id="poll-description" value={description} rows={3} maxLength={500} placeholder="Добавьте немного контекста для участников" onChange={event => { setDescription(event.target.value); clearError("description") }} {...inputProps("description", "poll-description")} />
                </FormField>
                <OptionsFields prefix="create-option" options={options} errors={errors} onChange={next => { setOptions(next); clearError("options") }} />
                <Feedback message={error} />
                <Separator />
                <div className="flex flex-wrap gap-3">
                    <Button type="submit">{pending ? "Создаём опрос…" : "Создать опрос"}</Button>
                    <Button nativeButton={false} variant="outline" render={<Link to="/polls" />}>Отмена</Button>
                </div>
            </fieldset>
        </form>
    )
}
