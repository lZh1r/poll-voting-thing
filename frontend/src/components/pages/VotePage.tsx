import { useState } from "react"
import { Check, LockKeyhole } from "lucide-react"
import { useParams } from "react-router"
import { demoPolls } from "../../data/polls"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"

export default function VotePage() {
  const { pollId } = useParams()
  const poll = demoPolls.find((item) => item.id === pollId) ?? demoPolls[0]
  const [selectedOption, setSelectedOption] = useState("")
  const [submitted, setSubmitted] = useState(false)

    return (
        <section className="mx-auto max-w-2xl space-y-7">
            <div>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">{poll.title}</h1>
                <p className="mt-3 text-muted-foreground">{poll.description}</p>
            </div>
            {submitted ? (
                <Card role="status" className="p-8 text-center">
                    <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-700"><Check className="size-6" /></span>
                    <h2 className="mt-4 text-xl font-semibold">Ваш голос учтён</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Спасибо за участие!</p>
                </Card>
            ) : poll.status !== "active" ? (
                    <Card>
                        <h2 className="font-semibold">Опрос закрыт</h2>
                        <p className="mt-2 text-sm text-muted-foreground">Организатор временно остановил приём ответов.</p>
                    </Card>
            ) : (
                <Card>
                    <form onSubmit={(event) => { event.preventDefault(); if (selectedOption) setSubmitted(true) }}>
                        <CardHeader>
                            <CardTitle>Ваш ответ</CardTitle>
                            <CardDescription>Выберите один вариант</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <RadioGroup value={selectedOption || null} onValueChange={(value) => setSelectedOption(value ?? "")}>
                                {poll.options.map((option) => (
                                    <Label key={option.id} htmlFor={`answer-${option.id}`} className={`cursor-pointer rounded-xl border p-4 transition-colors hover:bg-muted/50 ${selectedOption === option.id ? "border-primary bg-primary/5" : ""}`}>
                                        <RadioGroupItem id={`answer-${option.id}`} value={option.id} />
                                        <span className="text-sm font-medium">{option.text}</span>
                                    </Label>
                                ))}
                            </RadioGroup>
                            <Button type="submit" disabled={!selectedOption} className="w-full sm:w-auto">Отправить голос</Button>
                            <p className="flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" /> Голосование анонимное. Результат увидит организатор.</p>
                        </CardContent>
                    </form>
                </Card>
            )}
        </section>
    );
}
