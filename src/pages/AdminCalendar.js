import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Lock, LogIn, Eye, EyeOff, X, Mail, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/Sidebar';
import logo3 from '../components/logo.png';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Inter', sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem 5%;
  overflow-x: hidden;
  margin-left: 100px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 2rem 5% 80px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 900;
  color: #4a3728;
  letter-spacing: -2px;
`;

const ClinicName = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: #4a3728;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const CalendarControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 1rem 2rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    padding: 1rem;
  }
`;

const MonthLabel = styled.h2`
  font-size: 1.5rem;
  font-weight: 900;
  color: #4a3728;
  min-width: 200px;
  text-align: center;

  @media (max-width: 768px) {
    min-width: unset;
    font-size: 1.25rem;
  }
`;

const ControlButton = styled.button`
  background: #fdfaf7;
  border: 1px solid #e0e0e0;
  color: #4a3728;
  width: 45px;
  height: 45px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #4a3728;
    color: white;
  }
`;

const CalendarGrid = styled.div`
  background: white;
  border-radius: 30px;
  padding: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
`;

const DaysHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 1rem;
  text-align: center;
`;

const DayName = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: #bcaaa4;
  text-transform: uppercase;
  padding: 0.5rem;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  /* Ensure a minimum height for the cells to look square-like */
  grid-auto-rows: minmax(100px, auto);

  @media (max-width: 768px) {
    grid-auto-rows: minmax(80px, auto);
    gap: 0.25rem;
  }
`;

const DayCell = styled(motion.div)`
  background: ${props => props.$isToday ? '#fdfaf7' : '#fafafa'};
  border: ${props => props.$isToday ? '2px solid #4a3728' : '1px solid #f0f0f0'};
  border-radius: 15px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  transition: all 0.2s;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  opacity: ${props => props.$isCurrentMonth ? 1 : 0.4};
  pointer-events: ${props => props.$isCurrentMonth ? 'auto' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.05);
    background: #f5f5f5;
  }

  @media (max-width: 768px) {
    padding: 0.25rem;
    border-radius: 8px;
  }
`;

const DayNumber = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${props => props.$isToday ? '#4a3728' : '#757575'};
  margin-bottom: 0.5rem;
  align-self: flex-end;
`;

const CalendarLogo = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin: auto;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  transition: transform 0.2s;
  
  ${DayCell}:hover & {
    transform: scale(1.1) rotate(-5deg);
  }

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

const BookingCount = styled.div`
  font-size: 0.75rem;
  font-weight: 800;
  color: #4a3728;
  background: white;
  border: 1px solid #e0e0e0;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  margin-top: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  @media (max-width: 768px) {
    display: none;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  padding: 2rem;
  background: #fdfaf7;
  border-bottom: 1px solid #f0ebe6;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 900;
  color: #4a3728;
`;

const ModalBody = styled.div`
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const DayBookingCard = styled.div`
  background: ${props => props.$status === 'approved' ? '#f1f8e9' : props.$status === 'cancelled' ? '#ffebee' : '#fff8e1'};
  border: 1px solid ${props => props.$status === 'approved' ? '#dcedc8' : props.$status === 'cancelled' ? '#ffcdd2' : '#ffecb3'};
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: white;
  border: 1px solid #e0e0e0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a3728;
  transition: all 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`;

// Shared Login Styles (Assuming consistency with Admin.js)
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #fdfaf7;
  padding: 2rem;
  text-align: center;
