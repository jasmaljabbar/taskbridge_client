import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "./redux/reducers/authSlice";
import { Toaster } from "react-hot-toast";

// Import components
import Register from "./Components/user_side/Register";
import Login from "./Components/user_side/Login";
import UserProfile from "./Components/user_side/UserProfile";
import HomePage from "./Components/user_side/Home";
import Services from "./Components/user_side/Services";
import Filtered_tasker from "./Components/user_side/Services/Filtered_tasker";
import SearchTasker from "./Components/user_side/Services/SearchTasker ";
import UserTaskerLayout from "./Components/user_side/Tasker/UserTaskerLayout";
import Details from "./Components/user_side/Tasker/Details";

import OneOneChat from "./Components/user_side/Tasker/Employee-user/OneOneChat";
import BookNow from "./Components/user_side/Tasker/BookNow";
import AppointmentHistory from "./Components/user_side/Tasker/AppointmentHistory ";
import UserLayout from "./Components/user_side/UserLayout";

import AdminLayout from "./Components/admin_side/Home/AdminLayout";
import AddUser from "./Components/admin_side/AddUser";
import UserList from "./Components/admin_side/UserList";
import Tasker_Listing from "./Components/admin_side/Tasker_Listing";
import TaskCategory from "./Components/admin_side/TaskCategory";
import TaskerProfile from "./Components/admin_side/TaskerProfile ";

import TaskerLayout from "./Components/tasker_side/Home/TaskerLayout";
import Signup from "./Components/tasker_side/Signup";
import Home from "./Components/tasker_side/Home";
import Dashboard from "./Components/admin_side/Dashboard ";
import Tasker_profile from "./Components/tasker_side/Tasker_profile";
import TaskShow from "./Components/tasker_side/TaskShow/TaskShow";
import TaskerAppointmentHistory from "./Components/tasker_side/TaskerAppointmentHistory ";

import NotFound from "./Components/common/NotFount";
import DebugTokenComponent from "./Components/Test";
// import MessageSidebar from "./Components/tasker_side/MessageSidebar";
import MainLayout from "./Components/tasker_side/MainLayout";
import Checkout from "./Components/tasker_side/Checkout";
import PaymentPage from "./Components/tasker_side/PaymentPage";
import SuccessPage from "./Components/tasker_side/SuccessPage";
import CancelPage from "./Components/tasker_side/CancelPage";
import SetSubscriptionPrice from "./Components/admin_side/SetSubscriptionPrice ";

import { jwtDecode } from 'jwt-decode';
import AcceptedAppointments from "./Components/tasker_side/dashboard/AcceptedAppointments";
import TaskerAppointments from "./Components/tasker_side/TaskerAppointments";
import UserTasker_request from "./Components/admin_side/UserTasker_request";





const ProtectedRoute = ({ element, isAuthenticated, redirectTo }) => {
  return isAuthenticated ? element : <Navigate to={redirectTo} replace />;
};

const App = () => {
  const [user, setUser] = useState(null);
  const accessToken = localStorage.getItem("token");

  useEffect(() => {
    if (accessToken) {
      try {
        const decodedUser = jwtDecode(accessToken);
        setUser(decodedUser);
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle the error appropriately, e.g., clearing the invalid token
        localStorage.removeItem("token");
      }
    }
  }, [accessToken]);

  const dispatch = useDispatch();
  const { isAuthenticated, isAdmin, is_staff: isStaff } = useSelector((state) => state.auth);

  useEffect(() => {
    if (accessToken) {
      dispatch(login({ accessToken }));
    }
  }, [dispatch, accessToken]);

  // Use optional chaining to safely access is_admin
  const isUserAdmin = user?.is_admin || false;

  return (
    <>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* User Routes */}
          <Route element={<UserLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/services" element={<Services />} />
            <Route path="/Filtered_tasker/:id" element={<Filtered_tasker />} />
            <Route path="/search_results" element={<SearchTasker />} />

            <Route
              path="/register"
              element={
                <ProtectedRoute
                  element={<Register />}
                  isAuthenticated={!isAuthenticated}
                  redirectTo="/home"
                />
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute
                  element={<Login />}
                  isAuthenticated={!isAuthenticated}
                  redirectTo="/home"
                />
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={<UserProfile />}
                  isAuthenticated={isAuthenticated}
                  redirectTo="/login"
                />
              }
            />

            <Route
              path="/become_a_tasker"
              element={
                <ProtectedRoute
                  element={<Home />}
                  isAuthenticated={isAuthenticated}
                  redirectTo="/login"
                />
              }
            />

            <Route
              path="/tasker_signup"
              element={
                <ProtectedRoute
                  element={<Signup />}
                  isAuthenticated={isAuthenticated}
                  redirectTo="/login"
                />
              }
            />
            <Route
                    path="/tasker_checkout"
                    element={
                        <ProtectedRoute
                            element={<PaymentPage />}
                            isAuthenticated={isAuthenticated}
                            redirectTo="/login"
                        />
                    }
                />
             <Route
                  path="/checkout_success"
                  element={
                    <ProtectedRoute
                      element={<SuccessPage />}
                      isAuthenticated={isAuthenticated}
                      redirectTo="/login"
                    />
                  }
                />
                <Route
                  path="/checkout_cancel"
                  element={
                    <ProtectedRoute
                      element={<CancelPage />}
                      isAuthenticated={isAuthenticated}
                      redirectTo="/login"
                    />
                  }
                />
            <Route
              path="/"
              element={
                <ProtectedRoute
                  element={<UserTaskerLayout />}
                  isAuthenticated={isAuthenticated}
                  redirectTo="/login"
                />
              }
            >
              <Route path="details/:id" element={<Details />} />
              <Route path="chat/:id" element={<OneOneChat />} />
              <Route path="booknow" element={<BookNow />} />
              <Route path="history" element={<AppointmentHistory />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={<AdminLayout />}
                isAuthenticated={isAuthenticated && isUserAdmin}
                redirectTo="/login"
              />
            }
          >
            <Route path="adduser" element={<AddUser />} />
            <Route path="subscription_price" element={<SetSubscriptionPrice />} />
            <Route path="user_list" element={<UserList />} />
            <Route path="tasker/:id" element={<TaskerProfile />} />
            <Route path="userTasker_request" element={<UserTasker_request />} />
            <Route path="tasker_showing" element={<Tasker_Listing />} />
            <Route path="task_list" element={<TaskCategory />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>

          {/* Tasker Routes */}
          <Route
            path="/tasker"
            element={
              <ProtectedRoute
                element={<TaskerLayout />}
                isAuthenticated={isAuthenticated && isStaff}
                redirectTo="/login"
              />
            }
          >
            <Route path="tasker_dashboard" element={<AcceptedAppointments />} />
            <Route path="profile" element={<Tasker_profile />} />
            <Route path="taskshow" element={<TaskShow />} />
            <Route path="message" element={<MainLayout />} />
            <Route path="taskerAppointments" element={<TaskerAppointments />} />
            <Route
              path="chat"
              element={
                <ProtectedRoute
                  element={<MainLayout />}
                  isAuthenticated={isAuthenticated}
                  redirectTo="/login"
                />
              }
            >
              <Route path=":id" element={<OneOneChat />} />
            </Route>

            <Route path="appointments" element={<TaskerAppointmentHistory />} />
          </Route>

          {/* Other Routes */}
          <Route path="/debugging" element={<DebugTokenComponent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
