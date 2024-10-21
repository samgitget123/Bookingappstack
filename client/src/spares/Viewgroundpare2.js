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
  console.log('onclickslot' , slot)
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };
console.log(selectedSlots , 'selectedslots');
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ground) return <div>No ground data available</div>;

  const { name, location, data, slots } = ground;
  const imageUrl = data?.image || groundImage;
  const description = data?.desc || 'No Description';
  const bookedSlots = slots?.booked || [];
 // const allSlots = ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '12.5', '1.0', '1.5', '2.0' , '2.5' , '3.0','3.5','4.0','4.5','5.0','5.5','6.0','6.5','7.0','7.5','8.0','8.5','9.0','10.0','10.5','11.0','11.5','12.0','12.5','13.0','13.5'];
 const allSlots = [
  '12.0', '12.5', // 12:00 AM - 12:30 AM
  '1.0',  '1.5',  // 1:00 AM - 1:30 AM
  '2.0',  '2.5',  // 2:00 AM - 2:30 AM
  '3.0',  '3.5',  // 3:00 AM - 3:30 AM
  '4.0',  '4.5',  // 4:00 AM - 4:30 AM
  '5.0',  '5.5',  // 5:00 AM - 5:30 AM
  '6.0',  '6.5',  // 6:00 AM - 6:30 AM
  '7.0',  '7.5',  // 7:00 AM - 7:30 AM
  '8.0',  '8.5',  // 8:00 AM - 8:30 AM
  '9.0',  '9.5',  // 9:00 AM - 9:30 AM
  '10.0', '10.5', // 10:00 AM - 10:30 AM
  '11.0', '11.5', // 11:00 AM - 11:30 AM
  '12.0', '12.5', // 12:00 PM - 12:30 PM
  '1.0',  '1.5',  // 1:00 PM - 1:30 PM
  '2.0',  '2.5',  // 2:00 PM - 2:30 PM
  '3.0',  '3.5',  // 3:00 PM - 3:30 PM
  '4.0',  '4.5',  // 4:00 PM - 4:30 PM
  '5.0',  '5.5',  // 5:00 PM - 5:30 PM
  '6.0',  '6.5',  // 6:00 PM - 6:30 PM
  '7.0',  '7.5',  // 7:00 PM - 7:30 PM
  '8.0',  '8.5',  // 8:00 PM - 8:30 PM
  '9.0',  '9.5',  // 9:00 PM - 9:30 PM
  '10.0', '10.5', // 10:00 PM - 10:30 PM
  '11.0', '11.5', // 11:00 PM - 11:30 PM
  '12.0', '12.5'  // 12:00 AM - 12:30 AM (next day)
];

  // const bookedSlotTimes = bookedSlots.map(formatSlot);
  // const slotbooks = bookings.map(formatSlot);

  // const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot)).map(formatSlot);
  // const bookedslotsbydate = bookings.map(formatSlot);
 

 
// Helper function to convert slot value to time range with AM/PM
const availableSlots = allSlots.filter((slot) => !bookings.includes(slot)).map(formatSlot);
const bookedslotsbydate = bookings.map(formatSlot);

// const convertSlotToTimeRange = (slot) => {
//   const [hours, half] = slot.split('.').map(Number); // Split hours and half-hour indicator

//   // Calculate start time in 12-hour format
//   const startHour = hours % 12 === 0 ? 12 : hours % 12;
//   const startMinutes = half === 0 ? '00' : '30';
//   const startPeriod = hours < 12 ? 'AM' : 'PM';

//   // Calculate end time in 12-hour format
//   const endHour = half === 0 ? (hours % 12 === 11 ? 12 : (hours + 1) % 12) : startHour;
//   const endMinutes = half === 0 ? '30' : '00';
//   const endPeriod = (half === 0 && hours === 11) || (half === 0 && hours + 1 === 12) || hours + 1 >= 12 ? 'PM' : 'AM';

//   return `${startHour}:${startMinutes} ${startPeriod} - ${endHour}:${endMinutes} ${endPeriod}`;
// };

// const convertSlotToTimeRange = (slot) => {
//   let [hours, half] = slot.split('.').map(Number);

