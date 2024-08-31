import { createSlice } from '@reduxjs/toolkit';

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
  searchQuery: ''
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    selectCity: (state, action) => {
      state.selectedCity = action.payload;
      state.selectedArea = ''; // Reset area selection
      state.searchQuery = '';
      
      const cityData = state.cities.find(city => city.city === state.selectedCity);
      if (cityData) {
        let allPlaygrounds = [];
        cityData.addresses.forEach(addr => {
          allPlaygrounds = allPlaygrounds.concat(addr.playgrounds);
        });
        state.filteredPlaygrounds = allPlaygrounds;
      } else {
        state.filteredPlaygrounds = [];
      }
    },
    selectArea: (state, action) => {
      state.selectedArea = action.payload;
      const cityData = state.cities.find(city => city.city === state.selectedCity);
      if (cityData) {
        let areaPlaygrounds = [];
        const selectedAddresses = cityData.addresses.filter(addr => addr.area === state.selectedArea);
        selectedAddresses.forEach(addr => {
          areaPlaygrounds = areaPlaygrounds.concat(addr.playgrounds);
        });
        state.filteredPlaygrounds = areaPlaygrounds;
      } else {
        state.filteredPlaygrounds = [];
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      if (state.selectedCity) {
        const cityData = state.cities.find(city => city.city === state.selectedCity);
        if (cityData) {
          let allPlaygrounds = [];
          cityData.addresses.forEach(addr => {
            allPlaygrounds = allPlaygrounds.concat(addr.playgrounds);
          });
          state.filteredPlaygrounds = allPlaygrounds.filter(pg =>
            pg.name.toLowerCase().includes(state.searchQuery.toLowerCase())
          );
        } else {
          state.filteredPlaygrounds = [];
        }
      } else {
        state.filteredPlaygrounds = [];
      }
    }
  }
});

export const { selectCity, selectArea, setSearchQuery } = citySlice.actions;
export default citySlice.reducer;


