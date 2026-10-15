import { useRef, useState } from "react"
import { errorMessage } from "./errors"

type ActionResult<Value> = { ok: true; value: Value } | { ok: false }

export function useAction() {
    const busy = useRef(false)
    const [pending, setPending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function run<Value>(action: () => Promise<Value>): Promise<ActionResult<Value>> {
        if (busy.current) return { ok: false }
        busy.current = true
        setPending(true)
        setError(null)
        try {
            return { ok: true, value: await action() }
        } catch (cause) {
            setError(errorMessage(cause))
            return { ok: false }
        } finally {
            busy.current = false
            setPending(false)
        }
    }

    return { run, pending, error }
}
