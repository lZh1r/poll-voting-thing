import { useState } from "react"
import { Pause, Play } from "lucide-react"
import type { Poll, PollStatus } from "@/entities/poll/model"
import { usePolls } from "@/entities/poll/context"
import { useAction } from "@/shared/lib/useAction"
import { Button } from "@/shared/ui/button"
import { Feedback } from "@/shared/ui/Feedback"
import { DeletePollButton } from "./DeletePollButton"

export function PollControls({ poll, onDeleted }: { poll: Poll; onDeleted: () => void }) {
    const { setStatus } = usePolls()
    const { run, pending, error } = useAction()
    const [message, setMessage] = useState("")

    async function changeStatus(status: PollStatus) {
        setMessage("")
        const result = await run(() => setStatus(poll.id, status))
        if (result.ok) {
            const messages: Record<PollStatus, string> = {
                active: "Приём ответов возобновлён.", paused: "Приём ответов приостановлен.", finished: "Опрос завершён.",
            }
            setMessage(messages[status])
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                {poll.status !== "finished" && <>
                    <Button type="button" variant="outline" disabled={pending} onClick={() => changeStatus(poll.status === "active" ? "paused" : "active")}>
                        {poll.status === "active" ? <><Pause /> Приостановить</> : <><Play /> Возобновить</>}
                    </Button>
                    <Button type="button" variant="outline" disabled={pending} onClick={() => changeStatus("finished")}>Завершить опрос</Button>
                </>}
                <DeletePollButton pollId={poll.id} onDeleted={onDeleted} />
            </div>
            <Feedback message={error} />
            <Feedback kind="success" message={message} />
        </div>
    )
}
