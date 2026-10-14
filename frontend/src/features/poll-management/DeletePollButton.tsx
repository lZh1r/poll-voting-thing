import { useState } from "react"
import { Trash2 } from "lucide-react"
import { usePolls } from "@/entities/poll/context"
import { useAction } from "@/shared/lib/useAction"
import { Button } from "@/shared/ui/button"
import { Feedback } from "@/shared/ui/Feedback"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/shared/ui/alert-dialog"

export function DeletePollButton({ pollId, onDeleted }: { pollId: string; onDeleted: () => void }) {
    const [open, setOpen] = useState(false)
    const { deletePoll } = usePolls()
    const { run, pending, error } = useAction()

    async function remove() {
        const result = await run(() => deletePoll(pollId))
        if (result.ok) {
            setOpen(false)
            onDeleted()
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={next => { if (!pending) setOpen(next) }}>
            <AlertDialogTrigger render={<Button variant="destructive"><Trash2 /> Удалить</Button>} />
            <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Удаление опроса</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogDescription>Опрос, его варианты и голоса будут удалены. Это действие необратимо.</AlertDialogDescription>
                <Feedback message={error} />
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={pending}>Отмена</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" disabled={pending} onClick={remove}>{pending ? "Удаляем…" : "Удалить"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
