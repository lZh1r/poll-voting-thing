import { useState } from "react"
import { z } from "zod"

export type FieldErrors = Record<string, string>

export function useValidation() {
    const [errors, setErrors] = useState<FieldErrors>({})

    function validate<Schema extends z.ZodType>(schema: Schema, value: unknown): z.output<Schema> | null {
        const result = schema.safeParse(value)
        if (result.success) {
            setErrors({})
            return result.data
        }
        const nextErrors: FieldErrors = {}
        for (const issue of result.error.issues) {
            const key = issue.path.join(".") || "form"
            nextErrors[key] ??= issue.message
        }
        setErrors(nextErrors)
        return null
    }

    function clearError(field: string) {
        setErrors(current => Object.fromEntries(
            Object.entries(current).filter(([key]) => key !== field && !key.startsWith(`${field}.`))
        ))
    }

    function inputProps(field: string, id: string = field) {
        return {
            "aria-invalid": Boolean(errors[field]),
            "aria-describedby": errors[field] ? `${id}-error` : undefined,
        }
    }

    return { errors, validate, clearError, inputProps }
}
