import React from 'react';
import { Container } from 'react-bootstrap';
import Header from './Components/Sections/Header';
import Home from './Components/Sections/Home';
import ViewGround from './Components/Sections/ViewGround';
import Booknow from './Components/Sections/Booknow';
import Payment from './Components/Sections/Payment';
// Redux
import { Provider } from 'react-redux';
import store from './store';
// Routing
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// CSS
import './App.css';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header /> {/* Placed outside of <main> so that header appears on all pages */}
        <main>
          <Container fluid> {/* Wrap the main content */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/viewground/:gid" element={<ViewGround />} />
              <Route path="/payment/:bookingid" element={<Payment />} />
            </Routes>
          </Container>
        </main>
      </Router>
    </Provider>
  );
};

export default App;
