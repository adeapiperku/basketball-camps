import DashboardLayout from "../components/dashboard/DashboardLayout";
import CoachCreate from "../page/admin/coaches/CoachCreate";
import CoachList from "../page/admin/coaches/CoachList";
import CoachShow from "../page/admin/coaches/CoachShow";
import CoachEdit from "../page/admin/coaches/CoachEdit";
import CampList from "../page/admin/camps/CampList";
import CampCreate from "../page/admin/camps/CampCreate";
import CampShow from "../page/admin/camps/CampShow";
import CampEdit from "../page/admin/camps/CampEdit";
import ParticipantList from "../page/admin/participants/ParticipantList";
import ParticipantCreate from "../page/admin/participants/ParticipantCreate";
import ParticipantShow from "../page/admin/participants/ParticipantShow";
import ParticipantEdit from "../page/admin/participants/ParticipantEdit";
import SchoolList from "../page/admin/schools/SchoolList";
import SchoolCreate from "../page/admin/schools/SchoolCreate";
import SchoolShow from "../page/admin/schools/SchoolShow";
import SchoolEdit from "../page/admin/schools/SchoolEdit";
import Home from "../page/home/Home";
import CampCoachCreate from "../page/admin/campcoach/CampCoachCreate";
import RegistrationList from "../page/admin/registrations/RegistrationList";
import AdminList from "../page/admin/admins/AdminList";
import AdminCreate from "../page/admin/admins/AdminCreate";
import AdminShow from "../page/admin/admins/AdminShow";
import AdminEdit from "../page/admin/admins/AdminEdit";
// import CampRegistrationForm from "../page/home/CampRegistrationForm";
// import RegisteredParticipants from "../page/home/RegisteredParticipants";

export const AdminRoutes = [
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { path: "admins", element: <AdminList /> },
      { path: "admins/new", element: <AdminCreate /> },
      { path: "admins/:adminId", element: <AdminShow /> },
      { path: "admins/:adminId/edit", element: <AdminEdit /> },

      { path: "coaches", element: <CoachList /> },
      { path: "coaches/new", element: <CoachCreate /> },
      { path: "coaches/:coachId", element: <CoachShow /> },
      { path: "coaches/:coachId/edit", element: <CoachEdit /> },

      { path: "camp-coaches", element: <CampCoachCreate /> },
      
      { path: "registrations", element: <RegistrationList /> },

      { path: "camps", element: <CampList /> },
      { path: "camps/new", element: <CampCreate /> },
      { path: "camps/:campId", element: <CampShow /> },
      { path: "camps/:campId/edit", element: <CampEdit /> },

      { path: "participants", element: <ParticipantList /> },
      { path: "participants/new", element: <ParticipantCreate /> },
      { path: "participants/:participantId", element: <ParticipantShow /> },
      { path: "participants/:participantId/edit", element: <ParticipantEdit /> },

      { path: "schools", element: <SchoolList /> },
      { path: "schools/new", element: <SchoolCreate /> },
      { path: "schools/:schoolId", element: <SchoolShow /> },
      { path: "schools/:schoolId/edit", element: <SchoolEdit /> },
    ]
  }
];

export const CoachRoutes = [
  { path: "/home", element: <Home /> },
];

export const ParticipantRoutes = [
  { path: "/home", element: <Home /> },
//   { path: "/registrations/register", element: <CampRegistrationForm /> },
];
