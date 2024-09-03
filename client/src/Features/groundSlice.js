// src/redux/groundSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for the ground slice
const initialState = {
  ground: null,
  loading: false,
  error: null,
};

// Async thunk for fetching ground details by ID
export const fetchGroundDetails = createAsyncThunk(
  'ground/fetchGroundDetails',
  async (gid, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:5000/ground/${gid}`);
      console.log('API Response:', response); // Log the response
      return response.data;
    } catch (error) {
      console.error('API Error:', error); // Log the error
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Ground slice with reducers and extra reducers
const groundSlice = createSlice({
  name: 'ground',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroundDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroundDetails.fulfilled, (state, action) => {
        state.ground = action.payload;
        console.log('Reducer Payload:', action.payload); 
        state.loading = false;
      })
      .addCase(fetchGroundDetails.rejected, (state, action) => {
        console.error('Fetch Error:', action.payload); // Log the error in the reducer
        state.error = action.payload.message || 'Failed to fetch ground details';
        state.loading = false;
      });
  },
});

export default groundSlice.reducer;
