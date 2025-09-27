import { Navigate, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import Home from "../page/home/Home";
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

  // Pathless layout wrapper keeps existing hrefs like /admins and /schools working
  (
    <Route key="layout" element={<DashboardLayout />}>
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