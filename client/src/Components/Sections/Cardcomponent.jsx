import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CardComponent = ({ grounds }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

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
              <div className="card h-100 shadow-sm" onClick={() => handleCardClick(playground.ground_id)}>
                <img src={playground.data.photo} className="card-img-top img-fluid" alt={playground.data.name} />
                <div className="card-body">
                  <h5 className="card-title">{playground.data.name}</h5>
                  <p className="card-text">
                    Location: <strong>{playground.data.location}</strong>
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
            className="btn btn-sm btn-primary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      ): null}
      
    </div>
  );
};

export default CardComponent;
