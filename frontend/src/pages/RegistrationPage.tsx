import { AuthForm } from "@/features/auth/AuthForm"
import { Card, CardContent, CardDescription, CardHeader } from "@/shared/ui/card"

export default function RegistrationPage() {
    return (
        <Card className="mx-auto my-0 max-w-md pt-0">
            <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
                <h1 className="text-3xl font-semibold tracking-tight">Создать аккаунт</h1>
                <CardDescription>Зарегистрируйтесь, чтобы создавать опросы.</CardDescription>
            </CardHeader>
            <CardContent className="sm:p-8 sm:pt-6"><AuthForm mode="register" /></CardContent>
        </Card>
    )
}
