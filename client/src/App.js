import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Weather from './pages/Weather';
import Parking from './pages/Parking';
import Pets from './pages/Pets';
import Businesses from './pages/Businesses';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <AppContainer>
      <Router>
        <Header />
        <Navigation />
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/parking" element={<Parking />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/businesses" element={<Businesses />} />
          </Routes>
        </MainContent>
      </Router>
    </AppContainer>
  );
}

export default App;
