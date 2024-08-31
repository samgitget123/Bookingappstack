import { configureStore } from '@reduxjs/toolkit';
import cityReducer from  './Features/citySlice';

export const store = configureStore({
  reducer: {
    city: cityReducer,
  },
});
