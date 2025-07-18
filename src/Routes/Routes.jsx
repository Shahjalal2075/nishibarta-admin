import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import Root from "../Layouts/Root";
import Home from "../Pages/Home/Home";
import PrivateRoute from "./PrivateRoute";
import CategoryNewsList from "../Pages/CategoryNewsList/CategoryNewsList";
import NewsAdd from "../Pages/NewsAdd/NewsAdd";
import Login from "../Pages/Login/Login";
import CheckRoute from "./CheckRoute";
import Journalists from "../Pages/Journalists/Journalists";
import AllNews from "../Pages/AllNews/AllNews";
import PendingNews from "../Pages/PendingNews/PendingNews";
import ApprovedNews from "../Pages/ApprovedNews/ApprovedNews";
import RejectedNews from "../Pages/RejectedNews/RejectedNews";
import DeletedNews from "../Pages/DeletedNews/DeletedNews";
import NewsEdit from "../Pages/NewsEdit/NewsEdit";

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
        path: "/journalist",
        element: <Journalists></Journalists>
      },
      {
        path: "/all-news",
        element: <AllNews></AllNews>
      },
      {
        path: "/approved-news",
        element: <ApprovedNews></ApprovedNews>
      },
      {
        path: "/deleted-news",
        element: <DeletedNews></DeletedNews>
      },
      {
        path: "/pending-news",
        element: <PendingNews></PendingNews>
      },
      {
        path: "/rejected-news",
        element: <RejectedNews></RejectedNews>
      },
      {
        path: "/news/:link",
        element: <CategoryNewsList></CategoryNewsList>,
        loader: ({ params }) => fetch(`https://nishibarta-server.vercel.app/admin-menu/${params.link}`)
      },
      {
        path: "/news/:link/add",
        element: <NewsAdd></NewsAdd>,
        loader: ({ params }) => fetch(`https://nishibarta-server.vercel.app/admin-menu/${params.link}`)
      },/* 
      {
        path: "/news/:link/edit",
        element: <NewsEdit></NewsEdit>,
        loader: ({ params }) => fetch(`https://nishibarta-server.vercel.app/admin-menu/${params.link}`)
      } */
    ]
  },
  {
    path: "/login",
    element: <CheckRoute><Login></Login></CheckRoute>
  }
]);

export default Routes;