import type { ReactNode } from "react"
import { Label } from "./label"

interface FormFieldProps {
    id: string
    label: ReactNode
    error?: string
    children: ReactNode
}

export function FormField({ id, label, error, children }: FormFieldProps) {
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            {children}
            {error && <p id={`${id}-error`} role="alert" className="text-sm text-destructive">{error}</p>}
        </div>
    )
}
