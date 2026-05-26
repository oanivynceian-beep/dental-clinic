import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";

import Home from "./pages/Home";
import Services from "./pages/Services";
import KnowUs from "./pages/KnowUs";
import RecentActivities from "./pages/RecentActivities";
import Contact from "./pages/Contact";
import BookNow from "./pages/Book";
import MyBookings from "./pages/MyBookings";
import Admin from "./pages/Admin";
import AdminComments from "./pages/AdminComments";
import AdminCalendar from "./pages/AdminCalendar";
import AdminStats from "./pages/AdminStats";
import AdminCalendarSettings from "./pages/AdminCalendarSettings";
import AdminServices from "./pages/AdminServices";
import AdminDentists from "./pages/AdminDentists";
import AdminArticles from "./pages/AdminArticles";
import Article from "./pages/Article";
import NotFound from "./pages/NotFound";

function App() {
  const [isUserPaid, setIsUserPaid] = useState(false);

  useEffect(() => {
    // Check if user has paid - retrieve from localStorage
    const userPaymentStatus = localStorage.getItem("userPaid");
    setIsUserPaid(userPaymentStatus === "true");
  }, []);

  // If user hasn't paid, show 404 for all routes
  if (!isUserPaid) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }

  // If user has paid, show all routes
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/know-us" element={<KnowUs />} />
        <Route path="/recent-activities" element={<RecentActivities />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/book-now" element={<BookNow />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/calendar" element={<AdminCalendar />} />
        <Route path="/admin/comments" element={<AdminComments />} />
        <Route path="/admin/stats" element={<AdminStats />} />
        <Route
          path="/admin/calendar-settings"
          element={<AdminCalendarSettings />}
        />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/dentists" element={<AdminDentists />} />
        <Route path="/admin/articles" element={<AdminArticles />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
