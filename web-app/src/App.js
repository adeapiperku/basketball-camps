import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Unauthorized from "./page/home/Unauthorized";
import Home from "./page/home/Home";
import RegisteredParticipants from "./page/home/RegisteredParticipants";
import CampRegistrationForm from "./page/home/CampRegistrationForm";
import PrivateRoute from "./routes/PrivateRoute";
import SignUp from "./page/home/SignUp";
import SignIn from "./page/home/SignIn";
import Dashboard from "./components/dashboard/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/" element={<Home />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/coach/camp-participants" element={<RegisteredParticipants />} />
        <Route path="/camps/:campId/register" element={<CampRegistrationForm />} />

        <Route path="/admin/*" element={<PrivateRoute roles={['ADMIN']} component={Dashboard} />} />
        {/* <Route path="/coach/*" element={<PrivateRoute roles={['COACH']} component={CoachLayout} />} />
        <Route path="/participant/*" element={<PrivateRoute roles={['PARTICIPANT']} component={ParticipantLayout} />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
