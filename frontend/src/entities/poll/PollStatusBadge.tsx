import { Badge } from "@/shared/ui/badge"
import type { PollStatus } from "./model"

const statusLabels: Record<PollStatus, string> = {
    active: "Идёт голосование", paused: "На паузе", finished: "Завершено",
}
const statusVariants: Record<PollStatus, "default" | "secondary" | "outline"> = {
    active: "default", paused: "secondary", finished: "outline",
}

export function PollStatusBadge({ status }: { status: PollStatus }) {
    return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
}
