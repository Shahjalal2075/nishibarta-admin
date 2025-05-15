import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Root from "../Layouts/Root";
import Home from "../Pages/Home/Home";
import PrivateRoute from "./PrivateRoute";
import CategoryNewsList from "../Pages/CategoryNewsList/CategoryNewsList";
import NewsAdd from "../Pages/NewsAdd/NewsAdd";
import Login from "../Pages/Login/Login";
import CheckRoute from "./CheckRoute";

const Routes = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute><Root></Root></PrivateRoute>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: "/news/:link",
        element: <CategoryNewsList></CategoryNewsList>,
        loader: ({ params }) => fetch(`http://localhost:5000/admin-menu/${params.link}`)
      },
      {
        path: "/news/:link/add",
        element: <NewsAdd></NewsAdd>,
        loader: ({ params }) => fetch(`http://localhost:5000/admin-menu/${params.link}`)
      }
    ]
  },
  {
     path: "/login",
        element: <CheckRoute><Login></Login></CheckRoute>
  }
]);

export default Routes;