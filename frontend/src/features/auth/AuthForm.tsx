import { useState } from "react"
import type { FormEvent } from "react"
import { Link, useNavigate } from "react-router"
import { loginSchema, registrationSchema } from "@/entities/user/model"
import { useSession } from "@/entities/user/context"
import { useValidation } from "@/shared/lib/useValidation"
import { Button } from "@/shared/ui/button"
import { FormField } from "@/shared/ui/FormField"
import { Input } from "@/shared/ui/input"

export function AuthForm({ mode }: { mode: "login" | "register" }) {
    const registering = mode === "register"
    const [values, setValues] = useState({ name: "", email: "", password: "" })
    const { errors, validate, clearError, inputProps } = useValidation()
    const { signIn } = useSession()
    const navigate = useNavigate()

    function update(field: keyof typeof values, value: string) {
        setValues(current => ({ ...current, [field]: value }))
        clearError(field)
    }

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (registering) {
            const data = validate(registrationSchema, values)
            if (!data) return
            signIn({ name: data.name, email: data.email })
        } else {
            const data = validate(loginSchema, values)
            if (!data) return
            signIn({ name: data.email.split("@")[0], email: data.email })
        }
        void navigate("/polls")
    }

    return (
        <>
            <form className="mt-7 space-y-5" noValidate onSubmit={submit}>
                <p className="text-sm text-muted-foreground">Демонстрационный режим: вход без проверки аккаунта на сервере.</p>
                {registering && <FormField id="auth-name" label="Имя" error={errors.name}>
                    <Input id="auth-name" name="name" value={values.name} onChange={event => update("name", event.target.value)} maxLength={160} autoComplete="name" placeholder="Как к вам обращаться" {...inputProps("name", "auth-name")} />
                </FormField>}
                <FormField id="auth-email" label="Электронная почта" error={errors.email}>
                    <Input id="auth-email" name="email" type="email" value={values.email} onChange={event => update("email", event.target.value)} autoComplete="email" placeholder="you@example.com" {...inputProps("email", "auth-email")} />
                </FormField>
                <FormField id="auth-password" label="Пароль" error={errors.password}>
                    <Input id="auth-password" name="password" type="password" value={values.password} onChange={event => update("password", event.target.value)} maxLength={128} autoComplete={registering ? "new-password" : "current-password"} placeholder="Не менее 8 символов" {...inputProps("password", "auth-password")} />
                </FormField>
                <Button type="submit" className="w-full">{registering ? "Зарегистрироваться" : "Войти"}</Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
                {registering ? "Уже есть аккаунт? " : "Нет аккаунта? "}
                <Link to={registering ? "/login" : "/register"} className="font-medium text-primary hover:underline">{registering ? "Войти" : "Зарегистрироваться"}</Link>
            </p>
        </>
    )
}
