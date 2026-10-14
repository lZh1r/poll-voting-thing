import { createBrowserRouter, RouterProvider } from "react-router"
import { PollProvider } from "@/entities/poll/PollProvider"
import { SessionProvider } from "@/entities/user/SessionProvider"
import HomePage from "@/pages/HomePage"
import LoginPage from "@/pages/LoginPage"
import RegistrationPage from "@/pages/RegistrationPage"
import PollsPage from "@/pages/PollsPage"
import PollCreationPage from "@/pages/PollCreationPage"
import PollManagementPage from "@/pages/PollManagementPage"
import VotePage from "@/pages/VotePage"
import NotFoundPage from "@/pages/NotFoundPage"
import AppLayout from "./AppLayout"

const router = createBrowserRouter([
    {
        Component: AppLayout,
        children: [
            { path: "/", Component: HomePage },
            { path: "/login", Component: LoginPage },
            { path: "/register", Component: RegistrationPage },
            { path: "/polls", Component: PollsPage },
            { path: "/polls/new", Component: PollCreationPage },
            { path: "/polls/:pollId", Component: PollManagementPage },
            { path: "/vote/:pollId", Component: VotePage },
            { path: "*", Component: NotFoundPage },
        ],
    },
])

export default function App() {
    return <SessionProvider><PollProvider><RouterProvider router={router} /></PollProvider></SessionProvider>
}
