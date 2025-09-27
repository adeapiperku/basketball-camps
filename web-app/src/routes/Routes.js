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
    </Route>
  ),
];

export default AppRoutes;