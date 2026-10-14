interface FeedbackProps {
    id?: string
    message?: string | null
    kind?: "error" | "success"
}

export function Feedback({ id, message, kind = "error" }: FeedbackProps) {
    if (!message) return null
    return (
        <p id={id} role={kind === "error" ? "alert" : "status"} className={`rounded-xl p-3 text-sm ${kind === "error" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-400"}`}>
            {message}
        </p>
    )
}
