import { createBrowserRouter, RouterProvider } from "react-router"
import HomePage from "./components/pages/HomePage";

const router = createBrowserRouter([
    {
        path: "/",
        Component: HomePage
    }
]);

function App() {
    return (
        <RouterProvider router={router} />
    );
}

export default App;
