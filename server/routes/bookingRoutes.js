const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Ground = require('../models/Ground');
const {generateBookingID} = require('../Utils');

router.post('/book-slot', async (req, res) => {
    const { ground_id, date, slots , comboPack  } = req.body;
    try {
      // Calculate the price based on the number of slots booked
      const pricePerHour = 800; 
      const slotDurationInHours = 0.5;
      const pricePerSlot = pricePerHour * slotDurationInHours;
      const totalPriceForSlots = slots.length * pricePerSlot;
        
      // Combo pack price
    const comboPackPrice = comboPack ? 80 : 0; // If comboPack is true, add 80 INR

    // Total price calculation
    const totalPrice = totalPriceForSlots + comboPackPrice;

      // Generate a unique booking ID
      const booking_id = generateBookingID();
  
      // Create a new booking entry
      const newBooking = new Booking({
        ground_id,
        date,
        slots,
        comboPack, 
        book: {
          booking_id,
          price: totalPrice,
        },
      });
  
      // Save the booking to the database
      await newBooking.save();
     // Find the ground and update the slots
     const ground = await Ground.findOne({ ground_id });

     if (!ground) {
         return res.status(404).json({ message: 'Ground not found' });
     }
 
     // Check if any of the requested slots are already booked
     const alreadyBookedSlots = ground.slots.booked.filter(slot => slots.includes(slot));

     if (alreadyBookedSlots.length > 0) {
         return res.status(400).json({
             message: 'Requested slots have already been booked',
             bookedSlots: alreadyBookedSlots,
         });
     }

     // Update the booked slots
     const updatedBookedSlots = [...new Set([...ground.slots.booked, ...slots])]; // Ensure uniqueness
     console.log('Updated booked slots:', updatedBookedSlots);

     ground.slots.booked = updatedBookedSlots;

     // Save the updated ground document
     await ground.save();

      // Respond with the booking details
      res.json({
        ground_id,
        date,
        slots,
        comboPack,
        book: {
          booking_id,
          price: totalPrice,
        },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
// router.post('/book', async (req, res) => {
//     const { ground_id, slots, date } = req.body;

//     if (!isValidObjectId(ground_id)) {
//         return res.status(400).json({ message: 'Invalid ground ID' });
//     }

//     if (!date) {
//         return res.status(400).json({ message: 'Date is required for booking' });
//     }

//     try {
//         const ground = await Ground.findById(ground_id);
//         if (!ground) {
//             return res.status(404).json({ message: 'Ground not found' });
//         }

//         // Find the available slots for the given date
//         const groundSlots = ground.available_slots.find(slot => slot.date === date);

//         if (!groundSlots) {
//             return res.status(404).json({ message: 'No slots available for the selected date' });
//         }

//         // Check for existing bookings on the same date
//         const existingBookings = await Booking.find({ ground_id, 'slot.date': date });

//         // Prepare a set of already booked slots for the given date
//         const bookedSlotsSet = new Set(
//             existingBookings.flatMap(booking => booking.slot.map(s => `${s.start}-${s.end}`))
//         );

//         // Validate if the requested slots are available for the given date
//         const requestedSlots = slots.map(slot => `${slot.start}-${slot.end}`);
//         const availableSlotTimes = groundSlots.slots.map(slot => `${slot.start}-${slot.end}`);

//         const areSlotsAvailable = requestedSlots.every(slotTime => 
//             availableSlotTimes.includes(slotTime) && !bookedSlotsSet.has(slotTime)
//         );

//         if (!areSlotsAvailable) {
//             return res.status(400).json({ message: 'One or more requested slots are not available for the selected date' });
//         }

//         // Book the slots for the given date
//         const newBooking = new Booking({
//             ground_id,
//             slot: slots.map(slot => ({ ...slot, date })),  // Include date in each slot
//             status: 'confirmed'
//         });

//         await newBooking.save();

//         // Update ground's available slots
//         ground.available_slots.find(slot => slot.date === date).slots = 
//             groundSlots.slots.filter(slot => !requestedSlots.includes(`${slot.start}-${slot.end}`));

//         await ground.save();

//         // Prepare JSON response including booking ID
//         const response = {
//             booking_id: newBooking._id,
//             ground_id: ground._id,
//             name: ground.name,
//             booking_slot: requestedSlots.join(', '),
//             date: date,
//             confirmation: 'Booking successful',
//             isBooked: true
//         };

//         res.status(201).json(response);
//     } catch (error) {
//         console.error('Error creating booking:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

module.exports = router;
