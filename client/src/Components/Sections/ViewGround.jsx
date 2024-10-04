import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroundDetails } from '../../Features/groundSlice';
import groundImage from '../../Images/turf.jpeg';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//Modal
import BookModal from '../Modals/BookModal';
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
// Helper function to format date to "YYYY-MM-DD"
const formatDate = (date) => {
  if (!(date instanceof Date)) {
    // Attempt to convert the date to a Date object
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ViewGround = () => {
  const { gid } = useParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const groundState = useSelector((state) => state.ground || {});
  const { ground, loading, error } = groundState;
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
 
  // Fetch ground details and booked slots
  // useEffect(() => {
  //   if (gid) {
  //     dispatch(fetchGroundDetails(gid)); // Fetch initial ground details

  //     const fetchGroundDetailsWithDate = async () => {
  //       const formattedDate = formatDate(selectedDate);
  //       console.log('Formatted Date:', formattedDate);
  //       try {
  //         const response = await axios.get(`http://localhost:5000/ground/${gid}?date=${formattedDate}`);
  //         // Assuming response.data.slots is an array of booked slots
  //         const API = `http://localhost:5000/ground/${gid}?date=${formattedDate}`
  //         setBookings(response.data.slots || []);
  //         console.log('bookApi', API)
  //         console.log('bookedaval', bookedSlots);
  //         console.log('Fetched Booked Slots:', response.data.slots);
  //       } catch (error) {
  //         console.error('Error fetching ground details:', error);
  //       }
  //     };

  //     fetchGroundDetailsWithDate();
  //   }
  // }, [dispatch, gid, selectedDate]); // Dependency array includes selectedDate to refetch data on date change
  // useEffect(() => {
  //   if (gid) {
  //     dispatch(fetchGroundDetails(gid));
  //     fetchGroundDetailsWithDate(formatDate(selectedDate));
  //   }
  // }, [dispatch, gid, selectedDate]);
  

  // const fetchGroundDetailsWithDate = async (formattedDate) => {
  //   try {
      
  //     const response = await axios.get(`http://localhost:5000/ground/${gid}?date=${formattedDate}`);
     
  //     setBookings(response.data.slots.booked || []);
  //   } catch (error) {
  //     console.error('Error fetching ground details:', error);
  //   }
  // };
  // const handleDateChange = (date) => {
  //   if (date) {
  //     setSelectedDate(date);
  //   }
  // };
  useEffect(() => {
    if (gid) {
      dispatch(fetchGroundDetails(gid));
      fetchGroundDetailsWithDate(formatDate(selectedDate));
    }
  }, [dispatch, gid, selectedDate]);
  
  const fetchGroundDetailsWithDate = async (formattedDate) => {
    try {
      const response = await axios.get(`http://localhost:5000/ground/${gid}?date=${formattedDate}`);
      setBookings(response.data.slots.booked || []);
    } catch (error) {
      console.error('Error fetching ground details:', error);
    }
  };

  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Example function to format slot
  const formatSlot = (slot) => {
    // Implement your formatSlot function here
    return slot; // Example: return formatted slot
  };

  const confirnnowClick = () => {
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };
  const handleBookClick = async () => {
   
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
        
          navigate(`/booking/${gid}`);
        } else {
         
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
  const allSlots = ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '12.5', '1.0', '1.5', '2.0'];
  // const bookedSlotTimes = bookedSlots.map(formatSlot);
  // const slotbooks = bookings.map(formatSlot);

  // const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot)).map(formatSlot);
  // const bookedslotsbydate = bookings.map(formatSlot);
 

 
// Helper function to convert slot value to time range with AM/PM
const availableSlots = allSlots.filter((slot) => !bookings.includes(slot)).map(formatSlot);
const bookedslotsbydate = bookings.map(formatSlot);

const convertSlotToTimeRange = (slot) => {
  const [hours, half] = slot.split('.').map(Number); // Split hours and half-hour indicator

  // Calculate start time in 12-hour format
  const startHour = hours % 12 === 0 ? 12 : hours % 12;
  const startMinutes = half === 0 ? '00' : '30';
  const startPeriod = hours < 12 ? 'AM' : 'PM';

  // Calculate end time in 12-hour format
  const endHour = half === 0 ? (hours % 12 === 11 ? 12 : (hours + 1) % 12) : startHour;
  const endMinutes = half === 0 ? '30' : '00';
  const endPeriod = (half === 0 && hours === 11) || (half === 0 && hours + 1 === 12) || hours + 1 >= 12 ? 'PM' : 'AM';

  return `${startHour}:${startMinutes} ${startPeriod} - ${endHour}:${endMinutes} ${endPeriod}`;
};

  return (
    <section className='viewgroundsection my-3'>
      <div className="container">
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              if (date) {
                setSelectedDate(date);
                fetchGroundDetailsWithDate(formatDate(date));
              }
            }}
            dateFormat="MMMM d, yyyy"
            className="form-control"
          />

          <p><strong>Selected Date: </strong>{formatDate(selectedDate)}</p>
        </div>
        <div className="row">
          <div className="col-lg-6 col-md-12 col-sm-12 col-xs-12 col-xlg-6">
            {/* Available Slots Section */}
            <div className='d-flex justify-content-evenly text-center'>
              <div>
                <h6>Available Slots:</h6>
                <ul className="list-unstyled">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <li key={index}>
                        <button
                          className={`btn ${selectedSlots.includes(slot) ? 'btn-success' : 'btn-primary'} btn-sm m-1`}
                          onClick={() => handleSlotClick(slot)}
                        >
                          {convertSlotToTimeRange(slot)}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No available slots</li>
                  )}
                </ul>
              </div>
              <div>
                <h6>Booked Slots:</h6>
                <ul className="list-unstyled">
                  {bookedslotsbydate.length > 0 ? (
                    bookedslotsbydate.map((slot, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm m-1"
                          disabled
                        >
                          {convertSlotToTimeRange(slot)} {/* Format if needed */}
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
          {/* Booked Slots Section */}



          {/* Ground Details Card */}
          <div className="col-md-4 groundviewcard">
            <div className="card">
              <button variant="primary" className="btn btn-primary" onClick={confirnnowClick}>Confirm Now</button>
              <img src={imageUrl} className="card-img-top ground-image img-fluid mb-3" alt={name || 'Ground Image'} />
              <div className="card-body">
                <h5 className="card-title">{name || 'No Name'}</h5>
                <h6 className="card-subtitle mb-2 text-muted">Location: {location || 'No Location'}</h6>
                <p className="card-text">{description}</p>
              </div>
            </div>
          </div>


        </div>


        {/* BookModal component */}
        <BookModal showModal={showModal} handleCloseModal={handleCloseModal} selectedSlots={selectedSlots} selectdate={formatDate(selectedDate)} />
      </div>
    </section>

  );
};

export default ViewGround;
