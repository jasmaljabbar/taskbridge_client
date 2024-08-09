import axios from 'axios';
import { BASE_URL } from '../redux/actions/authService';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: 'Bearer test_token',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  console.log('Request intercepted:', config);
  return config;
});

axiosInstance.get('/test-endpoint/')
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });
