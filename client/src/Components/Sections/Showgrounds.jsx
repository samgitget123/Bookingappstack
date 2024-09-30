



// Showgrounds.js
// src/components/Showgrounds.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchPlaygrounds } from '../../Features/citySlice'; // Adjust the path as necessary
import Cardcomponent from './Cardcomponent';
const Showgrounds = ({ selectedCity }) => {
  const dispatch = useDispatch();
  const { filteredPlaygrounds, loading, error } = useSelector((state) => state.city || {});
  useEffect(() => {
    if (selectedCity) {
      dispatch(fetchPlaygrounds(selectedCity)); // Fetch playgrounds based on the selected city
    }
  }, [dispatch, selectedCity]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container my-4">
      <div className="row">
       
           <Cardcomponent grounds={filteredPlaygrounds} />
         
      </div>
    </div>
  );
};

export default Showgrounds;


