import React from 'react'
import {Container , Row , Col} from 'react-bootstrap';
const Footer = () => {
    const currentYear = new Date().getFullYear;
    console.log('year : ' , currentYear);
  return (
   <footer>
        <Container>
            <Row>
                <Col className='text-center py-3'>
                    <p>Book My Ground &copy; {new Date().getFullYear}</p>
                </Col>
            </Row>
        </Container>
   </footer>
  )
}

export default Footer