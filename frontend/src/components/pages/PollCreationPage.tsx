import { useState } from "react"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Textarea } from "../ui/textarea"

export default function PollCreationPage() {
  const [options, setOptions] = useState(["", ""])
  const [created, setCreated] = useState(false)

  function updateOption(index: number, value: string) {
    setOptions((current) => current.map((option, optionIndex) => optionIndex === index ? value : option))
  }

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            <Link to="/polls" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> К списку опросов</Link>
            <header>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Создать опрос</h1>
                <p className="mt-2 text-muted-foreground">Сформулируйте вопрос и добавьте варианты ответа.</p>
            </header>
            <Card className="p-0">
                <CardContent className="p-5 sm:p-7">
                    <form className="space-y-6" onSubmit={(event) => { event.preventDefault(); setCreated(true) }}>
                        <div className="space-y-2"><Label htmlFor="poll-title">Название опроса</Label>
                            <Input id="poll-title" required maxLength={160} placeholder="Например: Как?" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="poll-description">
                                Описание <span className="font-normal text-muted-foreground">(необязательно)</span>
                            </Label>
                            <Textarea id="poll-description" rows={3} maxLength={500} placeholder="Добавьте немного контекста для участников" />
                        </div>
                        <fieldset className="space-y-3">
                            <legend className="mb-3 text-sm font-medium">Варианты ответа</legend>
                            {options.map((option, index) => (
                                <div className="flex gap-2" key={index}>
                                    <Input required value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Вариант ${index + 1}`} aria-label={`Вариант ${index + 1}`} />
                                    {options.length > 2 && <Button type="button" variant="ghost" size="icon" aria-label={`Удалить вариант ${index + 1}`} onClick={() => setOptions((current) => current.filter((_, optionIndex) => optionIndex !== index))}><Trash2 /></Button>}
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => setOptions((current) => [...current, ""])}><Plus /> Добавить вариант</Button>
                        </fieldset>
                        {created && <p role="status" className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-800">Опрос успешно создан!</p>}
                        <Separator />
                        <div className="flex flex-wrap gap-3">
                            <Button type="submit">Создать опрос</Button>
                            <Button type="button" variant="outline" render={<Link to="/polls" />}>Отмена</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
