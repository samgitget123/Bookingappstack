import React from 'react'
import Header from './Components/Sections/Header';
import Home from './Components/Sections/Home';
import ViewGround from './Components/Sections/ViewGround';
import Booknow from './Components/Sections/Booknow';
//redux
import { Provider } from 'react-redux';
import { store } from './Store';
//routing
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
//css
import './App.css';
const App = () => {
  return (
    <>
      <Provider store={store}>
        <Router>
        <Header/>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/viewground/:id" element={<ViewGround />}/>
            <Route path="/booking/:bookingid" element={<Booknow />}/>
          </Routes>
        </Router>
      </Provider>
    </>
  )
}

export default App