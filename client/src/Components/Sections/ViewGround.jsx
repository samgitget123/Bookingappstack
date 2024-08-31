import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
//images
import groundImage from '../../Images/turf.jpeg';

const ViewGround = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();  // Groundname
  const playground = location.state;  // playground state

  const handleBookClick = () => {
    const bookingId = 100001; // Example booking ID
    navigate(`/booking/${bookingId}`);
  };

  console.log(id, 'id it is');
  console.log(playground, 'playground');

  return (
    <>
      <section className='viewgroundsection my-5'>
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12">
              <div className='image-container'>
                <img src={groundImage} alt="ground" className='ground-image img-fluid' />
              </div>
            </div>
            <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 d-flex flex-column justify-content-between">
              <div>
                <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quo magnam necessitatibus nobis doloribus delectus, harum labore, cumque expedita quasi veniam amet beatae et nostrum explicabo!</p>
              </div>
              <div>
                <button 
                  type="button" 
                  className="btn btn-danger btn-lg" 
                  onClick={handleBookClick} // Use function reference here
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ViewGround;
