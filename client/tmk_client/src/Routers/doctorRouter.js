import Login from "../Components/Login";
import AdminMain from '../Components/AdminPanel/Main/DoctorDashboard'
import AdminRegistration from '../Components/AdminPanel/Registration'
import Calendar from "../Components/Calendar";
import { observer } from 'mobx-react-lite';
import {
  createBrowserRouter,
} from "react-router-dom";
import ActiveList from '../Components/AdminPanel/ServicesList/ActiveList'
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
import CreateDateScheduleDoctor from "../Components/AdminPanel/CreateSchedulerDoctor/Dates";
import ProtocolPage from '../Components/Protocol/ProtocolPage';
import ConsultationDetailsPage from "../Components/AdminPanel/ConsultationDetailsPage";
import CreateSchedulerDoctor from '../Components/AdminPanel/CreateSchedulerDoctor'
const doctorRouter = createBrowserRouter([
    {
        path: "*",
        element: <AdminMain/>,
    },
    {
      path: doctorLocations.consultations,
      element: <ActiveList/>
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
      element: <CreateSchedulerDoctor/>
    },
    {
      path: doctorLocations.createDateSchedule,
      element: <CreateDateScheduleDoctor/>
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