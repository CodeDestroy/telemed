import AdminMain from '../Components/AdminPanel/Main/AdminDashboard'
import CreateSlot from '../Components/AdminPanel/ServicesList/CreateSlot'
import adminLocations from '../Locations/AdminLocations';
import AllSlots from '../Components/AdminPanel/ServicesList/AllSlots'
import {
  createBrowserRouter,
} from "react-router-dom";
import PageNotFound from '../Components/Errors/PageNotFound';
import PatientList from '../Components/AdminPanel/Patients/PatientList';
import PatientEdit from '../Components/AdminPanel/Patients/PatientEdit';
import PatientCreate from '../Components/AdminPanel/Patients/PatientCreate';
import DoctorList from '../Components/AdminPanel/Doctors/DoctorList';
import DoctorEdit from '../Components/AdminPanel/Doctors/DoctorEdit';
import DoctorCreate from '../Components/AdminPanel/Doctors/DoctorCreate'
import Schedule from '../Components/AdminPanel/Schedule';
import Settings from '../Components/AdminPanel/Profile/Settings';
import GeneralInfo from '../Components/AdminPanel/Profile/GeneralInfo';
import generalLocations from '../Locations/GeneralLocations';
const superAdminRouter = createBrowserRouter([
    {
        path: "*",
        element: <PageNotFound/>,
    },
    {
      path: adminLocations.index,
      element: <AdminMain/>,
    },
    {
      path: adminLocations.createConsultation,
      element: <CreateSlot/>,
    },
    {
      path: adminLocations.slotsManagement,
      element: <AllSlots/>
    },
    {
      path: adminLocations.patientManagement,
      element: <PatientList/>
    },
    {
      path: adminLocations.editPatient,
      element: <PatientEdit/>
    },
    {
      path: adminLocations.createPatient,
      element: <PatientCreate/>
    },
    {
      path: adminLocations.doctorManagement,
      element: <DoctorList/>
    },
    {
      path: adminLocations.editDoctor,
      element: <DoctorEdit/>
    },
    {
      path: adminLocations.createDoctor,
      element: <DoctorCreate/>
    },
    {
      path: adminLocations.calendar,
      element: <Schedule/>
    },
    {
      path: generalLocations.settings,
      element: <Settings/>
    },
    {
      path: generalLocations.profile,
      element: <GeneralInfo/>
    }
    /* {
        path: '/test',
        element: <Calendar/>
    } */
    /* {
      element: <PriateRouter/>
    } */
]);

export default superAdminRouter