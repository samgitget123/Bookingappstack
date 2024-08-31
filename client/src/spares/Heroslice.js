import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCity, selectAddress, setSearchQuery } from '../../Features/citySlice';
import banner from '../../Images/turf.jpeg';

const Herosection = () => {
  const dispatch = useDispatch();
  const { cities, selectedCity, selectedAddress, filteredPlaygrounds, searchQuery } = useSelector(state => state.city);

  const handleCityChange = (event) => {
    dispatch(selectCity(event.target.value));
  };

  const handleAddressChange = (event) => {
    dispatch(selectAddress(event.target.value));
  };

  const handleSearchChange = (event) => {
    console.log("Search Query:", event.target.value); // Debug log
    dispatch(setSearchQuery(event.target.value));
  };

  return (
    <>
      <section className='heroSection'>
        <div className="container-fluid">
          <div className="row d-flex justify-content-center bg-light">
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 g-0 p-2 bg-light ">
              <div className='my-3'>
                <h4>Choose Your <span className='text-warning'>Ground</span></h4>
                <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    className="form-control me-2" 
                    type="search" 
                    placeholder="Search" 
                    aria-label="Search" 
                    value={searchQuery} 
                    onChange={handleSearchChange} 
                  />
                </form>
                <div>
                  <h4 className='heading_caption'>Find Grounds <span className='text-warning'>@ Your Nearest</span></h4>
                  {filteredPlaygrounds.length > 0 ? (
                    <ul>
                      {filteredPlaygrounds.map((playground, index) => (
                        <li key={index}>
                          {playground.name} - {playground.slots} slots available
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No playgrounds available for the selected location or query.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12 g-0 bg-light">
              <div className="container">
                <div id="carouselExampleCaptions" className="carousel slide">
                  <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3"></button>
                  </div>
                  <div className="carousel-inner top-fixed">
                    <div className="carousel-item active">
                      <img src={banner} className="d-block w-100" alt="..." />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>First slide label</h5>
                        <p>Some representative placeholder content for the first slide.</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img src={banner} className="d-block w-100" alt="..." />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>Second slide label</h5>
                        <p>Some representative placeholder content for the second slide.</p>
                      </div>
                    </div>
                    <div className="carousel-item">
                      <img src={banner} className="d-block w-100" alt="..." />
                      <div className="carousel-caption d-none d-md-block">
                        <h5>Third slide label</h5>
                        <p>Some representative placeholder content for the third slide.</p>
                      </div>
                    </div>
                  </div>
                  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
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
