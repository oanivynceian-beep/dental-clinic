import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

import AdminSidebar from '../components/Sidebar';

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
  margin-bottom: 3rem;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 4rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 30px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 20px;
  }
`;

const StatLabel = styled.span`
  font-size: 1.1rem;
  color: #bcaaa4;
  font-weight: 600;
`;

const StatValue = styled.span`
  font-size: clamp(2.5rem, 10vw, 4rem);
  font-weight: 900;
  color: #4a3728;
  line-height: 1;
  align-self: flex-end;
`;

const Tabs = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const Tab = styled.div`
  font-size: 1.1rem;
  font-weight: 800;
  color: ${props => props.$active ? '#4a3728' : '#bcaaa4'};
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  white-space: nowrap;

  &::after {
    content: '';
    position: absolute;
    bottom: -1.1rem;
    left: 0;
    width: ${props => props.$active ? '100%' : '0'};
    height: 3px;
    background: #4a3728;
    transition: width 0.3s ease;
  }
`;

const BookingsSlider = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0 3rem;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const BookingCard = styled(motion.div)`
  min-width: 320px;
  background: white;
  border-radius: 25px;
  padding: 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 768px) {
    min-width: 280px;
    padding: 1.5rem;
  }
`;

const PatientName = styled.h3`
  font-size: 1.75rem;
  font-weight: 900;
  color: #4a3728;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const BookingDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: #bcaaa4;
  text-transform: uppercase;
`;

const DetailValue = styled.span`
  font-size: 1.1rem;
  font-weight: 800;
  color: #4a3728;
`;

const DateTimeRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ActionButton = styled.button`
  background: ${props => props.$variant === 'cancel' ? '#f44336' : '#6b4226'};
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  flex: 1;

  &:hover {
    background: ${props => props.$variant === 'cancel' ? '#d32f2f' : '#4a3728'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ArrowButton = styled.div`
  width: 50px;
  height: 50px;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  align-self: center;
  transition: all 0.2s;

  &:hover {
    background: #d0d0d0;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  background: white;
  border-radius: 30px;
  width: 100%;
  color: #bcaaa4;
  font-weight: 600;
`;

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
`;

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Online Bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth === 'admin123') {
      setIsAuthorized(true);
      setPassword('admin123');
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
        ...doc.data()
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
    if (password === 'admin123') {
      setIsAuthorized(true);
      setLoginError('');
      sessionStorage.setItem('admin_auth', 'admin123');
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
              Enter the clinic access key to view the dashboard.
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
              <LogIn size={20} /> Access Dashboard
            </LoginButton>
          </form>
        </LoginCard>
      </LoginContainer>
    );
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const booking = bookings.find(b => b.id === id);
      
      await updateDoc(doc(db, 'bookings', id), {
        status: newStatus
      });

      if (booking && booking.email) {
        const templateParams = {
          to_name: booking.fullName,
          to_email: booking.email,
          status: newStatus.toUpperCase(),
          date: booking.date,
          branch: booking.branch,
          reason: booking.reason || 'General Check-up',
          message: newStatus === 'approved' 
            ? "Your appointment has been approved! We look forward to seeing you at our clinic." 
            : "We're sorry, but your appointment has been declined. Please contact us if you'd like to reschedule."
        };

        // Send email using EmailJS
        emailjs
          .send(
            'service_bo0rrjf',
            'template_w7emoyl',
            templateParams,
            {
              publicKey: 'igsa6b4JaCPQxbNFE',
            }
          )
          .then(
            () => {
              console.log('Email notification sent successfully to:', booking.email);
            },
            (error) => {
              console.error('Failed to send email notification:', error);
              alert(`Status updated but email failed to send. Check console for details.`);
            }
          );
      } else {
        console.warn('Booking or email not found for id:', id);
      }
    } catch (error) {
      console.error("Error updating status: ", error);
      alert('Failed to update booking status. Please try again.');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'Online Bookings') return true;
    if (activeTab === 'Pending') return b.status === 'pending';
    if (activeTab === 'Approved') return b.status === 'approved';
    return true;
  });

  const stats = [
    { label: 'Bookings', value: bookings.length },
    { label: 'Pendings', value: bookings.filter(b => b.status === 'pending').length },
    { label: 'Approved', value: bookings.filter(b => b.status === 'approved').length },
    { label: 'Comments', value: 0 },
  ];

  // Scroll handler for NextButton
  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  // Scroll handler for BackButton
  const handleBack = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  return (
    <AdminContainer>
      <AdminSidebar activeIndex={0} />
      <MainContent>
        <Header>
          <div>
            <DashboardTitle>Dashboard</DashboardTitle>
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

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatLabel>{stat.label}</StatLabel>
              <StatValue>{stat.value}</StatValue>
            </StatCard>
          ))}
        </StatsGrid>

        <Tabs>
          {['Online Bookings', 'Pending', 'Approved'].map(tab => (
            <Tab 
              key={tab} 
              $active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </Tabs>

        {loading ? (
          <EmptyState>
            <Loader2 className="animate-spin mx-auto mb-2" size={32} />
            Loading reservations...
          </EmptyState>
        ) : filteredBookings.length === 0 ? (
          <EmptyState>No reservations found in this category.</EmptyState>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ArrowButton onClick={handleBack}>
              <ChevronLeft size={32} color="#4a3728" />
            </ArrowButton>
            <BookingsSlider ref={sliderRef}>
              {filteredBookings.map((booking, index) => (
                <BookingCard
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PatientName title={booking.fullName}>{booking.fullName}</PatientName>
                  
                  <BookingDetail>
                    <DetailLabel>Reason:</DetailLabel>
                    <DetailValue>{booking.reason || 'Not specified'}</DetailValue>
                  </BookingDetail>

                  <DateTimeRow>
                    <BookingDetail>
                      <DetailLabel>Date:</DetailLabel>
                      <DetailValue>{booking.date}</DetailValue>
                    </BookingDetail>
                    <BookingDetail>
                      <DetailLabel>Branch:</DetailLabel>
                      <DetailValue style={{ textTransform: 'capitalize' }}>{booking.branch}</DetailValue>
                    </BookingDetail>
                  </DateTimeRow>

                  <BookingDetail>
                    <DetailLabel>Contact:</DetailLabel>
                    <DetailValue style={{ fontSize: '0.9rem' }}>{booking.phone}</DetailValue>
                  </BookingDetail>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {booking.status === 'pending' && (
                      <>
                        <ActionButton 
                          $variant="approve" 
                          onClick={() => handleStatusUpdate(booking.id, 'approved')}
                        >
                          Approve
                        </ActionButton>
                        <ActionButton 
                          $variant="cancel" 
                          onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                        >
                          Cancel
                        </ActionButton>
                      </>
                    )}
                    {booking.status === 'approved' && (
                      <DetailValue style={{ color: '#4caf50', textAlign: 'center', width: '100%', padding: '1rem' }}>
                        ✓ Approved
                      </DetailValue>
                    )}
                    {booking.status === 'cancelled' && (
                      <DetailValue style={{ color: '#f44336', textAlign: 'center', width: '100%', padding: '1rem' }}>
                        ✕ Cancelled
                      </DetailValue>
                    )}
                  </div>
                </BookingCard>
              ))}
            </BookingsSlider>
            <ArrowButton onClick={handleNext}>
              <ChevronRight size={32} color="#4a3728" />
            </ArrowButton>
          </div>
        )}
      </MainContent>
    </AdminContainer>
  );
};

export default Admin;
