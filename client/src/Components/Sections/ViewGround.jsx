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
  console.log('selectedDate', formatDate(selectedDate.toDateString()));

  // Fetch ground details and booked slots
  useEffect(() => {
    if (gid) {
      dispatch(fetchGroundDetails(gid)); // Fetch initial ground details

      const fetchGroundDetailsWithDate = async () => {
        const formattedDate = formatDate(selectedDate);
        console.log('Formatted Date:', formattedDate);
        try {
          const response = await axios.get(`http://localhost:5000/ground/${gid}?date=${formattedDate}`);
          // Assuming response.data.slots is an array of booked slots
          const API = `http://localhost:5000/ground/${gid}?date=${formattedDate}`
          setBookings(response.data.slots || []);
          console.log('bookApi' , API)
          console.log('bookedaval' , bookedSlots);
          console.log('Fetched Booked Slots:', response.data.slots);
        } catch (error) {
          console.error('Error fetching ground details:', error);
        }
      };

      fetchGroundDetailsWithDate();
    }
  }, [dispatch, gid, selectedDate]); // Dependency array includes selectedDate to refetch data on date change

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
    console.log('selectedSlots', selectedSlots);
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

  const handleSlotClick = (slot) => {
    console.log('clickedslot' , slot);
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
  const allSlots = ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '12.5','1.0','1.5','2.0'];
  // const bookedSlotTimes = bookedSlots.map(formatSlot);
  const bookedSlotTimes = bookedSlots.map(formatSlot);
  console.log('Bookedslotes' , bookedSlots);
  const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot)).map(formatSlot);
  console.log('Available:' , availableSlots);
  // Helper function to format slot times (e.g., 6.0 -> 6:00 AM - 6:30 AM)
// const formatslot = (slot) => {
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

//   return `${startTime} - ${endTime}`;
// };
const formatslot = (slots) => {
  if (!slots.length) return '';

  // Function to format time from hours and minutes
  const formatTime = (hours, minutes) => {
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes} ${period}`;
  };

  // Helper function to get start and end time for a single slot
  const getTimeRange = (slot) => {
    const [hours, half] = slot.split('.').map(Number);
    const startMinutes = half === 0 ? '00' : '30';
    const endHours = half === 0 ? hours : hours + 1;
    const endMinutes = half === 0 ? '30' : '00';

    const startTime = formatTime(hours, startMinutes);
    const endTime = formatTime(endHours, endMinutes);

    return { startTime, endTime, startHours: hours, startMinutes, endHours, endMinutes };
  };

  let startRange = getTimeRange(slots[0]); // Starting slot
  let finalRange = startRange; // This will store the final combined range

  // Loop over the rest of the slots
  for (let i = 1; i < slots.length; i++) {
    const currentRange = getTimeRange(slots[i]);

    // If the current slot starts where the previous one ended, extend the range
    if (
      currentRange.startHours === finalRange.endHours &&
      currentRange.startMinutes === finalRange.endMinutes
    ) {
      finalRange.endHours = currentRange.endHours;
      finalRange.endMinutes = currentRange.endMinutes;
    } else {
      // If they are not consecutive, we can print/return the combined range and reset
      break;
    }
  }

  // Combine the final start and end time
  return `${startRange.startTime} - ${finalRange.endTime}`;
};


  return (
    <section className='viewgroundsection my-3'>
      <Container>
        <div>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => {
              if (date) {
                setSelectedDate(date);
              }
            }}
            dateFormat="MMMM d, yyyy"
            className="form-control"
          />

          <p><strong>Selected Date: </strong>{formatDate(selectedDate)}</p>
        </div>
        <Row className="mt-4">
        {/* Available Slots Section */}
        <Col xs={6} md={4} className="text-center">
          <h6>Available Slots:</h6>
          <ul className="list-unstyled">
            {availableSlots.length > 0 ? (
              availableSlots.map((slot, index) => (
                <li key={index}>
                  <Button
                    variant={selectedSlots.includes(slot) ? 'success' : 'primary'}
                    size="sm"
                    className="m-1"
                    onClick={() => handleSlotClick(slot)}
                  >
                      {formatslot(slot)}
                  </Button>
                </li>
              ))
            ) : (
              <li>No available slots</li>
            )}
          </ul>
        </Col>

        {/* Booked Slots Section */}
        <Col xs={6} md={4} className="text-center">
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
                          {formatslot(slot)}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No booked slots</li>
                  )}
          </ul>
        </Col>

        {/* Ground Details Card */}
        <Col md={4} className="groundviewcard">
          <Card>
          <Button variant="primary"  onClick={confirnnowClick}>Confirm Now</Button>
            <Card.Img variant="top" src={imageUrl} className="ground-image img-fluid mb-3" />
            <Card.Body>
              <Card.Title>{name || 'No Name'}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Location: {location || 'No Location'}</Card.Subtitle>
              <Card.Text>{description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>


        {/* BookModal component */}
        <BookModal showModal={showModal} handleCloseModal={handleCloseModal}  selectedSlots={selectedSlots} />

      </Container>
    </section>
  );
};

export default ViewGround;
