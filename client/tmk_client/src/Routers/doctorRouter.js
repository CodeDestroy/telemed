import Login from "../Components/Login";
import AdminMain from '../Components/AdminPanel/Main/DoctorDashboard'
import AdminRegistration from '../Components/AdminPanel/Registration'
import Calendar from "../Components/Calendar";
import { observer } from 'mobx-react-lite';
import {
  createBrowserRouter,
} from "react-router-dom";
import AdminServicesList from '../Components/AdminPanel/ServicesList/ActiveList'
import EndedList from '../Components/AdminPanel/ServicesList/EndedList'
import doctorLocations from '../Locations/DoctorLocations'
import VideoComponent from "../Components/VideoComponent";
const doctorRouter = createBrowserRouter([
    {
        path: "*",
        element: <AdminMain/>,
    },
    {
      path: doctorLocations.consultations,
      element: <AdminServicesList/>
    },
    {
      path: doctorLocations.tmk,
      element: <VideoComponent/>
    },
    {
      path: doctorLocations.endedConsultations,
      element: <EndedList/>
    }
    /* {
        path: '/test',
        element: <Calendar/>
    } */
    /* {
      element: <PriateRouter/>
    } */
]);

export default doctorRouter