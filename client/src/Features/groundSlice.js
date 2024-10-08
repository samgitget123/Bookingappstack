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

// Async thunk for booking slots
export const bookSlot = createAsyncThunk(
  'ground/bookSlot',
  async (bookingData, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:5000/book-slot', bookingData);
      console.log('Booking Response:', response); // Log the booking response
      return response.data;
    } catch (error) {
      console.error('Booking Error:', error); // Log the error
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
        state.loading = false;
      })
      .addCase(fetchGroundDetails.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to fetch ground details';
        state.loading = false;
      })
      .addCase(bookSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.bookingStatus = null; // Reset booking status
      })
      .addCase(bookSlot.fulfilled, (state, action) => {
        state.bookingStatus = action.payload; // Set booking status to the response
        state.loading = false;
        
      })
      .addCase(bookSlot.rejected, (state, action) => {
        state.error = action.payload.message || 'Failed to book slots';
        state.loading = false;
      });
  },
});

export default groundSlice.reducer;
