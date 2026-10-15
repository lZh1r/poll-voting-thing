import { useCallback, useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"
import { errorMessage } from "@/shared/lib/errors"
import { POLLS_STORAGE_KEY, pollRepository } from "./repository"
import { PollContext } from "./context"
import type { PollContextValue, PollState } from "./context"
import type { Poll } from "./model"

export function PollProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<PollState>({ polls: [], isLoading: true, error: null })
    const requestId = useRef(0)

    const reload = useCallback(() => {
        const currentRequest = ++requestId.current
        return pollRepository.list().then(
            polls => {
                if (currentRequest === requestId.current) setState({ polls, isLoading: false, error: null })
            },
            cause => {
                if (currentRequest === requestId.current) {
                    setState({ polls: [], isLoading: false, error: errorMessage(cause) })
                }
            }
        )
    }, [])

    useEffect(() => {
        void reload()
        const onStorage = (event: StorageEvent) => {
            if (event.key === POLLS_STORAGE_KEY || event.key === null) void reload()
        }
        window.addEventListener("storage", onStorage)
        return () => {
            requestId.current += 1
            window.removeEventListener("storage", onStorage)
        }
    }, [reload])

    function applyChange(result: { polls: Poll[]; poll: Poll }): Poll {
        requestId.current += 1
        setState({ polls: result.polls, isLoading: false, error: null })
        return result.poll
    }

    const value: PollContextValue = {
        ...state,
        reload: () => {
            setState(current => ({ ...current, isLoading: true, error: null }))
            void reload()
        },
        createPoll: async data => applyChange(await pollRepository.create(data)),
        updateOptions: async (pollId, options) => applyChange(await pollRepository.updateOptions(pollId, options)),
        setStatus: async (pollId, status) => applyChange(await pollRepository.setStatus(pollId, status)),
        vote: async (pollId, optionId) => applyChange(await pollRepository.vote(pollId, optionId)),
        deletePoll: async pollId => {
            const polls = await pollRepository.remove(pollId)
            requestId.current += 1
            setState({ polls, isLoading: false, error: null })
        },
    }

    return <PollContext.Provider value={value}>{children}</PollContext.Provider>
}
