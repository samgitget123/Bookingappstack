const generateBookingID = () => {
    return 'BKG' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };
  
  module.exports = { generateBookingID };
  