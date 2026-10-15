import { useCallback } from "react"

let refreshInFlight: Promise<boolean> | null = null

function refreshAccess(): Promise<boolean> {
    if (!refreshInFlight) {
        refreshInFlight = fetch("/api/auth/refresh", { method: "POST", credentials: "same-origin" })
            .then(response => response.ok)
            .catch(() => false)
            .finally(() => { refreshInFlight = null })
    }
    return refreshInFlight
}

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const request = new Request(input, { ...init, credentials: "same-origin" })
    let response = await fetch(request.clone())
    if (response.status !== 401) return response
    const body = await response.clone().json().catch(() => null)
    if (body?.code !== "access_refresh_required" || !(await refreshAccess())) return response
    response = await fetch(request.clone())
    return response
}

export function useAuthFetch() {
    return useCallback((input: RequestInfo | URL, init?: RequestInit) => authFetch(input, init), [])
}
