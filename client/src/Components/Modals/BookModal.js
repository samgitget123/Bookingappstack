
// export default BookModal;
import React, { useEffect } from 'react';


const BookModal = ({ showModal, handleCloseModal }) => {
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
    }
  }, [showModal]);

  return (
    <>
      {/* Conditionally apply Bootstrap classes based on showModal */}
      <div
        className={`modal fade ${showModal ? 'show modal-animate' : ''}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Booking Confirmation
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              Your booking details go here. Please confirm your selection.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to simulate Bootstrap modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default BookModal;
