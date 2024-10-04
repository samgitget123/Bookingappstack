import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const CardComponent = ({ grounds }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  // Calculate the total number of pages
  const totalPages = Math.ceil(grounds.length / cardsPerPage);

  // Get current cards for pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = grounds.slice(indexOfFirstCard, indexOfLastCard);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const navigate = useNavigate();
  const handleCardClick = (gid) => {
    navigate(`/viewground/${gid}`, { state: gid });
  };
  return (
    <Container className="my-3">
      <Row>
        {currentCards && currentCards.length > 0 ? (
          currentCards.map((playground, index) => (
            <Col lg={3} md={6} sm={12} className="mb-1" key={index}>
              <Card className="my-1 p-3 rounded groundcards" onClick={() => handleCardClick(playground.ground_id)}>
                <a href="#">
                  <Card.Img src={playground.data.photo} variant="top" />
                </a>
                <Card.Body>
                  <a href="#">
                    <Card.Title as="div">{playground.data.name}</Card.Title>
                    <Card.Text>
                    Location: <strong> {playground.data.location}</strong>
                    </Card.Text>
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="col-12">
            <p>No playgrounds available for the selected city or query.</p>
          </Col>
        )}
      </Row>

      {/* Pagination Buttons */}
      <Row className="justify-content-center mt-4">
        <Col md="auto">
          <Button
            className='btn btn-sm btn-primary'
            variant="primary"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
        </Col>
        <Col md="auto">
          <Button
            className='btn btn-sm btn-primary'
            variant="primary"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CardComponent;
