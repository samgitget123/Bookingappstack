
// export default BookModal;
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { bookSlot } from '../../Features/groundSlice';
const BookModal = ({ showModal, handleCloseModal, selectedSlots = []  , selectdate}) => {
  const { gid } = useParams();
  const navigate = useNavigate();
 const [info , setInfo] = useState('');
  const dispatch = useDispatch();
  const { bookingId, loading, error } = useSelector((state) => state.ground);
  // const handleBooking = () => {
  //   const bookingData = {
  //     ground_id: gid,
  //     date: selectdate,
  //     slots: selectedSlots,
  //     combopack: true,
  //   };

  //   dispatch(bookSlot(bookingData));
  // };
const handleBooking = async (gid , selectedSlots , selectdate ) => {
  const bookingData = {
    ground_id: gid,
    date: selectdate,
    slots: selectedSlots,
   
  };

  try {
    const response = await fetch(`http://localhost:5000/book-slot`, {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Specify content type
      },
      body: JSON.stringify(bookingData), // Send bookingData as JSON string
    });

    // if (!response.ok) {
    //   throw new Error('Failed to book slot');
    // }

    const data = await response.json();
    //navigate(`/payment/${gid}`, { state: data });
    if(data){
      setInfo(data.message);
    }
   
    console.log('Bookingsuccessful:', data.message);
    
  } catch (error) {
    console.error('Error booking slot:', error);
  }
};

  // useEffect(() => {
  //   if (bookingId) {
  //     navigate(`/payment/${gid}`, { state: bookingId });
  //   }
  // }, [bookingId, navigate, gid]);
  // const navigate = useNavigate();
  // const gotopayment = () => {
  //   navigate(`/payment/${bookingId}`, { state: bookingId });
  // };
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
              {selectedSlots.length > 0 ? (
                <p>{formatslot(selectedSlots)}</p> // Call formatslot with the entire selectedSlots array
              ) : (
                <p>No slots selected.</p>
              )}
              <p>Please confirm your selection.</p>
              <span>{info}</span>
            </div>
            <div className="modal-footer">
              
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button type="button" className="btn btn-primary"  onClick={()=>{
                handleBooking(gid , selectedSlots , selectdate )
              }}>
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
