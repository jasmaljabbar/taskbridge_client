import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logout } from "../../redux/reducers/authSlice";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);

  let user = null;
  if (token) {
    user = jwtDecode(token);
  }

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert(`Failed to log out: ${error}`);
    }
  };

  const handleSearch = () => {
    navigate(`/search_results?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <nav className="bg-gray-800 z-40 fixed top-0 w-full py-4">
      <div className="container mx-auto md:px-0 px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-white text-2xl font-bold">
            TaskBridge
          </Link>

          {/* Search Input */}
          <div className="hidden lg:flex items-center space-x-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or task"
              className="px-4 py-2 border rounded-lg"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Search
            </button>
          </div>

          {/* Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden lg:flex space-x-8">
              <Link to="/services" className="text-white hover:text-gray-300">
                Services
              </Link>
              <Link to="/profile" className="text-white hover:text-gray-300">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex space-x-8">
              <Link to="/services" className="text-white hover:text-gray-300">
                Services
              </Link>
              <Link to="/register" className="text-white hover:text-gray-300">
                Sign Up
              </Link>
              <Link to="/login" className="text-white hover:text-gray-300">
                Log In
              </Link>
            </div>
          )}

          {/* Become a Tasker Button */}
          {user ? (
            user.is_admin ? (
              <button className="bg-green-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-green-600">
                <Link to={"/admin/user_list"}>Go to Admin side</Link>
              </button>
            ) : user.is_staff ? (
              <button className="bg-blue-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-blue-600">
                <Link to={"/tasker/tasker_dashboard"}>Go to Tasker side</Link>
              </button>
            ) : (
              <button className="bg-blue-500 text-white md:px-4 md:py-2 px-2 py-0.5 text-[12px] md:text-md font-semibold rounded-lg hover:bg-blue-600">
                <Link to={"/tasker_home"}>Become a Tasker</Link>
              </button>
            )
          ) : null}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Links */}
        {isOpen && (
          <div className="lg:hidden mt-4 flex flex-col space-y-4">
            <Link to="/" className="text-white hover:text-gray-300">
              Services
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-white hover:text-gray-300">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="text-white hover:text-gray-300">
                  Sign Up
                </Link>
                <Link to="/login" className="text-white hover:text-gray-300">
                  Log In
                </Link>
              </>
            )}
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or task"
                className="px-4 py-2 border rounded-lg"
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Search
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
