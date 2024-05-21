import MainPage from "../Components/MainPage";
import Login from "../Components/Login";
import VideoCompoent from '../Components/VideoComponent'
import { observer } from 'mobx-react-lite';
import {
  createBrowserRouter,
} from "react-router-dom";
import PriateRouter from "./priateRouter";

const mainRouter = createBrowserRouter([
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
    /* {
      element: <PriateRouter/>
    } */
]);

export default mainRouter