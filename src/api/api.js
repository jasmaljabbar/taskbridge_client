import axios from 'axios';
import { BASE_URL } from '../redux/actions/authService';

const api = axios.create({
    baseURL: BASE_URL,
});

const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export { api, setAuthToken };
