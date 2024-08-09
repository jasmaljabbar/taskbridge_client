import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../redux/actions/authService";
import toast from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  work_image: Yup.mixed()
    .nullable()
    .notRequired()
    .test(
      "fileSize",
      "File Size is too large",
      value => value === null || (value && value.size <= 1024 * 1024)
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      value =>
        value === null ||
        (value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type))
    ),
});

function EditTask({ id, setTaskInfo, item }) {
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (values.work_image) {
      formData.append("work_image", values.work_image);
    }

    try {
      const response = await axios.put(
        `${BASE_URL}adminside/work/edit/${id}/`,
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
          task.id === id ? { ...task, ...response.data, isEditing: false } : task
        )
      );
      toast.success("Task edited successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
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
              <Formik
                initialValues={{
                  name: item.name || "",
                  description: item.description || "",
                  work_image: null,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ setFieldValue, isSubmitting }) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Name
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Category name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Description
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        placeholder="Category description"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm"
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
                        type="file"
                        name="work_image"
                        onChange={(event) => {
                          setFieldValue("work_image", event.currentTarget.files[0]);
                        }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      />
                      <ErrorMessage
                        name="work_image"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      {isSubmitting ? "Updating..." : "Update"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
