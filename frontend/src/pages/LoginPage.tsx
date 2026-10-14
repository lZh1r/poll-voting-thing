import { AuthForm } from "@/features/auth/AuthForm"
import { Card, CardContent, CardDescription, CardHeader } from "@/shared/ui/card"

export default function LoginPage() {
    return (
        <Card className="mx-auto max-w-md p-0">
            <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
                <h1 className="mt-2 text-3xl font-semibold tracking-tight">Вход в аккаунт</h1>
                <CardDescription>Войдите, чтобы управлять своими опросами.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-6 sm:p-8 sm:pt-6"><AuthForm mode="login" /></CardContent>
        </Card>
    )
}
