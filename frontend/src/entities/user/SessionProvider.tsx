import { useState } from "react"
import type { ReactNode } from "react"
import type { User } from "./model"
import { SessionContext } from "./context"

export function SessionProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    return (
        <SessionContext.Provider value={{
            user,
            signIn: data => setUser({ ...data, id: crypto.randomUUID() }),
            signOut: () => setUser(null),
        }}>
            {children}
        </SessionContext.Provider>
    )
}
