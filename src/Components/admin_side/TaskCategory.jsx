import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { FaPen } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { B_URL, BASE_URL } from "../../redux/actions/authService";
import EditTask from "./EditTask";
import { CgUnblock } from "react-icons/cg";
import { MdBlock } from "react-icons/md";
import toast from "react-hot-toast";
import Modal from "./Modal"; // Import the new Modal component
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Define the Yup validation schema
const categorySchema = Yup.object().shape({
  name: Yup.string().required("Category name is required"),
  description: Yup.string().required("Description is required"),
  work_image: Yup.mixed().nullable(),
});

const TaskCategory = () => {
  const [taskInfo, setTaskInfo] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const accessToken = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  const handleModal = (id) => {
    const updated = taskInfo.map((item) =>
      item.id === id ? { ...item, isEditing: !item.isEditing } : item
    );
    setTaskInfo(updated);
  };

  const handleBlock = async (id) => {
    try {
      const response = await axios.post(
        `${BASE_URL}adminside/work/block/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const updated = taskInfo.map((item) =>
        item.id === id ? { ...item, blocked: !item.blocked } : item
      );
      setTaskInfo(updated);

      toast.success(response.data.status);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddCategory = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    if (values.work_image) {
      formData.append("work_image", values.work_image);
    }

    try {
      const response = await axios.post(
        `${BASE_URL}adminside/add_workcategory/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTaskInfo([...taskInfo, response.data]);
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${BASE_URL}adminside/workcategory/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTaskInfo(response.data);
        setLoading(false)
      } catch (error) {
        toast.alert(error.message);
        setLoading(false)
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!taskInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">No Tasks found</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center ml-32 w-full">
      <div className="flex flex-col p-6  h-screen w-[90%] mt-14">
        <div className="">
          <div className="flex justify-center">
            <h1 className="text-purple-950 text-4xl font-bold">Tasks</h1>
          </div>
          <div className="flex  w-full ms-28 justify-end items-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="ml-52 mr-auto bg-purple-950 text-white border rounded-xl border-purple-950 px-4 py-3 mt-6 mb-4"
            >
              Add Task Category +
            </button>
          </div>
        </div>
        
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <Formik
            initialValues={{ name: "", description: "", work_image: null }}
            validationSchema={categorySchema}
            onSubmit={handleAddCategory}
          >
            {({ setFieldValue }) => (
              <Form className="w-full mb-4 p-4 rounded bg-gray-50">
                <div className="mb-2">
                  <Field
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="mb-2">
                  <Field
                    as="textarea"
                    name="description"
                    placeholder="Category Description"
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="file"
                    name="work_image"
                    onChange={(event) => {
                      setFieldValue("work_image", event.currentTarget.files[0]);
                    }}
                    className="w-full p-2 border rounded"
                  />
                  <ErrorMessage
                    name="work_image"
                    component="div"
                    className="text-red-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-purple-950 text-white px-4 py-2 rounded"
                >
                  Add Category
                </button>
              </Form>
            )}
          </Formik>
        </Modal>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 ml-6 ms-28">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Display Picture
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(taskInfo) &&
              taskInfo.map((item) => (
                <tr
                  key={item.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <td className="w-4 p-4">
                    {item.work_image ? (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={`${B_URL}${item.work_image}`}
                        alt="work image"
                        onError={(e) => (e.target.src = Unknown)} // Fallback to Unknown image if there's an error
                      />
                    ) : (
                      <img
                        className="w-10 h-10 rounded-full"
                        src={Unknown}
                        alt="unknown work image"
                      />
                    )}
                  </td>

                  <td
                    scope="row"
                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <div className="ps-3">
                      <div className="text-base font-semibold">{item.name}</div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>{item.description}</div>
                  </td>
                  <td className="px-6 py-4 flex flex-row">
                    <FaPen onClick={() => handleModal(item.id)} />

                    {item.blocked ? (
                      <MdBlock
                        className="ml-3 text-red-500"
                        onClick={() => handleBlock(item.id)}
                        title="Unblock this category"
                      />
                    ) : (
                      <CgUnblock
                        className="ml-3 text-green-500"
                        onClick={() => handleBlock(item.id)}
                        title="Block this category"
                      />
                    )}
                  </td>
                  {item.isEditing ? (
                    <td>
                      <EditTask
                        id={item.id}
                        setTaskInfo={setTaskInfo}
                        item={item}
                      />{" "}
                    </td>
                  ) : null}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskCategory;
