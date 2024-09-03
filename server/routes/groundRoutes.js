const express = require('express');
const router = express.Router();
const Ground = require('../models/Ground');


//create new grounds 
// Route to create a new ground
router.post('/createGround', async (req, res) => {
    const { name, location, photo, description } = req.body;

    // Validate required fields
    if (!name || !location  || !description) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Create a new ground document
        const newGround = new Ground({
            name,
            location,
            photo,
            description
        });

        // Save the new ground document to the database
        await newGround.save();
        
        // Respond with the newly created ground data
        res.status(201).json({
            message: 'Ground created successfully',
            ground: {
                ground_id: newGround.ground_id,
                name: newGround.name,
                location: newGround.location,
                photo: newGround.photo,
                description: newGround.description,
            }
        });
    } catch (error) {
        console.error('Error creating ground:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

//Ground lists based on location
router.get('/grounds', async (req, res) => {
    try {
      const { location } = req.query; // Get the location from query parameters
      console.log('Requested location:', location);
      const grounds = await Ground.find({ location }); // Find grounds by location
      console.log('Available grounds:', grounds);
      const response = grounds.map(ground => ({
        ground_id: ground.ground_id,
        data: {
          name: ground.name,
          location: ground.location,
          photo: ground.photo,
          description: ground.description,
        },
      }));
  
      res.json(response);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
//Get Ground Details By Ground Id
router.get('/ground/:ground_id', async (req, res) => {
    try {
     
      const {ground_id} = req.params;;
      // Find the ground by ground ID
      const ground = await Ground.findOne({ ground_id });
      if (!ground) {
        return res.status(404).json({ message: 'Ground not found' });
      }
  
      // Format the response according to the specified structure
      const response = {
        name: ground.name,
        location: ground.location,
        data: {
          image: ground.photo,
          desc: ground.description,
        },
        slots: {
          booked: ground.slots.booked,
        },
      };
  
      res.json(response);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  

// Route to create a new ground
// router.post('/grounds', async (req, res) => {
//     const { name, city, location, available_slots } = req.body;

//     try {
//         const newGround = new Ground({
//             name,
//             city,
//             location,
//             available_slots
//         });

//         await newGround.save();
//         res.status(201).json(newGround);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// // Route to update available slots for a specific date
// router.put('/grounds/:groundId/slots', async (req, res) => {
//     const { groundId } = req.params;
//     const { date, slots } = req.body;

//     try {
//         // Find the ground by ID
//         const ground = await Ground.findById(groundId);
//         if (!ground) return res.status(404).json({ error: 'Ground not found' });

//         // Check if slots for the given date already exist
//         let dateSlots = ground.available_slots.find(slot => slot.date === date);

//         if (dateSlots) {
//             // Update existing slots
//             dateSlots.slots = slots;
//         } else {
//             // Add new date slots
//             ground.available_slots.push({ date, slots });
//         }

//         await ground.save();

//         res.status(200).json({ message: 'Available slots updated successfully', ground });
//     } catch (error) {
//         console.error('Error updating slots:', error);
//         res.status(500).json({ error: 'Failed to update slots' });
//     }
// });

module.exports = router;
