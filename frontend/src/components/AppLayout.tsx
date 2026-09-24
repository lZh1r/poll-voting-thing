import { Link, NavLink, Outlet } from "react-router"
import { Vote } from "lucide-react"
import { Button } from "./ui/button"

const navigation = [
  { to: "/", label: "Главная", end: true },
  { to: "/polls", label: "Мои опросы" },
]

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
                    <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Vote className="size-5" />
                        </span>
                        <p className="max-sm:hidden">голос: дети</p>
                    </Link>
                    <nav className="hidden items-center gap-1 sm:flex" aria-label="Основная навигация">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) =>
                                    `rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="flex items-center gap-2">
                        <Button nativeButton={false} variant="ghost" size="sm" render={<Link to="/login" />}>Войти</Button>
                        <Button nativeButton={false} size="sm" render={<Link to="/register" />}>Создать аккаунт</Button>
                    </div>
                </div>
                <nav className="flex gap-2 border-t px-5 py-2 sm:hidden justify-center" aria-label="Мобильная навигация">
                    {navigation.map((item) => (
                        <NavLink key={item.to} to={item.to} end={item.end} className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-muted-foreground [&.active]:bg-muted [&.active]:text-foreground">
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </header>
            <main className="mx-auto max-w-6xl px-5 py-5 sm:py-14">
                <Outlet />
            </main>
        </div>
    );
}
