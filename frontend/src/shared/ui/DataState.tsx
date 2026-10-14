import type { ReactNode } from "react"
import { Button } from "./button"
import { Card, CardDescription } from "./card"

interface DataStateProps {
    title: string
    description?: string
    kind?: "loading" | "error" | "empty"
    onRetry?: () => void
    children?: ReactNode
}

export function DataState({ title, description, kind = "empty", onRetry, children }: DataStateProps) {
    return (
        <Card className="mx-auto max-w-xl items-center p-8 text-center" role={kind === "error" ? "alert" : "status"} aria-busy={kind === "loading"}>
            <h2 className="text-xl font-semibold">{title}</h2>
            {description && <CardDescription>{description}</CardDescription>}
            {onRetry && <Button type="button" variant="outline" onClick={onRetry}>Попробовать снова</Button>}
            {children}
        </Card>
    )
}
