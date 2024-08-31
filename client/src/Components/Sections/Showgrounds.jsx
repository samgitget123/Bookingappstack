import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Showgrounds = () => {
  const { filteredPlaygrounds } = useSelector(state => state.city);
  const navigate = useNavigate();

  const handleCardClick = (playground) => {
    navigate(`/viewground/${playground.name}`, { state: playground });
  };
  return (
    <div className="container my-4">
      <div className="row">
        {filteredPlaygrounds.length > 0 ? (
          filteredPlaygrounds.map((playground, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12 mb-4" key={index}>
              <div className="card h-100"  onClick={() => handleCardClick(playground)}>
                <div className="card-body">
                  <h5 className="card-title">{playground.name}</h5>
                  <p className="card-text">Slots available: {playground.slots}</p>
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
    </div>
  );
};

export default Showgrounds;
