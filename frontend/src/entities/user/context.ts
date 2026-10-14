import { createContext, useContext } from "react"
import type { User } from "./model"

interface SessionContextValue {
    user: User | null
    signIn: (user: Omit<User, "id">) => void
    signOut: () => void
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession(): SessionContextValue {
    const context = useContext(SessionContext)
    if (!context) throw new Error("SessionProvider не подключён")
    return context
}
