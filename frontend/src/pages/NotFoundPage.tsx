import { Link } from "react-router"
import { Button } from "@/shared/ui/button"
import { DataState } from "@/shared/ui/DataState"

export default function NotFoundPage() {
    return (
        <DataState title="Страница не найдена" description="Проверьте адрес или вернитесь на главную.">
            <Button nativeButton={false} render={<Link to="/" />}>На главную</Button>
        </DataState>
    )
}
