// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { admin_login, login } from "../../redux/reducers/authSlice";
// import { useNavigate } from "react-router-dom";

// function AdminLogin() {
//   const [adminInfo, setAdminInfo] = useState({ email: "", password: "" });
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const handleChange = async (e) => {
//     setAdminInfo((prevAdminInfo) => ({
//       ...prevAdminInfo,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userData = {
//         email: adminInfo.email,
//         password: adminInfo.password,
//       };
//       await dispatch(admin_login(userData));
//       navigate("/admin/user_list");
//     } catch (error) {
//       console.error("Login error:", error);
//     }
//   };
//   const back = () => {
//     navigate(-1);
//   };

//   return (
//     <>
//       <button
//         type="button"
//         onClick={back}
//         className="focus:outline-none float-right  text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
//       >
//         Back to Home
//       </button>
//       <div className="mx-auto mt-16 bg-white p-8 rounded-lg shadow-md w-full max-w-md flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
//         <div className="sm:mx-auto sm:w-full sm:max-w-sm ">
//           <h2 className="mt-3 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">
//             Admin Log In
//           </h2>
//         </div>

//         <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//           <form
//             className="space-y-6"
//             action="#"
//             method="POST"
//             onSubmit={handleSubmit}
//           >
//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="email"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Email address
//                 </label>
//               </div>
//               <div className="mt-2">
//                 <input
//                   onChange={handleChange}
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="flex items-center justify-between">
//                 <label
//                   htmlFor="password"
//                   className="block text-sm font-medium leading-6 text-gray-900"
//                 >
//                   Password
//                 </label>
//               </div>
//               <div className="mt-2">
//                 <input
//                   onChange={handleChange}
//                   id="password"
//                   name="password"
//                   type="password"
//                   autoComplete="current-password"
//                   required
//                   className="block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// export default AdminLogin;
