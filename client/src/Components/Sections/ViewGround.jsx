import React, { useEffect , useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroundDetails } from '../../Features/groundSlice';
import groundImage from '../../Images/turf.jpeg';
import axios from 'axios';
// Helper function to format slot times
const formatSlot = (slot) => {
  const [hours, minutes] = slot.split('.').map(Number);
  const startHours = Math.floor(hours);
  const startMinutes = (minutes === 0) ? 0 : 30;
  const endHours = (startMinutes === 0) ? startHours : startHours + 1;
  const endMinutes = (startMinutes === 0) ? 30 : 0;

  return `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')} - ${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};
// Helper function to reverse format slot from '06:00-06:30' back to '6.0', '6.5', etc.
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

  // const handleBookClick = () => {
  //   navigate(`/booking/${gid}`);
  // };

const handleBookClick = async () => {
  console.log('selectedSlots',selectedSlots);
  const slotsForAPI = selectedSlots.map(reverseFormatSlot);
  if (selectedSlots.length > 0) {
    const bookingData = {
      ground_id: gid,            // Ground ID from route params
      date: new Date().toISOString().slice(0, 10), // Current date in 'YYYY-MM-DD' format
      slots: slotsForAPI,      // Selected slots
      combopack: true            // Assuming you want combopack true, can be dynamic if needed
    };

    try {
      const response = await axios.post('http://localhost:5000/book-slot', bookingData);
      
      if (response.status === 200) {
        console.log('Booking Successful:', response.data);
        navigate(`/booking/${gid}`);
      } else {
        console.log('Booking Failed:', response.data);
        alert('Booking failed, please try again.');
      }
    } catch (error) {
      console.error('Error during booking:', error);
      alert('An error occurred while booking. Please try again later.');
    }
  } else {
    alert('Please select at least one slot to book.');
  }
};
 //Handle slot
 const handleSlotClick = (slot) => {
  if (selectedSlots.includes(slot)) {
    // If the slot is already selected, remove it
    setSelectedSlots(selectedSlots.filter((s) => s !== slot));
  } else {
    // Add the slot to the selected slots
    setSelectedSlots([...selectedSlots, slot]);
  }
};
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ground) return <div>No ground data available</div>;

  // Destructure properties from ground object
  const { name, location, data, slots } = ground;
  const imageUrl = data?.image || groundImage;
  const description = data?.desc || 'No Description';
  const bookedSlots = slots?.booked || [];
  const allSlots = ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '12.5'];
  const bookedSlotTimes = bookedSlots.map(formatSlot);
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot)).map(formatSlot);
 console.log(availableSlots , 'availslots');
 console.log(bookedSlotTimes , 'bookedSlotTimes')
  return (
    <section className='viewgroundsection my-5'>
      <div className="container">
        <div className="row">
          <div className="col-lg-9 col-md-12 col-sm-6 col-xs-12 d-flex flex-column justify-content-between">
            <div>
              <h5>{name || 'No Name'}</h5>
              <p>Location: {location || 'No Location'}</p>
              <p>Description: {description}</p>
              <div className="row">
              <div className="col-md-3 col-sm-6 col-12 mb-3 w-50 text-center">
                  <h6>Available Slots:</h6>
                  <ul className="list-unstyled">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, index) => (
                        <li key={index}>
                            <button
                            type="button"
                            className={`btn btn-sm m-1 ${
                              selectedSlots.includes(slot) ? 'btn-success' : 'btn-primary'
                            }`}
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
                <div className="col-md-3 col-sm-6 col-12 mb-3 w-50 text-center">
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
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 mb-3">
          <div className='mb-3'>
            <button
                type="button"
                className="btn btn-danger btn-lg "
                onClick={handleBookClick}
              >
                Book Now
              </button>
            </div>
            <div className='image-container'>
              <img src={imageUrl} alt="ground" className='ground-image img-fluid' />
            </div>
           
          </div>
        </div>
      </div>
    </section>
  );
};

export default ViewGround;
