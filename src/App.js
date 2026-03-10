import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import KnowUs from './pages/KnowUs';
import RecentActivities from './pages/RecentActivities';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/know-us" element={<KnowUs />} />
        <Route path="/recent-activities" element={<RecentActivities />} />
 </Routes>
 </Router>
 );
}

export default App;
