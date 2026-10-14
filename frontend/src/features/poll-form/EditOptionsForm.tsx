import { useState } from "react"
import type { FormEvent } from "react"
import { Save } from "lucide-react"
import { z } from "zod"
import { optionsSchema } from "@/entities/poll/model"
import type { Poll, PollOptionDraft } from "@/entities/poll/model"
import { usePolls } from "@/entities/poll/context"
import { useAction } from "@/shared/lib/useAction"
import { useValidation } from "@/shared/lib/useValidation"
import { Button } from "@/shared/ui/button"
import { Feedback } from "@/shared/ui/Feedback"
import { OptionsFields } from "./OptionsFields"

const updateOptionsSchema = z.object({ options: optionsSchema })

export function EditOptionsForm({ poll }: { poll: Poll }) {
    const [options, setOptions] = useState<PollOptionDraft[]>(() => poll.options.map(({ id, text }) => ({ id, text })))
    const [saved, setSaved] = useState(false)
    const { errors, validate, clearError } = useValidation()
    const { run, pending, error } = useAction()
    const { updateOptions } = usePolls()

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSaved(false)
        const data = validate(updateOptionsSchema, { options: options.map(option => option.text) })
        if (!data) return
        const drafts = options.map((option, index) => ({ ...option, text: data.options[index] }))
        const result = await run(() => updateOptions(poll.id, drafts))
        if (result.ok) {
            setOptions(result.value.options.map(({ id, text }) => ({ id, text })))
            setSaved(true)
        }
    }

    return (
        <form noValidate onSubmit={submit} className="space-y-4">
            <OptionsFields prefix="edit-option" options={options} errors={errors} disabled={pending} onChange={next => { setOptions(next); clearError("options"); setSaved(false) }} />
            <Feedback message={error} />
            <Feedback kind="success" message={saved ? "Варианты сохранены." : null} />
            <Button type="submit" variant="outline" disabled={pending}><Save /> {pending ? "Сохраняем…" : "Сохранить варианты"}</Button>
        </form>
    )
}
