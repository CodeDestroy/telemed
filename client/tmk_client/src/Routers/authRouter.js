import Login from "../Components/Login";
import AdminMain from '../Components/AdminPanel/Main'
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
    }
]);

export default authRouter