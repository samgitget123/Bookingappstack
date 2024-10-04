import React from 'react';
import { useLocation } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const data = location.state; // Retrieve data from the state

  return (
    <div>
      Payment Data: {data ? JSON.stringify(data) : 'No data received'}
    </div>
  );
};

export default Payment;
