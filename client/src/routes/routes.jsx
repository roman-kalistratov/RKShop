import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Cart from "../pages/Cart";
import ResetPassword from "../pages/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword";
import SingleProduct from "../pages/SingleProduct";
import FavoriteList from "../pages/FavoriteList";
import { toast } from "react-toastify";
import Store from "../pages/Store";
import Checkout from "../pages/Checkout";
import ThankYouPage from "../pages/ThankYouPage";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const accessToken = localStorage.getItem("accessToken");
  if (!user && !accessToken) {
    toast.error("Not authorized!")
    return <Navigate to="/login" />;
  }

  return children;

};

const routes = [
  {
    index: true,
    path: "/",
    element: <Home />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />
  },
  {
    path: "/products/:productId",
    element: <SingleProduct />,
  },
  {
    path: "/profile",
    element:
      <ProtectedRoute>
        <span>Profile</span>
      </ProtectedRoute>
  },
  {
    path: "/cart",
    element:
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
  },
  {
    path: "/favorites",
    element: (
      <ProtectedRoute>
        <FavoriteList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/store",
    element: <Store />
  },
  {
    path: "/checkout",
    element:
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
  },
  {
    path: "/thankyou",
    element:
      <ProtectedRoute>
        <ThankYouPage />
      </ProtectedRoute>
  }
];

export default routes;