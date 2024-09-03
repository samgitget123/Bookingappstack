// import { configureStore } from '@reduxjs/toolkit';
// import cityReducer from  './Features/citySlice';

// export const store = configureStore({
//   reducer: {
//     city: cityReducer,
//   },
// });

// store.js
import { configureStore } from '@reduxjs/toolkit';
import cityReducer from './Features/citySlice';
import groundReducer from './Features/groundSlice';
const store = configureStore({
  reducer: {
    city: cityReducer,
    ground : groundReducer
  },
});

export default store;
