
// export default BookModal;
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { bookSlot } from '../../Features/groundSlice';
const BookModal = ({ showModal, handleCloseModal, selectedSlots = [] , groundId}) => {
  const { gid } = useParams();
  console.log('selectedslots', selectedSlots);
  const dispatch = useDispatch();

  const handleBooking = () => {
    const bookingData = {
      ground_id: gid,
      date: new Date().toISOString().slice(0, 10),
      slots: selectedSlots,
      combopack: true,
    };

    dispatch(bookSlot(bookingData));
  };
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden'; // Disable scrolling when modal is open
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling when modal is closed
    }
  }, [showModal]);
  // Function to format a single slot
  const formatslot = (selectedSlots) => {
    if (!Array.isArray(selectedSlots) || selectedSlots.length === 0) return ''; // Ensure selectedSlots is a valid array

    // Function to format time from 24-hour to 12-hour with AM/PM
    const formatTime = (hours, minutes) => {
      const period = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${formattedHours}:${minutes} ${period}`;
    };

    // Extract the first and last slots from the selectedSlots array
    const firstSlot = selectedSlots[0];
    const lastSlot = selectedSlots[selectedSlots.length - 1];

    // Get start time from the first slot
    const [startHours, startHalf] = firstSlot.split('.').map(Number);
    const startMinutes = startHalf === 0 ? '00' : '30';
    const startTime = formatTime(startHours, startMinutes);

    // Get end time from the last slot (end 30 minutes after the last slot)
    const [endHours, endHalf] = lastSlot.split('.').map(Number);
    const endTime = formatTime(endHours + (endHalf === 0 ? 0 : 1), endHalf === 0 ? '30' : '00');

    // Return the formatted time range as one value
    return `${startTime} - ${endTime}`;
  };

  // const formatslot = (slot) => {
  //   console.log('selectedslot' , slot);

  //   if (typeof slot !== 'string') return ''; // Ensure slot is a string

  //   const [hours, half] = slot.split('.').map(Number);
  //   const startMinutes = half === 0 ? '00' : '30';
  //   const endHours = half === 0 ? hours : hours + 1;
  //   const endMinutes = half === 0 ? '30' : '00';

  //   const formatTime = (hours, minutes) => {
  //     const period = hours >= 12 ? 'PM' : 'AM';
  //     const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  //     return `${formattedHours}:${minutes} ${period}`;
  //   };

  //   const startTime = formatTime(hours, startMinutes);
  //   const endTime = formatTime(endHours, endMinutes);
  // console.log('starttime' , startTime , 'endtime ' , endTime);
  //   return `${startTime} - ${endTime}`;
  // };

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
              <p>Your booking details:</p>
              <p>Your booking details:</p>
              {selectedSlots.length > 0 ? (
                <p>{formatslot(selectedSlots)}</p> // Call formatslot with the entire selectedSlots array
              ) : (
                <p>No slots selected.</p>
              )}
              <p>Please confirm your selection.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleBooking}>
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
