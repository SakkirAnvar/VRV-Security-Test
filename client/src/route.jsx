import { Navigate, createBrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./Layout/Layout.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import UserRole from "./Pages/UserRole.jsx";
import DashBoard from "./Pages/DashBoard.jsx";
import SubUser from "./Pages/SubUser.jsx";
import CarouselManager from "./Pages/CarouselManager.jsx";
import PrivateRoute from "./utils/PrivateRoute.jsx";
const LoginRoute = () => {
  const isAuth = useSelector((state) => state.auth.token);
  return isAuth ? <Navigate to="/dashboard" /> : <LoginPage />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    element: (
      <PrivateRoute>
        <Layout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <DashBoard />,
      },
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
      {
        path: "/dashboard/subuser",
        element: <SubUser />,
      },
      {
        path: "/dashboard/user_roles",
        element: <UserRole />,
      },
      {
        path: "/dashboard/banner",
        element: <CarouselManager />,
      },
    ],
  },
]);

export default router;
