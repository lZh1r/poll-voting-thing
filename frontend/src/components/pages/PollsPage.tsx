import { ArrowUpRight, Plus } from "lucide-react"
import { Link } from "react-router"
import { demoPolls } from "../../data/polls"
import type { PollStatus } from "../../types"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"

const statusLabels: Record<PollStatus, string> = { active: "Идёт опрос", paused: "На паузе", finished: "Завершено" }
const statusVariants: Record<PollStatus, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  finished: "outline",
}

export default function PollsPage() {
    return (
        <div className="space-y-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">Мои опросы</h1>
                    <p className="mt-2 text-muted-foreground">Управляйте опросами и следите за ответами.</p>
                </div>
                <Button
                    nativeButton={false}
                    render={<Link to="/polls/new" />}
                >
                    <Plus /> Новый опрос
                </Button>
            </header>
            <div className="grid gap-4">
                {/* TODO: Надо будет сделать пагинацию */}
                {demoPolls.map((poll) => (
                    <Card key={poll.id} className="flex-row items-center justify-between gap-5 rounded-2xl p-5 shadow-none sm:p-6">
                        <CardContent className="flex min-w-0 flex-1 flex-col gap-5 p-0 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                    <Badge variant={statusVariants[poll.status]}>{statusLabels[poll.status]}</Badge>
                                    <span className="text-xs text-muted-foreground">Создано: {poll.createdAt}</span>
                                </div>
                                <h2 className="text-lg font-semibold">{poll.title}</h2>
                                <p className="mt-1 text-sm text-muted-foreground">{poll.description}</p>
                            </div>
                            <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                                <div className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{poll.totalVotes}</span> голосов</div>
                                <Button
                                    nativeButton={false}
                                    variant="outline"
                                    size="sm"
                                    render={ <Link to={`/polls/${poll.id}`} /> }
                                >
                                    Результаты <ArrowUpRight />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
