import { Navigate, Route } from "react-router-dom";
import AdminList from "../page/admin/admins/AdminList";

const AppRoutes = [
  <Route
    key={1}
    path="/"
    exact
    element={<Navigate replace to={"/admins"} />}
  />,

  <Route
    key={1}
    path="/admins"
    exact
    element={<AdminList />}
  />,
  // <Route key={11} path="/admin/*" element={<PrivateRoute element={AdminLayout}/>} />,
];

export default AppRoutes;