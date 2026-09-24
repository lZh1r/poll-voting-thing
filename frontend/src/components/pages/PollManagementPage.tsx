import { useState } from "react"
import { ArrowLeft, ExternalLink, Pause, Play, Save, Trash2 } from "lucide-react"
import { Link, useParams } from "react-router"
import { demoPolls } from "../../data/polls"
import type { PollStatus } from "../../types"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "../ui/alert-dialog"

const statusLabels: Record<PollStatus, string> = { active: "Идёт голосование", paused: "На паузе", finished: "Завершено" }
const statusVariants: Record<PollStatus, "default" | "secondary" | "outline"> = { active: "default", paused: "secondary", finished: "outline" }

export default function PollManagementPage() {
    const { pollId } = useParams()
    const poll = demoPolls.find((item) => item.id === pollId) ?? demoPolls[0]
    const [status, setStatus] = useState(poll.status)
    const [options, setOptions] = useState(poll.options.map((option) => option.text))
    const [message, setMessage] = useState("")
    const [deleted, setDeleted] = useState(false)
    
    if (deleted) {
        return (
            <Card className="mx-auto max-w-xl items-center p-8 text-center">
                <CardTitle className="text-2xl">Голосование удалено</CardTitle>
                <CardDescription>Доступ к нему больше не возможен.</CardDescription>
                <Button nativeButton={false} className="mt-5" render={<Link to="/polls" />}>Вернуться к списку</Button>
            </Card>
        )
    }
    
    const canPause = status === "active"
    const canResume = status === "paused"

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <Link to="/polls" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> К списку голосований</Link>
            <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                    <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">{poll.title}</h1>
                    <p className="mt-2 text-muted-foreground">{poll.description}</p>
                </div>
                <Button
                    nativeButton={false}
                    variant="outline"
                    render={<Link to={`/vote/${poll.id}`} />}
                >
                    <ExternalLink /> Страница участников
                </Button>
            </header>

            <section className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5 shadow-none">
                    <CardDescription>Всего голосов</CardDescription>
                    <p className="mt-2 text-3xl font-semibold">{poll.totalVotes}</p>
                </Card>
            </section>

            <Card>
                <CardHeader>
                    <CardTitle>Результаты</CardTitle>
                    <CardDescription>Количество голосов за каждый вариант.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {poll.options.map((option) => (
                            <div key={option.id} className="flex items-center justify-between gap-4 py-4">
                                <span className="font-medium">{option.text}</span>
                                <span className="shrink-0 text-sm text-muted-foreground">
                                    <strong className="text-foreground">{option.votes}</strong> голосов
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Варианты ответа</CardTitle>
                    <CardDescription>Здесь можно изменить варианты ответа.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {options.map((option, index) => (
                            <div key={`${index}-${poll.id}`} className="space-y-2">
                                <Label htmlFor={`option-${index}`}>Вариант {index + 1}</Label>
                                <Input id={`option-${index}`} value={option} onChange={(event) => setOptions((current) => current.map((value, valueIndex) => valueIndex === index ? event.target.value : value))} />
                            </div>
                        ))}
                    </div>
                    {message && <p role="status" className="mt-4 text-sm text-emerald-700">{message}</p>}
                    <Button className="mt-5" variant="outline" onClick={() => setMessage("Варианты сохранены.")}><Save /> Сохранить варианты</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Управление опросом</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                    {(canPause || canResume) && <Button variant="outline" onClick={() => setStatus(canPause ? "paused" : "active")}>
                        {canPause ? <><Pause /> Приостановить</> : <><Play /> Возобновить</>}
                    </Button>}
                    {status !== "finished" && <Button variant="outline" onClick={() => setStatus("finished")}>Завершить опрос</Button>}
                    <AlertDialog>
                        <AlertDialogTrigger render={
                            <Button variant="destructive">
                                <Trash2 /> Удалить
                            </Button>
                        }/>
                        <AlertDialogContent>
                            <AlertDialogHeader>Удаление опроса</AlertDialogHeader>
                            <AlertDialogDescription render={
                                <div className="space-y-4">
                                    <p>Вы больше не сможете просматривать информацию об этом опросе. Пользователи не смогут принять в нем участия.</p>
                                    <b>Это действие необратимо.</b>
                                </div>
                            }/>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Отмена</AlertDialogCancel>
                                <AlertDialogAction variant="destructive" onClick={() => setDeleted(true)}>
                                    Удалить
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
