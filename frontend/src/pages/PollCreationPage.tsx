import { ArrowLeft } from "lucide-react"
import { Link } from "react-router"
import { usePolls } from "@/entities/poll/context"
import { CreatePollForm } from "@/features/poll-form/CreatePollForm"
import { Card, CardContent } from "@/shared/ui/card"
import { DataState } from "@/shared/ui/DataState"

export default function PollCreationPage() {
    const { isLoading, error, reload } = usePolls()
    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <Link to="/polls" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> К списку опросов</Link>
            <header>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Создать опрос</h1>
                <p className="mt-2 text-muted-foreground">Сформулируйте вопрос и добавьте варианты ответа.</p>
            </header>
            {isLoading ? <DataState kind="loading" title="Загружаем данные…" /> : error ? (
                <DataState kind="error" title="Не удалось загрузить данные" description={error} onRetry={reload} />
            ) : <Card className="p-0"><CardContent className="p-5 sm:p-7"><CreatePollForm /></CardContent></Card>}
        </div>
    )
}
