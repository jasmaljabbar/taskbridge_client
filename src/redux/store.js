import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authSlice';
import taskerAuthReducer from './reducers/tasker_authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasker_auth: taskerAuthReducer,  
  },
});
