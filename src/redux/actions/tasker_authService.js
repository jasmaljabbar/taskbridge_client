import axios from 'axios';
import { BASE_URL } from './authService';

const API_URL = `${BASE_URL}task_workers/`;
const API_URL_tasks = `${BASE_URL}adminside/`;

const tasker_register = async (taskerData) => {
  const user = JSON.parse(localStorage.getItem('token'));
  

  try {
    const response = await axios.post(API_URL +'become_tasker/', taskerData,{
      headers: {
        Authorization: `Bearer ${user}`
      }
    });
    if (response.data){
        localStorage.setItem('tasker', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


const getWorkCategories = async () => {
  try {
    const response = await axios.get(API_URL_tasks + 'workcategory/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

const getWork_Categories_for_user = async () => {
  try {
    const response = await axios.get(API_URL + 'workcategory/');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


const getTaskerProfile = async (token) =>{
  try{
    const response = await axios.get(API_URL + 'profile/',{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    );
    return response.data;
  } catch (error){
    throw error.response ? error.response.data : error;
  }
}

const tasker_authService = {
  tasker_register,
  getWorkCategories,
  getTaskerProfile,
  getWork_Categories_for_user,
};

export default tasker_authService;
