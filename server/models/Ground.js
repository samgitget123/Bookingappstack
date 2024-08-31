const mongoose = require('mongoose');

const groundSchema = new mongoose.Schema({
    ground_id: {
        type: String,
        required: true,
        unique: true,
        default: () => 'GND' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    },
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    slots: {
        booked: [String], 
      },
    
});

module.exports = mongoose.model('Ground', groundSchema);
