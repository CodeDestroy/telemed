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

const adminRouter = createBrowserRouter([
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
    }
    /* {
        path: '/test',
        element: <Calendar/>
    } */
    /* {
      element: <PriateRouter/>
    } */
]);

export default adminRouter