import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signup from "./Signup";
import Quiz from "./Quiz";
import ResultPage from "./ResultPage";


const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: '/',
            element: <Signup/>
        },
        {
            path: '/quiz',
            element: <Quiz/>
        },
        {
            path: '/result',
            element: <ResultPage/>
        }
    ])

    return(
        <>
        <RouterProvider router={appRouter} />
        </>
    )
}

export default Body;
