import { Link } from "react-router"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function RegistrationPage() {
    return (
        <Card className="mx-auto max-w-md pt-0 my-0">
            <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
                <CardTitle className="text-3xl tracking-tight">Создать аккаунт</CardTitle>
                <CardDescription>Зарегистрируйтесь, чтобы создавать опросы.</CardDescription>
            </CardHeader>
            <CardContent className="sm:p-8 sm:pt-6">
                <form className="mt-7 space-y-5" onSubmit={(event) => event.preventDefault()}>
                    <div className="space-y-2"><Label htmlFor="name">Имя</Label><Input id="name" type="text" required placeholder="Как к вам обращаться" autoComplete="name" /></div>
                    <div className="space-y-2"><Label htmlFor="email">Электронная почта</Label><Input id="email" type="email" required placeholder="you@example.com" autoComplete="email" /></div>
                    <div className="space-y-2"><Label htmlFor="password">Пароль</Label><Input id="password" type="password" required minLength={8} placeholder="Не менее 8 символов" autoComplete="new-password" /></div>
                    <Button type="submit" className="w-full">Зарегистрироваться</Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">Уже есть аккаунт? <Link to="/login" className="font-medium text-primary hover:underline">Войти</Link></p>
            </CardContent>
        </Card>
    );
}
