// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
  // cities: [
  //   {
  //     city: "Mumbai",
  //     addresses: [
  //       {
  //         country: "India",
  //         state: "Telangana",
  //         district: "Rangareddy",
  //         area: "Badangpet",
  //         playgrounds: [
  //           { name: "Vkings sportz arena", slots: 5 },
  //           { name: "Fusion The Turf", slots: 3 }
  //         ]
  //       },
  //       {
  //         country: "India",
  //         state: "Maharashtra",
  //         district: "Mumbai Suburban",
  //         area: "Bandra",
  //         playgrounds: [
  //           { name: "Bandra Fort Ground", slots: 4 }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     city: "Delhi",
  //     addresses: [
  //       {
  //         country: "India",
  //         state: "Delhi",
  //         district: "New Delhi",
  //         area: "Connaught Place",
  //         playgrounds: [
  //           { name: "Central Park", slots: 6 }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     city: "Hyderabad",
  //     addresses: [
  //       {
  //         country: "India",
  //         state: "Telangana",
  //         district: "Hyderabad",
  //         area: "Banjara Hills",
  //         playgrounds: [
  //           // Playgrounds for this area
  //         ]
  //       }
  //     ]
//     },
//     // Add more cities as needed
//   ],
//   selectedCity: '',
//   selectedArea: '',
//   filteredPlaygrounds: [],
//   searchQuery: ''
// };

// const citySlice = createSlice({
//   name: 'city',
//   initialState,
//   reducers: {
//     selectCity: (state, action) => {
//       state.selectedCity = action.payload;
//       state.selectedArea = ''; // Reset area selection
//       state.searchQuery = '';
      
//       const cityData = state.cities.find(city => city.city === state.selectedCity);
//       if (cityData) {
//         let allPlaygrounds = [];
//         cityData.addresses.forEach(addr => {
//           allPlaygrounds = allPlaygrounds.concat(addr.playgrounds);
//         });
//         state.filteredPlaygrounds = allPlaygrounds;
//       } else {
//         state.filteredPlaygrounds = [];
//       }
//     },
//     selectArea: (state, action) => {
//       state.selectedArea = action.payload;
//       const cityData = state.cities.find(city => city.city === state.selectedCity);
//       if (cityData) {
//         let areaPlaygrounds = [];
//         const selectedAddresses = cityData.addresses.filter(addr => addr.area === state.selectedArea);
//         selectedAddresses.forEach(addr => {
//           areaPlaygrounds = areaPlaygrounds.concat(addr.playgrounds);
//         });
//         state.filteredPlaygrounds = areaPlaygrounds;
//       } else {
//         state.filteredPlaygrounds = [];
//       }
//     },
//     setSearchQuery: (state, action) => {
//       state.searchQuery = action.payload;
//       if (state.selectedCity) {
//         const cityData = state.cities.find(city => city.city === state.selectedCity);
//         if (cityData) {
//           let allPlaygrounds = [];
//           cityData.addresses.forEach(addr => {
//             allPlaygrounds = allPlaygrounds.concat(addr.playgrounds);
//           });
//           state.filteredPlaygrounds = allPlaygrounds.filter(pg =>
//             pg.name.toLowerCase().includes(state.searchQuery.toLowerCase())
//           );
//         } else {
//           state.filteredPlaygrounds = [];
//         }
//       } else {
//         state.filteredPlaygrounds = [];
//       }
//     }
//   }
// });

// export const { selectCity, selectArea, setSearchQuery } = citySlice.actions;
// export default citySlice.reducer;




// citySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  cities: [
    {
      city: "Mumbai",
      addresses: [
        {
          country: "India",
          state: "Telangana",
          district: "Rangareddy",
          area: "Badangpet",
          playgrounds: [
            { name: "Vkings sportz arena", slots: 5 },
            { name: "Fusion The Turf", slots: 3 }
          ]
        },
        {
          country: "India",
          state: "Maharashtra",
          district: "Mumbai Suburban",
          area: "Bandra",
          playgrounds: [
            { name: "Bandra Fort Ground", slots: 4 }
          ]
        }
      ]
    },
    {
      city: "Delhi",
      addresses: [
        {
          country: "India",
          state: "Delhi",
          district: "New Delhi",
          area: "Connaught Place",
          playgrounds: [
            { name: "Central Park", slots: 6 }
          ]
        }
      ]
    },
    {
      city: "Hyderabad",
      addresses: [
        {
          country: "India",
          state: "Telangana",
          district: "Hyderabad",
          area: "Banjara Hills",
          playgrounds: [
            // Playgrounds for this area
          ]
        }
      ]
    },
    // Add more cities as needed
  ],
  selectedCity: '',
  selectedArea: '',
  filteredPlaygrounds: [],
  searchQuery: '',
  loading: false, // Add loading state
  error: null,    // Add error state
};

// Async thunk for fetching grounds based on location
// export const fetchPlaygrounds = createAsyncThunk(
//   'city/fetchPlaygrounds',
//   async (location, thunkAPI) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/grounds?location=${location}`);
//       console.log(response.data , 'APIRESPONSE');
//       return response.data; // Assume response is an array of playgrounds
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data || error.message);
//     }
//   }
// );
export const fetchPlaygrounds = createAsyncThunk(
  'city/fetchPlaygrounds',
  async (location, thunkAPI) => {
    const response = await fetch(`http://localhost:5000/grounds?location=${location}`);
    console.log('API' , response)
    if (!response.ok) {
      throw new Error('Failed to fetch playgrounds');
    }
    const data = await response.json();
    return data;
  }
);


const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    selectCity: (state, action) => {
      state.selectedCity = action.payload;
      state.selectedArea = ''; // Reset area selection
      state.searchQuery = '';
      state.filteredPlaygrounds = []; // Clear playgrounds to refresh
    },
    selectArea: (state, action) => {
      state.selectedArea = action.payload;
      const cityData = state.cities.find(city => city.city === state.selectedCity);
      if (cityData) {
        const selectedAddresses = cityData.addresses.filter(addr => addr.area === state.selectedArea);
        state.filteredPlaygrounds = selectedAddresses.flatMap(addr => addr.playgrounds);
      } else {
        state.filteredPlaygrounds = [];
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      const cityData = state.cities.find(city => city.city === state.selectedCity);
      if (cityData) {
        const allPlaygrounds = cityData.addresses.flatMap(addr => addr.playgrounds);
        state.filteredPlaygrounds = allPlaygrounds.filter(pg =>
          pg.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      } else {
        state.filteredPlaygrounds = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaygrounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlaygrounds.fulfilled, (state, action) => {
        state.loading = false;
        state.filteredPlaygrounds = action.payload;
      })
      .addCase(fetchPlaygrounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { selectCity, selectArea, setSearchQuery } = citySlice.actions;
export default citySlice.reducer;