//   // Adjust for 26-hour format (6 AM to 2 AM)
//   if (hours >= 6 && hours <= 11) {
//     // Morning slots (6 AM - 11 AM)
//     const startHour = hours;
//     const startMinutes = half === 0 ? '00' : '30';
//     const endHour = half === 0 ? hours : hours + 1;
//     const endMinutes = half === 0 ? '30' : '00';
//     return `${startHour}:${startMinutes} AM - ${endHour}:${endMinutes} AM`;
//   } else if (hours === 12) {
//     // Noon slots (12 PM)
//     const startMinutes = half === 0 ? '00' : '30';
//     const endHour = half === 0 ? hours : 1;
//     const endMinutes = half === 0 ? '30' : '00';
//     return `12:${startMinutes} PM - ${endHour}:${endMinutes} PM`;
//   } else if (hours >= 1 && hours <= 7) {
//     // Afternoon to early night slots (1 PM - 7 PM)
//     const startHour = hours;
//     const startMinutes = half === 0 ? '00' : '30';
//     const endHour = half === 0 ? hours : hours + 1;
//     const endMinutes = half === 0 ? '30' : '00';
//     return `${startHour}:${startMinutes} PM - ${endHour}:${endMinutes} PM`;
//   } else {
//     // Late night slots (8 PM - 2 AM)
//     const adjustedHours = hours > 7 ? hours - 12 : hours;
//     const startHour = adjustedHours === 0 ? 12 : adjustedHours;
//     const startMinutes = half === 0 ? '00' : '30';
//     const endHour = half === 0 ? startHour : startHour + 1;
//     const endMinutes = half === 0 ? '30' : '00';
//     const startPeriod = hours >= 8 ? 'PM' : 'AM';
//     const endPeriod = (hours === 12 || hours + 1 > 7) ? 'AM' : 'PM';

//     return `${startHour}:${startMinutes} ${startPeriod} - ${endHour}:${endMinutes} ${endPeriod}`;
//   }
// };


const convertSlotToTimeRange = (slot) => {
  let [hours, half] = slot.split('.').map(Number);

  // Initialize variables for time range
  let startHour, startMinutes, endHour, endMinutes, period, endPeriod;

  // Determine the start time
  if (hours >= 0 && hours < 6) {
    // Early morning slots (12 AM - 6 AM)
    startHour = (hours === 0) ? 12 : hours; // Convert 0 to 12 for midnight
    startMinutes = (half === 0) ? '00' : '30';
    period = 'AM';
  } else if (hours >= 6 && hours < 12) {
    // Morning slots (6 AM - 12 PM)
    startHour = hours;
    startMinutes = (half === 0) ? '00' : '30';
    period = 'AM';
  } else if (hours === 12) {
    // Noon slots (12 PM)
    startHour = 12;
    startMinutes = (half === 0) ? '00' : '30';
    period = 'PM';
  } else {
    // Afternoon and evening slots (1 PM - 11 PM)
    startHour = hours - 12; // Convert to 12-hour format
    startMinutes = (half === 0) ? '00' : '30';
    period = 'PM';
  }

  // Determine the end time
  endHour = (half === 0) ? startHour : (startHour === 12 ? 1 : startHour + 1);
  endMinutes = (half === 0) ? '30' : '00';
  endPeriod = (endHour >= 12) ? 'PM' : 'AM'; // Adjust for end time period

  // Correct the end hour if it exceeds 12
  if (endHour > 12) {
    endHour -= 12;
  }

  // Return the formatted time range
  return `${startHour}:${startMinutes} ${period} - ${endHour}:${endMinutes} ${endPeriod}`;
};
  return (
    <section className=' my-2 '>
      <div className="container-fluid">
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
        <div className="row ">
          <div className="col-lg-8 col-md-12 col-sm-12 col-xs-12 col-xlg-6 g-0 secondaryColor rounded">
            {/* Available Slots Section */}
            <div className='mobileconfirmnow d-sm-none d-flex justify-content-center mt-3'>
            <button variant="primary" className="btn btn-primary confirmbtn" onClick={confirnnowClick}>Confirm Now</button>
            </div>
            <div className='d-flex justify-content-evenly text-center pt-3'>
              <div>
                <h6 className='teritoryFont'>Available Slots:</h6>
                <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <li key={index} className='listbox mb-1 ' >
                        <button
                          className={`btn ${selectedSlots.includes(slot) ? 'btn-success' : 'btn-primary'} btn-sm availablebtn`}
                          onClick={() => handleSlotClick(slot)}
                        >
                          {convertSlotToTimeRange(slot)}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className='teritoryFont'>No available slots</li>
                  )}
                </ul>
              </div>
              <div>
                <h6 className='teritoryFont'>Booked Slots:</h6>
                <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row">
                  {bookedslotsbydate.length > 0 ? (
                    bookedslotsbydate.map((slot, index) => (
                      <li key={index}  className='listbox mb-1'>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm "
                          disabled
                        >
                          {convertSlotToTimeRange(slot)} {/* Format if needed */}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className='teritoryFont'>No booked slots</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          {/* Booked Slots Section */}

          {/* Ground Details Card */}
          <div className="col-md-4 groundviewcard my-3 ">
            <div className="card shadow-lg border-0 rounded secondaryColor viewcardFont">
            <div className='mobileconfirmnow  d-flex justify-content-center mt-3'>
            <button variant="primary" className="btn btn-primary confirmbtn" onClick={confirnnowClick}>Confirm Now</button>
            </div>
              <img src={imageUrl} className="card-img-top ground-image img-fluid mb-3" alt={name || 'Ground Image'} />
              <div className="card-body">
                <h5 className="card-title">{name || 'No Name'}</h5>
                <h6 className="card-subtitle mb-2 viewcardFont">Location: {location || 'No Location'}</h6>
                <p className="card-text viewcardFont">{description}</p>
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
