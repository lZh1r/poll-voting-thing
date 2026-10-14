import { Link, useParams } from "react-router"
import { usePoll } from "@/entities/poll/context"
import { VoteForm } from "@/features/vote/VoteForm"
import { Button } from "@/shared/ui/button"
import { DataState } from "@/shared/ui/DataState"

export default function VotePage() {
    const { pollId } = useParams()
    const { poll, isLoading, error, reload } = usePoll(pollId)
    if (isLoading) return <DataState kind="loading" title="Загружаем опрос…" />
    if (error) return <DataState kind="error" title="Не удалось загрузить опрос" description={error} onRetry={reload} />
    if (!poll) return (
        <DataState title="Опрос не найден" description="Проверьте ссылку. Возможно, опрос был удалён.">
            <Button nativeButton={false} render={<Link to="/" />}>На главную</Button>
        </DataState>
    )

    return (
        <section className="mx-auto max-w-2xl space-y-7">
            <header>
                <h1 className="mt-2 break-words text-3xl font-semibold tracking-tight">{poll.title}</h1>
                <p className="mt-3 break-words text-muted-foreground">{poll.description}</p>
            </header>
            <VoteForm key={poll.id} poll={poll} />
        </section>
    )
}
