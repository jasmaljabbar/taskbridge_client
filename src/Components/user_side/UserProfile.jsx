import React, { useEffect, useState } from "react";
import axios from "axios";
import Unknown from "../../statics/user_side/Unknown.jpg";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/reducers/authSlice";
import { BASE_URL } from "../../redux/actions/authService";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  full_name: Yup.string()
    .min(2, "Full name must be at least 2 characters")
    .required("Full name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone_number: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number is not valid")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  gender: Yup.string().required("Gender is required"),
});


const UserProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.token);
  const [profile_data, setProfile_data] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    gender: "",
    profile_photo: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (accessToken) {
        const user_profile = await dispatch(fetchUserProfile(accessToken));
        setProfile_data(user_profile.payload?.profile);
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, accessToken]);

  useEffect(() => {
    if (profile_data) {
      setFormData({
        full_name: profile_data.username || "",
        email: profile_data.email || "",
        phone_number: profile_data.phone_number || "",
        address: profile_data.address || "",
        city: profile_data.city || "",
        gender: profile_data.gender || "",
        profile_photo: null,
      });
    }
  }, [profile_data]);

  const handleSave = async (values) => {
    setLoading(true);
    if (!accessToken) {
      console.error("No access token available");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in values) {
      if (key === "profile_photo") {
        if (values[key] !== null) {
          formDataToSend.append(key, values[key]);
        }
      } else {
        formDataToSend.append(key, values[key]);
      }
    }

    try {
      await axios.put(
        `${BASE_URL}profiles/update/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedProfile = {
        ...profile_data,
        username: values.full_name,
        email: values.email,
        phone_number: values.phone_number,
        address: values.address,
        city: values.city,
        gender: values.gender,
        profile_photo:
          values.profile_photo instanceof File
            ? URL.createObjectURL(values.profile_photo)
            : profile_data.profile_photo,
      };
      setProfile_data(updatedProfile);
      dispatch(fetchUserProfile(accessToken));
      setEditing(false);
      setLoading(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <div className="flex items-center justify-between border-b pb-6 mb-6">
          <div className="flex items-center">
            {profile_data.profile_photo ? (
              <img
                src={profile_data.profile_photo}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <img
                src={Unknown}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="ml-4">
              <h2 className="text-2xl font-bold">
                {profile_data.username || "N/A"}
              </h2>
            </div>
          </div>
          {editing ? null : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          )}
        </div>
        {editing ? (
          <Formik
            initialValues={formData}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {({ setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      disabled
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <Field
                      type="text"
                      name="phone_number"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="phone_number" component="div" className="text-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <Field
                      type="text"
                      name="address"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <Field
                      type="text"
                      name="city"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                    <ErrorMessage name="city" component="div" className="text-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    <ErrorMessage name="gender" component="div" className="text-red-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      onChange={(event) => {
                        setFieldValue("profile_photo", event.currentTarget.files[0]);
                      }}
                      className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                value={profile_data.email || ""}
                className="mt-1 p-2 outline-none cursor-pointer block w-full border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                value={profile_data.phone_number || ""}
                className="mt-1 p-2 outline-none cursor-pointer block w-full border border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                value={profile_data.address || ""}
                className="mt-1 p-2 block w-full cursor-pointer border outline-none border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                value={profile_data.city || ""}
                className="mt-1 p-2 block outline-none w-full border cursor-pointer border-gray-300 rounded-md"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <input
                value={profile_data.gender || ""}
                className="mt-1 p-2 outline-none cursor-pointer block w-full border border-gray-300 rounded-md"
                readOnly
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
