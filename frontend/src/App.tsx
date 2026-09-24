import { createBrowserRouter, RouterProvider } from "react-router"
import AppLayout from "./components/AppLayout"
import HomePage from "./components/pages/HomePage"
import LoginPage from "./components/pages/LoginPage"
import PollsPage from "./components/pages/PollsPage"
import RegistrationPage from "./components/pages/RegistrationPage"
import PollCreationPage from "./components/pages/PollCreationPage"
import PollManagementPage from "./components/pages/PollManagementPage"
import VotePage from "./components/pages/VotePage"

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
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
