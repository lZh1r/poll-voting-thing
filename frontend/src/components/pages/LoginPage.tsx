import { Link } from "react-router"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function LoginPage() {
    return (
        <Card className="mx-auto max-w-md p-0">
            <CardHeader className="p-6 pb-0 sm:p-8 sm:pb-0">
                <CardTitle className="mt-2 text-3xl tracking-tight">Вход в аккаунт</CardTitle>
                <CardDescription>Войдите, чтобы управлять своими опросами.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-6 sm:p-8 sm:pt-6">
                <form className="mt-7 space-y-5" onSubmit={(event) => event.preventDefault()}>
                    <div className="space-y-2"><Label htmlFor="email">Электронная почта</Label><Input id="email" type="email" required placeholder="you@example.com" autoComplete="email" /></div>
                    <div className="space-y-2"><Label htmlFor="password">Пароль</Label><Input id="password" type="password" required placeholder="Введите пароль" autoComplete="current-password" /></div>
                    <Button type="submit" className="w-full">Войти</Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">Нет аккаунта? <Link to="/register" className="font-medium text-primary hover:underline">Зарегистрироваться</Link></p>
            </CardContent>
        </Card>
    );
}