`;

const LoginCard = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 40px;
  box-shadow: 0 20px 50px rgba(74, 55, 40, 0.1);
  max-width: 450px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const LoginButton = styled.button`
  background-color: #4a3728;
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(74, 55, 40, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${p => p.$error ? '#f44336' : '#4a3728'};
  color: white;
  padding: 1.25rem 1.75rem;
  border-radius: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 2000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
  max-width: 400px;

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
`;

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Helper to format date string to Native Date obj for reliable comparison
const parseDateString = (dateString) => {
  if (!dateString) return new Date(NaN);
  const parts = dateString.split('-');
  if (parts.length !== 3) return new Date(NaN);
  return new Date(parts[0], parts[1] - 1, parts[2]);
};

// Check if two Date objects fall on the same calendar day
const isSameDay = (date1, date2) => {
  if (isNaN(date1) || isNaN(date2)) return false;
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
};

const ACCOUNTS = {
  'admin123': 'superadmin',
  'matina123': 'matina',
  'sasa123': 'sasa'
};

const AdminCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayBookings, setDayBookings] = useState([]);
  const [isSendingReminders, setIsSendingReminders] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth && ACCOUNTS[savedAuth]) {
      setIsAuthorized(true);
      setPassword(savedAuth);
      setAdminRole(ACCOUNTS[savedAuth]);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;

    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        parsedDate: parseDateString(doc.data().date)
      }));
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      if (error.code === 'permission-denied') {
        setLoginError("Invalid access key or permissions.");
        setIsAuthorized(false);
        sessionStorage.removeItem('admin_auth');
      }
    });

    return () => unsubscribe();
  }, [isAuthorized, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (ACCOUNTS[password]) {
      setIsAuthorized(true);
      setAdminRole(ACCOUNTS[password]);
      setLoginError('');
      sessionStorage.setItem('admin_auth', password);
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPassword('');
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const jumpToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const jumpToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  const downloadMonthlyExcel = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const monthlyBookings = filteredBookings.filter(b => {
      if (isNaN(b.parsedDate)) return false;
      return b.parsedDate.getFullYear() === currentYear && b.parsedDate.getMonth() === currentMonth;
    });

    if (monthlyBookings.length === 0) {
      showToast('No bookings found for this month.', true);
      return;
    }

    const headers = ['Date', 'Time', 'Patient Name', 'Phone', 'Email', 'Reason', 'Branch', 'Status'];
    const csvRows = [headers.join(',')];

    monthlyBookings.forEach(b => {
      const row = [
        b.date || '',
        b.time || '',
        `"${(b.fullName || '').replace(/"/g, '""')}"`,
        `"${(b.phone || '').replace(/"/g, '""')}"`,
        `"${(b.email || '').replace(/"/g, '""')}"`,
        `"${(b.reason || 'General Check-up').replace(/"/g, '""')}"`,
        `"${(b.branch || '').replace(/"/g, '""')}"`,
        `"${(b.status || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Bookings_${currentYear}_${currentMonth + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter(b => {
    if (adminRole === 'superadmin') return true;
    return b.branch && b.branch.toLowerCase() === adminRole;
  });

  const openDayDetails = (dateObj) => {
    const matchingBookings = filteredBookings.filter(b => isSameDay(b.parsedDate, dateObj));
    if (matchingBookings.length > 0) {
      setSelectedDate(dateObj);
      setDayBookings(matchingBookings);
    }
  };

  const showToast = (msg, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 4000);
  };

  const sendReminderEmails = async () => {
    if (!selectedDate || dayBookings.length === 0) return;
    
    setIsSendingReminders(true);
    try {
      // Format date
      const appointmentDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      const approvedBookings = dayBookings.filter(booking => booking.status === 'approved' || booking.status === 'accepted');

      if (approvedBookings.length === 0) {
        showToast('No accepted/approved bookings found to remind.', true);
        setIsSendingReminders(false);
        return;
      }

      let sentCount = 0;

      // Send email to each patient
      for (const booking of approvedBookings) {
        try {
          const templateParams = {
            email: booking.email,
            name: booking.fullName,
            appointment_date: appointmentDate,
            service_type: booking.reason || 'General Check-up',
            branch: booking.branch.charAt(0).toUpperCase() + booking.branch.slice(1),
            phone: booking.phone,
            message: `Dear ${booking.fullName}, this is a reminder that you have an appointment scheduled on ${appointmentDate} for ${booking.reason || 'a general check-up'} at our ${booking.branch} branch. Please arrive 10 minutes early. If you need to reschedule, please contact us at your earliest convenience.`
          };

          await emailjs.send(
            'service_bo0rrjf',
            'template_dtn7txm',
            templateParams,
            {
              publicKey: 'igsa6b4JaCPQxbNFE',
            }
          );

          sentCount++;
        } catch (error) {
          console.error(`Failed to send email to ${booking.email}:`, error);
        }
      }

      if (sentCount > 0) {
        showToast(`✓ Reminder emails sent to ${sentCount} patient${sentCount !== 1 ? 's' : ''}!`);
      } else {
        showToast(`Failed to send reminders to all patients. Please try again.`, true);
      }
    } catch (error) {
      console.error('Error sending reminders:', error);
      showToast('Error sending reminder emails. Please try again.', true);
    } finally {
      setIsSendingReminders(false);
    }
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const today = new Date();

    const calendarCells = [];

    // Prior Month filler days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      calendarCells.push(
        <DayCell key={`prev-${i}`} $isCurrentMonth={false}>
          <DayNumber>{daysInPrevMonth - i}</DayNumber>
        </DayCell>
      );
    }

    // Current Month days
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const isToday = isSameDay(cellDate, today);
      const cellBookings = filteredBookings.filter(b => isSameDay(b.parsedDate, cellDate));

      calendarCells.push(
        <DayCell
          key={`current-${day}`}
          $isCurrentMonth={true}
          $isToday={isToday}
          onClick={() => openDayDetails(cellDate)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <DayNumber $isToday={isToday}>{day}</DayNumber>
          {cellBookings.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, paddingBottom: '0.5rem' }}>
              <CalendarLogo src={logo3} alt="Reservations" />
              <BookingCount>{cellBookings.length} {cellBookings.length === 1 ? 'Booking' : 'Bookings'}</BookingCount>
            </div>
          )}
        </DayCell>
      );
    }

    // Next Month filler days (to make up an exact multiple of 7)
    const totalCells = calendarCells.length;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      calendarCells.push(
        <DayCell key={`next-${i}`} $isCurrentMonth={false}>
          <DayNumber>{i}</DayNumber>
        </DayCell>
      );
    }

    return calendarCells;
  };

  if (!isAuthorized) {
    return (
      <LoginContainer>
        <LoginCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '50%' }}>
            <Lock size={48} color="#4a3728" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#4a3728', marginBottom: '0.5rem' }}>
              Admin Access
            </h1>
            <p style={{ color: '#bcaaa4', fontWeight: 600 }}>
              Enter the clinic access key to view the schedule.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Access Key"
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  paddingRight: '3.5rem',
                  borderRadius: '15px',
                  border: '2px solid #f0f0f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#bcaaa4' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {loginError && (
              <p style={{ color: '#f44336', fontSize: '0.9rem', fontWeight: 600 }}>
                {loginError}
              </p>
            )}

            <LoginButton type="submit">
              <LogIn size={20} /> Access Schedule
            </LoginButton>
          </form>
        </LoginCard>
      </LoginContainer>
    );
  }

  const formatMonthLabel = (dateObj) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(dateObj);
  };

  return (
    <AdminContainer>
      <AdminSidebar activeIndex={1} />
      <MainContent>
        <Header>
          <div>
            <DashboardTitle>Appointment Calendar</DashboardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <ClinicName>Dr. A Dental Clinic</ClinicName>
              <span style={{ color: '#e0e0e0' }}>|</span>
              <span style={{ fontSize: '0.8rem', color: '#bcaaa4', fontWeight: 600 }}>
                Clinic Access Mode
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f44336',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </Header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={48} color="#4a3728" />
          </div>
        ) : (
          <CalendarGrid>
            <CalendarControls>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <ControlButton onClick={jumpToPreviousMonth}>
                  <ChevronLeft size={24} />
                </ControlButton>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MonthLabel>{formatMonthLabel(currentDate)}</MonthLabel>
                </div>
                <ControlButton onClick={jumpToNextMonth}>
                  <ChevronRight size={24} />
                </ControlButton>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={downloadMonthlyExcel}
                  style={{ background: '#e8f5e9', border: '1px solid #c8e6c9', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800, color: '#2e7d32', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#c8e6c9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#e8f5e9'; }}
                >
                  <Download size={18} />
                  Export CSV
                </button>
                <button
                  onClick={jumpToToday}
                  style={{ background: '#f5f5f5', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 800, color: '#4a3728', cursor: 'pointer' }}
                >
                  Today
                </button>
              </div>
            </CalendarControls>

            <DaysHeader>
              {DAYS_OF_WEEK.map(day => (
                <DayName key={day}>{day}</DayName>
              ))}
            </DaysHeader>

            <DaysGrid>
              {renderCalendarDays()}
            </DaysGrid>
          </CalendarGrid>
        )}
      </MainContent>

      <AnimatePresence>
        {selectedDate && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDate(null)}
          >
            <ModalContainer
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(selectedDate)}
                </ModalTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <LoginButton 
                    onClick={sendReminderEmails} 
                    disabled={isSendingReminders}
                    style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
                  >
                    {isSendingReminders ? (
                      <>
                        <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={18} />
                        Send Reminders
                      </>
                    )}
                  </LoginButton>
                  <CloseButton onClick={() => setSelectedDate(null)}>
                    <X size={24} />
                  </CloseButton>
                </div>
              </ModalHeader>

              <ModalBody>
                {dayBookings.map(b => (
                  <DayBookingCard key={b.id} $status={b.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4a3728', margin: 0 }}>
                        {b.fullName}
                      </h3>
                      <div style={{
                        background: b.status === 'approved' ? '#c8e6c9' : b.status === 'cancelled' ? '#ffcdd2' : '#ffe0b2',
                        color: b.status === 'approved' ? '#2e7d32' : b.status === 'cancelled' ? '#c62828' : '#ef6c00',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 900,
                        textTransform: 'uppercase'
                      }}>
                        {b.status}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#9e9e9e', fontWeight: 700, display: 'block' }}>REASON</span>
                        <span style={{ fontSize: '1.05rem', color: '#4a3728', fontWeight: 600 }}>{b.reason || 'General Check-up'}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#9e9e9e', fontWeight: 700, display: 'block' }}>BRANCH</span>
                        <span style={{ fontSize: '1.05rem', color: '#4a3728', fontWeight: 600, textTransform: 'capitalize' }}>{b.branch}</span>
                      </div>
                      <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: '#9e9e9e', fontWeight: 700, display: 'block' }}>CONTACT</span>
                          <span style={{ fontSize: '1.05rem', color: '#4a3728', fontWeight: 600 }}>{b.phone}</span>
                        </div>
                        {b.time && (
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.75rem', color: '#9e9e9e', fontWeight: 700, display: 'block' }}>TIME</span>
                            <span style={{ fontSize: '1.05rem', color: '#4a3728', fontWeight: 600 }}>{b.time}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </DayBookingCard>
                ))}
              </ModalBody>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <Toast 
            $error={toast.error} 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 50 }}
          >
            {toast.error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            {toast.msg}
          </Toast>
        )}
      </AnimatePresence>

    </AdminContainer>
  );
};

export default AdminCalendar;
