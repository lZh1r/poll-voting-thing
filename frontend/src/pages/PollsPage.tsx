import { Plus } from "lucide-react"
import { Link } from "react-router"
import { PollCard } from "@/entities/poll/PollCard"
import { usePolls } from "@/entities/poll/context"
import { Button } from "@/shared/ui/button"
import { DataState } from "@/shared/ui/DataState"

export default function PollsPage() {
    const { polls, isLoading, error, reload } = usePolls()
    return (
        <div className="space-y-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">Мои опросы</h1>
                    <p className="mt-2 text-muted-foreground">Управляйте опросами и следите за ответами.</p>
                </div>
                <Button nativeButton={false} render={<Link to="/polls/new" />}><Plus /> Новый опрос</Button>
            </header>
            {isLoading ? <DataState kind="loading" title="Загружаем опросы…" /> : error ? (
                <DataState kind="error" title="Не удалось загрузить опросы" description={error} onRetry={reload} />
            ) : polls.length === 0 ? (
                <DataState title="Пока нет опросов" description="Создайте первый опрос и пригласите участников.">
                    <Button nativeButton={false} render={<Link to="/polls/new" />}>Создать первый опрос</Button>
                </DataState>
            ) : <div className="grid gap-4">{polls.map(poll => <PollCard key={poll.id} poll={poll} />)}</div>}
        </div>
    )
}
