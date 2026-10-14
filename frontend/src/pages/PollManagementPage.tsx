import { useState } from "react"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Link, useLocation, useParams } from "react-router"
import { usePoll } from "@/entities/poll/context"
import { PollResults } from "@/entities/poll/PollResults"
import { PollStatusBadge } from "@/entities/poll/PollStatusBadge"
import { EditOptionsForm } from "@/features/poll-form/EditOptionsForm"
import { PollControls } from "@/features/poll-management/PollControls"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { DataState } from "@/shared/ui/DataState"
import { Feedback } from "@/shared/ui/Feedback"

function PollManagementContent({ pollId }: { pollId: string | undefined }) {
    const { poll, isLoading, error, reload } = usePoll(pollId)
    const [deleted, setDeleted] = useState(false)
    const location = useLocation()

    if (deleted) return (
        <DataState title="Голосование удалено" description="Доступ к нему больше невозможен.">
            <Button nativeButton={false} render={<Link to="/polls" />}>Вернуться к списку</Button>
        </DataState>
    )
    if (isLoading) return <DataState kind="loading" title="Загружаем опрос…" />
    if (error) return <DataState kind="error" title="Не удалось загрузить опрос" description={error} onRetry={reload} />
    if (!poll) return (
        <DataState title="Опрос не найден" description="Проверьте ссылку. Возможно, опрос был удалён.">
            <Button nativeButton={false} render={<Link to="/polls" />}>К списку опросов</Button>
        </DataState>
    )

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <Link to="/polls" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> К списку голосований</Link>
            <Feedback kind="success" message={location.state?.created ? "Опрос успешно создан!" : null} />
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div className="min-w-0">
                    <PollStatusBadge status={poll.status} />
                    <h1 className="mt-4 break-words text-3xl font-semibold tracking-tight">{poll.title}</h1>
                    <p className="mt-2 break-words text-muted-foreground">{poll.description}</p>
                </div>
                <Button nativeButton={false} variant="outline" render={<Link to={`/vote/${poll.id}`} />}><ExternalLink /> Страница участников</Button>
            </header>
            <PollResults poll={poll} />
            <Card>
                <CardHeader>
                    <CardTitle>Варианты ответа</CardTitle>
                    <CardDescription>Измените варианты ответа. Удаление варианта также удалит его голоса.</CardDescription>
                </CardHeader>
                <CardContent><EditOptionsForm poll={poll} /></CardContent>
            </Card>
            <Card>
                <CardHeader><CardTitle>Управление опросом</CardTitle></CardHeader>
                <CardContent><PollControls poll={poll} onDeleted={() => setDeleted(true)} /></CardContent>
            </Card>
        </div>
    )
}

export default function PollManagementPage() {
    const { pollId } = useParams()
    return <PollManagementContent key={pollId} pollId={pollId} />
}
