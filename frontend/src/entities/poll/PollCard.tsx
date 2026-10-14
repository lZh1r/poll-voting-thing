import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router"
import { formatDate } from "@/shared/lib/format"
import { Button } from "@/shared/ui/button"
import { Card, CardContent } from "@/shared/ui/card"
import { PollStatusBadge } from "./PollStatusBadge"
import type { Poll } from "./model"

export function PollCard({ poll }: { poll: Poll }) {
    return (
        <Card className="flex-row items-center justify-between gap-5 rounded-2xl p-5 shadow-none sm:p-6">
            <CardContent className="flex min-w-0 flex-1 flex-col gap-5 p-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        <PollStatusBadge status={poll.status} />
                        <span className="text-xs text-muted-foreground">Создано: {formatDate(poll.createdAt)}</span>
                    </div>
                    <h2 className="break-words text-lg font-semibold">{poll.title}</h2>
                    <p className="mt-1 break-words text-sm text-muted-foreground">{poll.description}</p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                    <div className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{poll.totalVotes}</span> голосов</div>
                    <Button nativeButton={false} variant="outline" size="sm" render={<Link to={`/polls/${poll.id}`} />}>
                        Результаты <ArrowUpRight />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
