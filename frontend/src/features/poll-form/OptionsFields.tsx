import { Plus, Trash2 } from "lucide-react"
import type { PollOptionDraft } from "@/entities/poll/model"
import type { FieldErrors } from "@/shared/lib/useValidation"
import { Button } from "@/shared/ui/button"
import { Feedback } from "@/shared/ui/Feedback"
import { FormField } from "@/shared/ui/FormField"
import { Input } from "@/shared/ui/input"

interface OptionsFieldsProps {
    options: PollOptionDraft[]
    onChange: (options: PollOptionDraft[]) => void
    errors: FieldErrors
    disabled?: boolean
    prefix: string
}

export function OptionsFields({ options, onChange, errors, disabled = false, prefix }: OptionsFieldsProps) {
    return (
        <fieldset className="space-y-3" disabled={disabled}>
            <legend className="mb-3 text-sm font-medium">Варианты ответа</legend>
            {options.map((option, index) => {
                const id = `${prefix}-${option.id}`
                const error = errors[`options.${index}`]
                return (
                    <div key={option.id} className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <FormField id={id} label={`Вариант ${index + 1}`} error={error}>
                                <Input id={id} value={option.text} maxLength={160} placeholder={`Вариант ${index + 1}`} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={event => onChange(options.map(item => item.id === option.id ? { ...item, text: event.target.value } : item))} />
                            </FormField>
                        </div>
                        {options.length > 2 && <Button className="mt-7" type="button" variant="ghost" size="icon" aria-label={`Удалить вариант ${index + 1}`} onClick={() => onChange(options.filter(item => item.id !== option.id))}><Trash2 /></Button>}
                    </div>
                )
            })}
            <Feedback message={errors.options} />
            <Button type="button" variant="outline" size="sm" disabled={options.length >= 100} onClick={() => onChange([...options, { id: crypto.randomUUID(), text: "" }])}><Plus /> Добавить вариант</Button>
        </fieldset>
    )
}
