import MainPage from "../Components/MainPage";
import Login from "../Components/Login";
import VideoCompoent from '../Components/VideoComponent'
import AdminMain from '../Components/AdminPanel/Main'
import AdminRegistration from '../Components/AdminPanel/Registration'
import { observer } from 'mobx-react-lite';
import {
  createBrowserRouter,
} from "react-router-dom";
import PriateRouter from "./priateRouter";
import PageNotFound from '../Components/Errors/PageNotFound'
const mainRouter = createBrowserRouter([
    {
      path: "*",
      element: <PageNotFound/>,
    },
    {
      path: "/",
      element: <MainPage/>,
    },
    /* {
      path: '/login',
      element: <Login/>
    }, */
    {
      path: '/room/:roomId',
      element: <VideoCompoent/>
    },
    {
      path: '/admin',
      element: <AdminMain/>,
    },
    {
      path: '/admin/registration',
      element: <AdminRegistration/>
    }
    /* {
      element: <PriateRouter/>
    } */
]);

export default mainRouter