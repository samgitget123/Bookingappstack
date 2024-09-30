import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const CardComponent = ({ grounds }) => {
  console.log('Grounds received in component:', grounds);

  // If grounds is not an array, convert it into an array
  //const groundArray = Array.isArray(grounds) ? grounds : [grounds];

  return (
    <Container className="my-4">
      <Row>
        {grounds && grounds.length > 0 ? (
          grounds.map((playground, index) => (
            <Col lg={3} md={6} sm={12} className="mb-4" key={index}>
              <Card className="my-3 p-3 rounded">
                <a href="#">
                  <Card.Img src={playground.data.photo} variant="top" />
                </a>
                <Card.Body>
                  <a href="#">
                    <Card.Title as="div">{playground.data.name}</Card.Title>
                    <Card.Text>
                      <strong>Location: {playground.data.location}</strong>
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
    </Container>
  );
};

export default CardComponent;
