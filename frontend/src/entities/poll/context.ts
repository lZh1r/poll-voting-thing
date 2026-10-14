import { createContext, useContext } from "react"
import type { Poll, PollCreate, PollOptionDraft, PollStatus } from "./model"

export interface PollState {
    polls: Poll[]
    isLoading: boolean
    error: string | null
}

export interface PollContextValue extends PollState {
    reload: () => void
    createPoll: (data: PollCreate) => Promise<Poll>
    updateOptions: (pollId: string, options: PollOptionDraft[]) => Promise<Poll>
    setStatus: (pollId: string, status: PollStatus) => Promise<Poll>
    deletePoll: (pollId: string) => Promise<void>
    vote: (pollId: string, optionId: string) => Promise<Poll>
}

export const PollContext = createContext<PollContextValue | null>(null)

export function usePolls(): PollContextValue {
    const context = useContext(PollContext)
    if (!context) throw new Error("PollProvider не подключён")
    return context
}

export function usePoll(pollId: string | undefined) {
    const context = usePolls()
    return { ...context, poll: context.polls.find(poll => poll.id === pollId) }
}
