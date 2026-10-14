import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import type { Poll } from "./model"

export function PollResults({ poll }: { poll: Poll }) {
    return (
        <>
            <Card className="p-5 shadow-none">
                <CardDescription>Всего голосов</CardDescription>
                <p className="mt-2 text-3xl font-semibold">{poll.totalVotes}</p>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Результаты</CardTitle>
                    <CardDescription>Количество голосов за каждый вариант.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {poll.options.map(option => (
                            <div key={option.id} className="flex items-center justify-between gap-4 py-4">
                                <span className="min-w-0 break-words font-medium">{option.text}</span>
                                <span className="shrink-0 text-sm text-muted-foreground"><strong className="text-foreground">{option.votes}</strong> голосов</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
