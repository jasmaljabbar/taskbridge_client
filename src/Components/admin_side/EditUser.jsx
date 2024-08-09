import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../redux/actions/authService";

function EditUser({ id, setTaskInfo, item }) {
  const [updated, setUpdated] = useState({
    name: item.name || "",
    description: item.description || "",
    work_image: null,
  });
  const token = useSelector((state) => state.auth.token);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "work_image") {
      setUpdated({ ...updated, [name]: files[0] });
    } else {
      setUpdated({ ...updated, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", updated.name);
    formData.append("description", updated.description);
    if (updated.work_image) {
      formData.append("work_image", updated.work_image);
    }

    try {
      const response = await axios.put(
        `${BASE_URL}adminside/edit_workcategory/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTaskInfo((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id
            ? { ...task, ...response.data, isEditing: false }
            : task
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const handleClose = () => {
    setTaskInfo((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, isEditing: false } : task
      )
    );
  };

  return (
    <div className="flex justify-center items-center">
      <div
        id="authentication-modal"
        tabIndex="-1"
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Work Category
              </h3>
              <button
                onClick={handleClose}
                type="button"
                className="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="authentication-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="p-4 md:p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Name
                  </label>
                  <input
                    onChange={handleChange}
                    value={updated.name}
                    type="text"
                    name="name"
                    id="name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Category name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Description
                  </label>
                  <textarea
                    onChange={handleChange}
                    value={updated.description}
                    name="description"
                    id="description"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Category description"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="work_image"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Work Image
                  </label>
                  <input
                    onChange={handleChange}
                    type="file"
                    name="work_image"
                    id="work_image"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
