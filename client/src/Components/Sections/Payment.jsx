import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';
const Payment = () => {
 const {bookingId} = useParams;

  return (
    <div>Payment : {bookingId}</div>
  )
}

export default Payment