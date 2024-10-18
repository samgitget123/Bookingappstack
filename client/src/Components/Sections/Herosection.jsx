
// Herosection.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCity, selectArea, fetchPlaygrounds } from '../../Features/citySlice';
import display from '../../Images/banner.jpg';
import brandlogo from '../../Images/brandlogonobg.png';
const Herosection = () => {
  const dispatch = useDispatch();
  const { cities, selectedCity, selectedArea, loading, error } = useSelector(state => state.city);

  const handleCityChange = (event) => {
    const city = event.target.value;
    dispatch(selectCity(city));
    if (city) {
      dispatch(fetchPlaygrounds(city)); // Fetch data when city is selected
    }
  };

  const handleAreaChange = (event) => {
    dispatch(selectArea(event.target.value));
  };
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await response.json();



          // Extract city and area, handling cases where city might be missing
          const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.state || 'Unknown City';
          const area = data.address.neighbourhood || data.address.suburb || data.address.road || data.address.footway || 'Unknown Area';


          // Set city and area in state
          dispatch(selectCity(city));
          dispatch(selectArea(area));

          // Optionally, trigger a fetch for playgrounds or related data based on the selected city
          if (city && city !== 'Unknown City') {
            dispatch(fetchPlaygrounds(city));
          }

        } catch (error) {
          console.error('Error with reverse geocoding:', error);
        }
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  return (
    <>
      <section className=' text-dark p-sm-3  primaryColor'>
        <div className="container ">
          <div className=" d-sm-flex justify-content-evenly  my-3">
            <div className='row'>
              <div className="col-lg-7 justify-content-center">
                <img className='img-fluid  w-80 mt-md-3' src={display} alt="image" />
              </div>
              <div className="col-lg-5 secondaryColor">
                <div className='d-flex align-items-center justify-content-center text-center'>
                  <div className='mt-sm-5'>
                    <div className='mb-3 d-none d-sm-block mb-sm-5'>
                      <img className='img-fluid w-50 ' class='rotateImage'   src={brandlogo} alt="logo" />
                    </div>
                    <h4 className='my-2 text-light'>Choose Your <span className='text-warning'>Ground</span></h4>
                    <form role="search" onSubmit={(e) => e.preventDefault()}>
                      <select
                        className="form-control mx-sm-3 my-3"
                        value={selectedCity}
                        onChange={handleCityChange}
                      >
                        <option value="">Select a city</option>
                        {cities.map((city, index) => (
                          <option key={index} value={city.city}>{city.city}</option>
                        ))}
                      </select>
                      <select
                        className="form-control mx-sm-3 my-3 "
                        value={selectedArea}
                        onChange={handleAreaChange}
                        disabled={!selectedCity}
                      >
                        <option value="">Select an area</option>
                        {selectedCity && cities.find(city => city.city === selectedCity)?.addresses.map((addr, index) => (
                          <option key={index} value={addr.area}>{addr.area}</option>
                        ))}
                      </select>
                    </form>
                    <div className='my-3'>
                      <button className="btn btn-primary my-3 " onClick={handleGetCurrentLocation}>
                        Use Current Location
                      </button>
                    </div>
                    <div className='my-3'>
                      <h4 className='text-light'>Find Grounds <span className='text-warning'>@ Your Nearest</span></h4>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
        </div>
      </section>
    </>
  );
};

export default Herosection;
