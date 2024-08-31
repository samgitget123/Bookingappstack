import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cities: [
    {
      city: "Hyderabad",
      addresses: [
        {
          address: "Badangpet",
          playgrounds: [
            { name: "Sportz Arena", slots: 5 },
            { name: "Riverside Park Playground", slots: 3 }
          ]
        },
        {
          address: "456 Elm St",
          playgrounds: [
            { name: "Brooklyn Bridge Park Playground", slots: 4 }
          ]
        }
      ]
    },
    {
      city: "Los Angeles",
      addresses: [
        {
          address: "789 Sunset Blvd",
          playgrounds: [
            { name: "Griffith Park Playground", slots: 6 }
          ]
        }
      ]
    }
  ],
  selectedCity: '',
  selectedAddress: '',
  filteredPlaygrounds: [],
  searchQuery: ''
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    selectCity: (state, action) => {
      state.selectedCity = action.payload;
      state.selectedAddress = '';
      state.filteredPlaygrounds = [];
    },
    selectAddress: (state, action) => {
      const address = action.payload;
      state.selectedAddress = address;
      const cityData = state.cities.find(city => city.city === state.selectedCity);
      if (cityData) {
        const addressData = cityData.addresses.find(addr => addr.address === address);
        if (addressData) {
          state.filteredPlaygrounds = addressData.playgrounds;
        } else {
          state.filteredPlaygrounds = [];
        }
      }
    },
    setSearchQuery: (state, action) => {
      console.log("Updating Search Query:", action.payload); // Debug log
      state.searchQuery = action.payload;
      if (state.selectedCity) {
        const cityData = state.cities.find(city => city.city === state.selectedCity);
        if (cityData) {
          let playgrounds = [];
          cityData.addresses.forEach(addr => {
            playgrounds = playgrounds.concat(addr.playgrounds);
          });
          state.filteredPlaygrounds = playgrounds.filter(pg =>
            pg.name.toLowerCase().includes(state.searchQuery.toLowerCase())
          );
        }
      } else {
        // If no city is selected, search through all cities and addresses
        let allPlaygrounds = [];
        state.cities.forEach(city => {
          city.addresses.forEach(addr => {
            allPlaygrounds = allPlaygrounds.concat(addr.playgrounds);
          });
        });
        state.filteredPlaygrounds = allPlaygrounds.filter(pg =>
          pg.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
      console.log("Filtered Playgrounds:", state.filteredPlaygrounds); // Debug log
    }
  }
});

export const { selectCity, selectAddress, setSearchQuery } = citySlice.actions;
export default citySlice.reducer;
