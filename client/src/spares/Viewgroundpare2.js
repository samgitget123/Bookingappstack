import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroundDetails } from '../../Features/groundSlice';
import groundImage from '../../Images/turf.jpeg';
import axios from 'axios';

// Helper function to format slot times
const formatSlot = (slot) => {
  const [hours, minutes] = slot.split('.').map(Number);
  const startHours = Math.floor(hours);
  const startMinutes = minutes === 0 ? 0 : 30;
  const endHours = startMinutes === 0 ? startHours : startHours + 1;
  const endMinutes = startMinutes === 0 ? 30 : 0;

  return `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')} - ${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

// Helper function to reverse format slot
const reverseFormatSlot = (formattedSlot) => {
  const [startTime] = formattedSlot.split(' - ');
  const [hours, minutes] = startTime.split(':').map(Number);
  return minutes === 0 ? `${hours}.0` : `${hours}.5`;
};

const ViewGround = () => {
  const { gid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groundState = useSelector((state) => state.ground || {});
  const { ground, loading, error } = groundState;
  const [selectedSlots, setSelectedSlots] = useState([]);

  useEffect(() => {
    if (gid) {
      dispatch(fetchGroundDetails(gid)); // Use gid from params
    }
  }, [dispatch, gid]);

  const handleBookClick = async () => {
    const slotsForAPI = selectedSlots.map(reverseFormatSlot);
    if (selectedSlots.length > 0) {
      const bookingData = {
        ground_id: gid,
        date: new Date().toISOString().slice(0, 10),
        slots: slotsForAPI,
        combopack: true,
      };

      try {
        const response = await axios.post('http://localhost:5000/book-slot', bookingData);
        if (response.status === 200) {
          navigate(`/booking/${gid}`);
        } else {
          alert('Booking failed, please try again.');
        }
      } catch (error) {
        alert('An error occurred while booking. Please try again later.');
      }
    } else {
      alert('Please select at least one slot to book.');
    }
  };

  const handleSlotClick = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ground) return <div>No ground data available</div>;

  const { name, location, data, slots } = ground;
  const imageUrl = data?.image || groundImage;
  const description = data?.desc || 'No Description';
  const bookedSlots = slots?.booked || [];
  const allSlots = ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '12.5'];
  const bookedSlotTimes = bookedSlots.map(formatSlot);
  const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot)).map(formatSlot);

  return (
    <section className='viewgroundsection my-5'>
      <div className="container">
        <div className="row">
          {/* Desktop view */}
          <div className="col-lg-9">
            <h5>{name || 'No Name'}</h5>
            <p>Location: {location || 'No Location'}</p>
            <p>Description: {description}</p>
            <div className="d-flex justify-content-between">
              <div className="w-50">
                <h6>Available Slots:</h6>
                <ul className="list-unstyled">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          className={`btn btn-sm m-1 ${selectedSlots.includes(slot) ? 'btn-success' : 'btn-primary'}`}
                          onClick={() => handleSlotClick(slot)}
                        >
                          {slot}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No available slots</li>
                  )}
                </ul>
              </div>
              <div className="w-50">
                <h6>Booked Slots:</h6>
                <ul className="list-unstyled">
                  {bookedSlotTimes.length > 0 ? (
                    bookedSlotTimes.map((slot, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm m-1"
                          disabled
                        >
                          {slot}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No booked slots</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Image for Desktop */}
          <div className="col-lg-3 d-none d-lg-block text-center">
            <img src={imageUrl} alt="ground" className="ground-image img-fluid mb-3" />
          </div>

          {/* Mobile view */}
          <div className="col-12 d-lg-none mb-4">
            <div className="text-center">
              <img src={imageUrl} alt="ground" className="ground-image img-fluid mb-3" />
            </div>
            <h5>{name || 'No Name'}</h5>
            <p>Location: {location || 'No Location'}</p>
            <p>Description: {description}</p>
            <div className="d-flex justify-content-between">
              <div className="w-50 text-center">
                <h6>Available Slots:</h6>
                <ul className="list-unstyled">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          className={`btn btn-sm m-1 ${selectedSlots.includes(slot) ? 'btn-success' : 'btn-primary'}`}
                          onClick={() => handleSlotClick(slot)}
                        >
                          {slot}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No available slots</li>
                  )}
                </ul>
              </div>
              <div className="w-50 text-center">
                <h6>Booked Slots:</h6>
                <ul className="list-unstyled">
                  {bookedSlotTimes.length > 0 ? (
                    bookedSlotTimes.map((slot, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm m-1"
                          disabled
                        >
                          {slot}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No booked slots</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 text-center mt-3">
          <button
            type="button"
            className="btn btn-danger btn-lg w-50"
            onClick={handleBookClick}
          >
            Confirm Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ViewGround;
