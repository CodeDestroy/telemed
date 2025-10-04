import Login from "../Components/Login";
import AdminRegistration from '../Components/AdminPanel/Registration'
import Calendar from "../Components/Calendar";
import { observer } from 'mobx-react-lite';
import {
  createBrowserRouter,
} from "react-router-dom";
import PriateRouter from "./priateRouter";
import AdminLogin from "../Components/AdminPanel/Login";
import authLocations from '../Locations/AuthLocations'
import AdminRegistrationFirstStep from '../Components/AdminPanel/Registration/RegistrationFirstStep'
import AdminRegistrationSecondStep from '../Components/AdminPanel/Registration/RegistrationSecondStep'
import AdminRegistrationThirdStep from '../Components/AdminPanel/Registration/RegistrationThirdStage'

import ProtocolPage from '../Components/Protocol/ProtocolPage';
import RestoreFirstStep from "../Components/AdminPanel/RestorePassword/RestoreFirstStep";
import RestoreSecondStep from "../Components/AdminPanel/RestorePassword/RestoreSecondStep";
import RestoreThirdStep from "../Components/AdminPanel/RestorePassword/RestoreThirdStep";
const authRouter = createBrowserRouter([
    {
        path: "*",
        element: <Login/>,
    },
    {
        path: authLocations.adminRegistration,
        element: <AdminRegistration/>
    },
    {
        path: authLocations.adminLogin,
        element: <AdminLogin/>
    },
    {
        path: authLocations.doctorLogin,
        element: <AdminLogin/>
    },
    {
        path: authLocations.doctorRegistration,
        element: <AdminRegistrationFirstStep/>
    },
    {
        path: authLocations.registrationStep2,
        element: <AdminRegistrationSecondStep/>
    },
    {
        path: authLocations.registrationStep3,
        element: <AdminRegistrationThirdStep/>
    },
    {
      path: '/protocol/:protocolId',
      element: <ProtocolPage/>
    },
    {
      path: authLocations.doctorRestorePasswordStep1,
      element: <RestoreFirstStep/>,
    },
    {
      path: authLocations.doctorRestorePasswordStep2,
      element: <RestoreSecondStep/>,
    },
    {
      path: authLocations.doctorRestorePasswordStep1,
      element: <RestoreThirdStep/>,
    }
]);

export default authRouter