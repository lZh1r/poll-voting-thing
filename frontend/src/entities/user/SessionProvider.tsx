import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import type { User } from "./model"
import { SessionContext } from "./context"
import { signInRequest, signOutRequest } from "./api"
import { useAuthFetch } from "@/shared/lib/useAuthFetch"

export function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const version = useRef(0)
    const fetchWithAuth = useAuthFetch()

    useEffect(() => {
        let cancelled = false
        const initialVersion = version.current
        void fetchWithAuth("/api/auth/me").then(async response => {
            if (response.ok) {
                const currentUser = await response.json() as User
                if (!cancelled && version.current === initialVersion) setUser(currentUser)
            }
        }).catch(() => {}).finally(() => {
            if (!cancelled) setIsLoading(false)
        })
        return () => { cancelled = true }
    }, [fetchWithAuth])

    async function signIn(mode: "login" | "register", data: { email: string; password: string; name?: string }) {
        const nextUser = await signInRequest(mode, data)
        version.current += 1
        setUser(nextUser)
        setIsLoading(false)
    }

    async function signOut() {
        await signOutRequest()
        version.current += 1
        setUser(null)
    }

    return (
        <SessionContext.Provider value={{
            user,
            isLoading,
            signIn,
            signOut,
        }}>
            {children}
        </SessionContext.Provider>
    )
}
