import React, { useState , useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import groundImage from '../../Images/crick_img.jpg'
const CardComponent = ({ grounds }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8); //
  //const cardsPerPage = 8;
  // Check screen size and adjust cardsPerPage based on device
  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        // For mobile devices
        setCardsPerPage(4);
      } else {
        // For tablets and desktops
        setCardsPerPage(8);
      }
    };

    // Call the handler once to set the initial value based on current screen size
    handleResize();

    // Add event listener for screen resize
    window.addEventListener('resize', handleResize);

    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(grounds.length / cardsPerPage);

  // Get current cards for pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = grounds.slice(indexOfFirstCard, indexOfLastCard);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const navigate = useNavigate();
  const handleCardClick = (gid) => {
    navigate(`/viewground/${gid}`, { state: gid });
  };

  return (
    <div className="container my-3">
      <div className="row g-4">
        {currentCards && currentCards.length > 0 ? (
          currentCards.map((playground, index) => (
            <div className="col-lg-3 col-md-6 col-sm-12" key={index}>
              <div className="card h-80 shadow-lg border-0 rounded" onClick={() => handleCardClick(playground.ground_id)}>
                <img src={groundImage} className="card-img-top img-fluid groundImgsize" alt={playground.data.name} />
                <div className="card-body teritoryColor secondaryFont">
                  <h4 className="card-title teritoryFont">{playground.data.name}</h4>
                  <p className="card-text  teritoryFont">
                    Location: {playground.data.location}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No playgrounds available for the selected city or query.</p>
          </div>
        )}
      </div>

      {/* Pagination Buttons */}
      {currentCards.length > 0 ? (
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 d-flex justify-content-between">
            <button
              className="btn btn-sm  secondaryColor primaryFont"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="btn btn-sm  secondaryColor primaryFont"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

    </div>
  );
};

export default CardComponent;
