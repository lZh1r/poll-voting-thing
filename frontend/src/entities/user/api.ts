import type { User } from "./model"

async function readResponse(response: Response): Promise<User> {
    if (response.ok) return response.json() as Promise<User>
    const body = await response.json().catch(() => null)
    throw new Error(typeof body?.detail === "string" ? body.detail : "Не удалось выполнить вход. Попробуйте снова.")
}

export async function signInRequest(mode: "login" | "register", data: { email: string; password: string; name?: string }): Promise<User> {
    const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })
    return readResponse(response)
}

export async function signOutRequest(): Promise<void> {
    const response = await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" })
    if (!response.ok) throw new Error("Не удалось завершить сессию. Попробуйте ещё раз.")
}
