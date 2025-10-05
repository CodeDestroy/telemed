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
/* import CreateSchedule from "../Components/AdminPanel/CreateScheduler"; */
import CreateSchedule from "../Components/AdminPanel/CreateScheduler/WeekDays";
import Schedule from "../Components/AdminPanel/Schedule";
/* import Settings from "../Components/AdminPanel/Profile/Settings"; */
import GeneralInfo from "../Components/AdminPanel/Profile/GeneralInfo";
import generalLocations from '../Locations/GeneralLocations';
import Settings from "../Components/AdminPanel/Profile/Settings/DoctorSettings";
import CreateDateSchedule from "../Components/AdminPanel/CreateScheduler/Dates";
import ProtocolPage from '../Components/Protocol/ProtocolPage';
import ConsultationDetailsPage from "../Components/AdminPanel/ConsultationDetailsPage";
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
    },
    {
      path: doctorLocations.createSchedule,
      element: <CreateSchedule/>
    },
    {
      path: doctorLocations.createDateSchedule,
      element: <CreateDateSchedule/>
    },
    {
      path: doctorLocations.schedule,
      element: <Schedule/>

    },
    {
      path: generalLocations.settings,
      element: <Settings/>
    },
    {
      path: generalLocations.profile,
      element: <GeneralInfo/>
    },
    {
      path: '/protocol/:protocolId',
      element: <ProtocolPage/>
    },
    {
      path: doctorLocations.consultationPage,
      element: <ConsultationDetailsPage/>
    }


]);

export default doctorRouter