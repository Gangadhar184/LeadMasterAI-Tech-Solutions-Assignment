import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signup from "./Signup"
import Quiz from "./Quiz"
import ResultPage from "./ResultPage"
import PrivateRoute from "./PrivateRoute"

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <Signup />
    },
    {
      path: '/quiz',
      element: (
        <PrivateRoute>
          <Quiz />
        </PrivateRoute>
      )
    },
    {
      path: '/result',
      element: (
        <PrivateRoute>
          <ResultPage />
        </PrivateRoute>
      )
    }
  ])

  return <RouterProvider router={appRouter} />
}

export default Body
