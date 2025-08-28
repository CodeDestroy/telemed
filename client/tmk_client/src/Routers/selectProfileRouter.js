import SelectProfile from "../Components/SelectProfile"
import Login from "../Components/Login";
import VideoCompoent from '../Components/VideoComponent'
/* import AdminMain from '../Components/AdminPanel/Main/'
import AdminRegistration from '../Components/AdminPanel/Registration' */
import { observer } from 'mobx-react-lite';
import {
  createBrowserRouter,
} from "react-router-dom";
import PriateRouter from "./priateRouter";
import PageNotFound from '../Components/Errors/PageNotFound'
import ProtocolPage from '../Components/Protocol/ProtocolPage';
const selectProfileRouter = createBrowserRouter([
    {
      path: "*",
      element: <SelectProfile/>,
    },
    /* {
      path: "/",
      element: <SelectProfile/>,
    },
    {
      path: '/room/:roomId',
      element: <VideoCompoent/>
    },
    {
      path: '/protocol/:protocolId',
      element: <ProtocolPage/>
    } */
]);

export default selectProfileRouter