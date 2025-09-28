import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Home from "../page/home/Home";
import SignIn from "../page/home/SignIn";
// import SignUp from "../page/home/SignUp";
import PrivateRoute from "./PrivateRoute";
import AdminList from "../page/admin/admins/AdminList";
import AdminShow from "../page/admin/admins/AdminShow";
import AdminCreate from "../page/admin/admins/AdminCreate";
import AdminEdit from "../page/admin/admins/AdminEdit";
import SchoolList from "../page/admin/schools/SchoolList";
import SchoolCreate from "../page/admin/schools/SchoolCreate";
import SchoolEdit from "../page/admin/schools/SchoolEdit";
import SchoolShow from "../page/admin/schools/SchoolShow";
import ParticipantList from "../page/admin/participants/ParticipantList";
import ParticipantCreate from "../page/admin/participants/ParticipantCreate";
import ParticipantShow from "../page/admin/participants/ParticipantShow";
import ParticipantEdit from "../page/admin/participants/ParticipantEdit";
import CoachList from "../page/admin/coaches/CoachList";
import CoachCreate from "../page/admin/coaches/CoachCreate";
import CoachShow from "../page/admin/coaches/CoachShow";
import CoachEdit from "../page/admin/coaches/CoachEdit";

const AppRoutes = [
  // Redirect root to /home
  <Route key="root-redirect" path="/" element={<Navigate replace to="/home" />} />,

  // Public Home page
  <Route key="home" path="/home" element={<Home />} />,

  // Auth routes
  <Route key="sign-in" path="/sign-in" element={<SignIn />} />,
  // <Route key="sign-up" path="/sign-up" element={<SignUp />} />,

  (
    <Route
      key="layout"
      element={
        <PrivateRoute allowedRoles={["admin"]}>
          <DashboardLayout />
        </PrivateRoute>
      }
    >
      {/* Admin routes */}
      <Route path="admins" element={<AdminList />} />
      <Route path="admins/new" element={<AdminCreate />} />
      <Route path="admins/:adminId" element={<AdminShow />} />
      <Route path="admins/:adminId/edit" element={<AdminEdit />} />
      {/* School routes */}
      <Route path="schools" element={<SchoolList />} />
      <Route path="schools/new" element={<SchoolCreate />} />
      <Route path="schools/:schoolId" element={<SchoolShow />} />
      <Route path="schools/:schoolId/edit" element={<SchoolEdit />} />
      {/* Participants routes */}
      <Route path="participants" element={<ParticipantList />} />
      <Route path="participants/new" element={<ParticipantCreate />} />
      <Route path="participants/:participantId" element={<ParticipantShow />} />
      <Route path="participants/:participantId/edit" element={<ParticipantEdit />} />
      {/* Coaches routes */}
      <Route path="coaches" element={<CoachList />} />
      <Route path="coaches/new" element={<CoachCreate />} />
      <Route path="coaches/:coachId" element={<CoachShow />} />
      <Route path="coaches/:coachId/edit" element={<CoachEdit />} />

    </Route>
  ),
];

export default AppRoutes;