import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Loader2, Lock, LogIn, Eye, EyeOff, LayoutGrid, List, X, Bell } from 'lucide-react';
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
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
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

const ArrowButton = styled.button`
  width: 50px;
  height: 50px;
  background: #e0e0e0;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  align-self: center;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #d0d0d0;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
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

const ListViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled(motion.div)`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 5px 15px rgba(0,0,0,0.03);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
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
  padding: 2rem;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 30px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #f5f5f5;
  border: none;
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

const ToastContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 9999;
`;

const ToastBody = styled(motion.div)`
  background: white;
  border-left: 5px solid #4a3728;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 300px;
`;

const ToastIcon = styled.div`
  background: #fdfaf7;
  color: #4a3728;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClockContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 200px;

  @media (max-width: 1024px) {
    padding: 0.75rem 1rem;
    min-width: 160px;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    min-width: auto;
    border-radius: 15px;
  }
`;

const DateText = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  color: #bcaaa4;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    letter-spacing: 0px;
  }
`;

const TimeText = styled.h2`
  font-size: 1.75rem;
  font-weight: 900;
  color: #4a3728;
  margin: 0;
  font-family: 'Courier New', monospace;
  letter-spacing: -1px;
  line-height: 1;

  @media (max-width: 1024px) {
    font-size: 1.4rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const formatBookingDate = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const ACCOUNTS = {
  'admin123': 'superadmin',
  'matina123': 'matina',
  'sasa123': 'sasa'
};

const playNotificationSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Play a nice melodic chime (C5, E5, G5, C6)
    const playNote = (frequency, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + duration * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(523.25, now, 0.4);       // C5
    playNote(659.25, now + 0.15, 0.4); // E5
    playNote(783.99, now + 0.3, 0.4);  // G5
    playNote(1046.50, now + 0.45, 0.6); // C6
  } catch (err) {
    console.error("Audio play failed:", err);
  }
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Online Bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [docLimit, setDocLimit] = useState(3);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [viewType, setViewType] = useState('slider');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [toastNotifications, setToastNotifications] = useState([]);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  // New state for Edit Mode
  const [settingsSasa, setSettingsSasa] = useState({ blockedDates: [], dateCaps: {}, maxReservationsPerDay: 10, maxReservationsPerSlot: 1 });
  const [settingsMatina, setSettingsMatina] = useState({ blockedDates: [], dateCaps: {}, maxReservationsPerDay: 10, maxReservationsPerSlot: 1 });
  const [dentists, setDentists] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({ date: '', time: '', dentist: '', reasonForEdit: '' });

  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const initialLoadRef = useRef(true);

  const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const bookingCountsByBranch = useMemo(() => {
    const counts = { sasa: { totals: {}, slots: {} }, matina: { totals: {}, slots: {} } };
    bookings.forEach(d => {
      const { date, time, status, branch } = d;
      if (date && status !== 'cancelled' && (branch === 'sasa' || branch === 'matina')) {
        counts[branch].totals[date] = (counts[branch].totals[date] || 0) + 1;
        if (time) {
          if (!counts[branch].slots[date]) counts[branch].slots[date] = {};
          counts[branch].slots[date][time] = (counts[branch].slots[date][time] || 0) + 1;
        }
      }
    });
    return counts;
  }, [bookings]);

  // Realtime date update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (confirmAction?.bookingData) {
      setEditData({
        date: confirmAction.bookingData.date || '',
        time: confirmAction.bookingData.time || '',
        dentist: confirmAction.bookingData.dentist || '',
        reasonForEdit: ''
      });
      setIsEditMode(false);
    }
  }, [confirmAction]);

  const checkScrollPosition = () => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
      setIsAtStart(scrollLeft <= 10);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    }
  };

  useEffect(() => {
    setTimeout(checkScrollPosition, 100);
  }, [bookings, activeTab, docLimit]);

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

    initialLoadRef.current = true;

    const q = query(
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!initialLoadRef.current) {
        const newDocChanges = snapshot.docChanges().filter(change => change.type === 'added');
        if (newDocChanges.length > 0) {
          playNotificationSound();
          
          const newNotifs = newDocChanges.map(change => {
            const data = change.doc.data();
            return {
              id: change.doc.id,
              name: data.fullName || 'New Patient',
              time: Date.now()
            };
          });

          setNotifications(prev => [...newNotifs, ...prev]);
          setToastNotifications(prev => [...prev, ...newNotifs]);
          setUnreadCount(prev => prev + newNotifs.length);

          setTimeout(() => {
            setToastNotifications(prev => prev.filter(n => !newNotifs.find(nn => nn.id === n.id)));
          }, 5000);
        }
      } else {
        initialLoadRef.current = false;
      }

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

    const unsubscribeComments = onSnapshot(collection(db, 'comments'), (snapshot) => {
      setCommentsCount(snapshot.size);
    });

    const unsubSasa = onSnapshot(doc(db, 'calendarSettings', 'sasa'), snap => {
      if (snap.exists()) {
        const d = snap.data();
        setSettingsSasa({
          blockedDates: d.blockedDates || [],
          maxReservationsPerDay: d.maxReservationsPerDay ?? 10,
          maxReservationsPerSlot: d.maxReservationsPerSlot ?? 1,
          dateCaps: d.dateCaps || {}
        });
      }
    });

    const unsubMatina = onSnapshot(doc(db, 'calendarSettings', 'matina'), snap => {
      if (snap.exists()) {
        const d = snap.data();
        setSettingsMatina({
          blockedDates: d.blockedDates || [],
          maxReservationsPerDay: d.maxReservationsPerDay ?? 10,
          maxReservationsPerSlot: d.maxReservationsPerSlot ?? 1,
          dateCaps: d.dateCaps || {}
        });
      }
    });

    const unsubDentists = onSnapshot(collection(db, 'dentists'), snap => {
      setDentists(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribe();
      unsubscribeComments();
      unsubSasa();
      unsubMatina();
      unsubDentists();
    };
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
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setIsAuthorized(false);
    setPassword('');
    sessionStorage.removeItem('admin_auth');
    setShowLogoutConfirm(false);
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

  const handleStatusUpdate = async (id, newStatus, edits = null) => {
    try {
      const booking = bookings.find(b => b.id === id);

      const payload = { status: newStatus };
      if (edits) {
        payload.date = edits.date;
        payload.time = edits.time;
        payload.dentist = edits.dentist;
      }

      await updateDoc(doc(db, 'bookings', id), payload);

      if (booking && booking.email) {
        const isEdited = !!(edits && edits.reasonForEdit);

        const baseMessage = newStatus === 'approved'
          ? "Your appointment has been approved! We look forward to seeing you at our clinic."
          : "We're sorry, but your appointment has been declined. Please contact us if you'd like to reschedule.";

        // Resolve the final booking details (use edits if present)
        const finalDate = edits?.date ? edits.date : booking.date;
        const finalTime = edits?.time ? edits.time : booking.time;
        const finalDentist = edits?.dentist ? edits.dentist : (booking.dentist || 'Any Available Dentist');

        const templateParams = {
          to_name: booking.fullName,
          to_email: booking.email,
          status: newStatus.toUpperCase(),
          date: formatBookingDate(finalDate),
          time: finalTime || 'To be confirmed',
          branch: booking.branch ? (booking.branch.charAt(0).toUpperCase() + booking.branch.slice(1) + ' Branch') : booking.branch,
          reason: booking.reason || 'General Check-up',
          dentist: finalDentist,
          message: baseMessage,
          edit_note: isEdited
            ? `⚠️ Note: Your appointment details have been updated by our admin.\nReason: ${edits.reasonForEdit}`
            : ''
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

  const filteredRoleBookings = bookings.filter(b => {
    if (adminRole === 'superadmin') return true;
    return b.branch && b.branch.toLowerCase() === adminRole;
  });

  const filteredBookings = filteredRoleBookings.filter(b => {
    if (activeTab === 'Online Bookings') return true;
    if (activeTab === 'Pending') return b.status === 'pending';
    if (activeTab === 'Approved') return b.status === 'approved';
    return true;
  });

  const stats = [
    { label: 'Bookings', value: filteredRoleBookings.length },
    { label: 'Pendings', value: filteredRoleBookings.filter(b => b.status === 'pending').length },
    { label: 'Approved', value: filteredRoleBookings.filter(b => b.status === 'approved').length },
    { label: 'Comments', value: commentsCount },
  ];

  // Scroll handler for NextButton
  const handleNext = () => {
    if (sliderRef.current) {
      const isNearEnd = sliderRef.current.scrollLeft + sliderRef.current.clientWidth >= sliderRef.current.scrollWidth - 350;

      if (isNearEnd) {
        setDocLimit(prev => prev + 3);
        setTimeout(() => {
          if (sliderRef.current) {
            sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
          }
        }, 50);
      } else {
        sliderRef.current.scrollBy({ left: 340, behavior: 'smooth' });
      }
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
          <div style={{ minWidth: 0 }}>
            <DashboardTitle>Dashboard</DashboardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
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
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <ClockContainer>
              <DateText>
                {currentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </DateText>
              <TimeText>
                {currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
              </TimeText>
            </ClockContainer>

            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => { setShowNotificationsModal(true); setUnreadCount(0); }} 
                style={{ background: 'white', border: 'none', padding: '1rem', borderRadius: '50%', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Bell size={24} color="#4a3728" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#f44336', color: 'white', fontSize: '0.75rem', fontWeight: 900, width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #f5f5f5' }}
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.div>
                  )}
                </AnimatePresence>
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

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '1rem' }}>
          <Tabs style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
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

          <div style={{ display: 'flex', gap: '0.5rem', background: '#e0e0e0', padding: '0.25rem', borderRadius: '12px' }}>
            <button
              onClick={() => setViewType('slider')}
              style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: viewType === 'slider' ? 'white' : 'transparent', color: viewType === 'slider' ? '#4a3728' : '#9e9e9e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: viewType === 'slider' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setViewType('list')}
              style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', background: viewType === 'list' ? 'white' : 'transparent', color: viewType === 'list' ? '#4a3728' : '#9e9e9e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: viewType === 'list' ? '0 2px 5px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.2s' }}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <EmptyState>
            <Loader2 className="animate-spin mx-auto mb-2" size={32} />
            Loading reservations...
          </EmptyState>
        ) : filteredBookings.length === 0 ? (
          <EmptyState>No reservations found in this category.</EmptyState>
        ) : viewType === 'list' ? (
          <ListViewContainer>
            {filteredBookings.slice(0, docLimit).map((booking, index) => (
              <ListItem
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBooking(booking)}
              >
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4a3728', margin: '0 0 0.25rem 0' }}>
                    {booking.fullName}
                  </h3>
                  <span style={{ fontSize: '0.9rem', color: '#bcaaa4', fontWeight: 600 }}>
                    {formatBookingDate(booking.date)}{booking.time ? ` at ${booking.time}` : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {booking.status === 'pending' && <span style={{ color: '#ff9800', fontWeight: 700, fontSize: '0.9rem' }}>Pending</span>}
                  {booking.status === 'approved' && <span style={{ color: '#4caf50', fontWeight: 700, fontSize: '0.9rem' }}>Approved</span>}
                  {booking.status === 'cancelled' && <span style={{ color: '#f44336', fontWeight: 700, fontSize: '0.9rem' }}>Cancelled</span>}

                  <button style={{ background: '#f5f5f5', border: 'none', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, color: '#4a3728', cursor: 'pointer' }}>
                    View Details
                  </button>
                </div>
              </ListItem>
            ))}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => setDocLimit(prev => prev + 5)}
                disabled={docLimit >= filteredBookings.length}
                style={{
                  background: '#e0e0e0', color: '#4a3728', border: 'none', padding: '0.75rem 2rem', borderRadius: '15px', fontWeight: 800, cursor: docLimit >= filteredBookings.length ? 'not-allowed' : 'pointer', opacity: docLimit >= filteredBookings.length ? 0.3 : 1
                }}
              >
                Load More
              </button>
            </div>
          </ListViewContainer>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <ArrowButton onClick={handleBack} disabled={isAtStart}>
              <ChevronLeft size={32} color="#4a3728" />
            </ArrowButton>
            <BookingsSlider ref={sliderRef} onScroll={checkScrollPosition}>
              {filteredBookings.slice(0, docLimit).map((booking, index) => (
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
                      <DetailValue>{formatBookingDate(booking.date)}{booking.time ? ` at ${booking.time}` : ''}</DetailValue>
                    </BookingDetail>
                    <BookingDetail>
                      <DetailLabel>Branch:</DetailLabel>
                      <DetailValue style={{ textTransform: 'capitalize' }}>{booking.branch}</DetailValue>
                    </BookingDetail>
                  </DateTimeRow>

                  <BookingDetail>
                    <DetailLabel>Dentist:</DetailLabel>
                    <DetailValue style={{ fontSize: '1rem' }}>{booking.dentist || 'Any Available'}</DetailValue>
                  </BookingDetail>

                  <BookingDetail>
                    <DetailLabel>Contact:</DetailLabel>
                    <DetailValue style={{ fontSize: '0.9rem' }}>{booking.phone}</DetailValue>
                  </BookingDetail>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {booking.status === 'pending' && (
                      <>
                        <ActionButton
                          $variant="approve"
                          onClick={() => setConfirmAction({ bookingId: booking.id, action: 'approved', bookingData: booking })}
                        >
                          Approve
                        </ActionButton>
                        <ActionButton
                          $variant="cancel"
                          onClick={() => setConfirmAction({ bookingId: booking.id, action: 'cancelled', bookingData: booking })}
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
            <ArrowButton
              onClick={handleNext}
              disabled={isAtEnd && docLimit >= filteredBookings.length}
            >
              <ChevronRight size={32} color="#4a3728" />
            </ArrowButton>
          </div>
        )}
      </MainContent>

      <AnimatePresence>
        {selectedBooking && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedBooking(null)}
          >
            <ModalContainer
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <CloseButton onClick={() => setSelectedBooking(null)}>
                <X size={20} />
              </CloseButton>

              <div style={{ padding: '3rem 2.5rem' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#4a3728', marginBottom: '2rem' }}>
                  Booking Details
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <BookingDetail>
                    <DetailLabel>Patient Name</DetailLabel>
                    <DetailValue style={{ fontSize: '1.5rem' }}>{selectedBooking.fullName}</DetailValue>
                  </BookingDetail>

                  <BookingDetail>
                    <DetailLabel>Reason</DetailLabel>
                    <DetailValue>{selectedBooking.reason || 'Not specified'}</DetailValue>
                  </BookingDetail>

                  <DateTimeRow>
                    <BookingDetail>
                      <DetailLabel>Date</DetailLabel>
                      <DetailValue>{formatBookingDate(selectedBooking.date)}{selectedBooking.time ? ` at ${selectedBooking.time}` : ''}</DetailValue>
                    </BookingDetail>
                    <BookingDetail>
                      <DetailLabel>Branch</DetailLabel>
                      <DetailValue style={{ textTransform: 'capitalize' }}>{selectedBooking.branch}</DetailValue>
                    </BookingDetail>
                  </DateTimeRow>

                  <BookingDetail>
                    <DetailLabel>Dentist</DetailLabel>
                    <DetailValue>{selectedBooking.dentist || 'Any Available'}</DetailValue>
                  </BookingDetail>

                  <BookingDetail>
                    <DetailLabel>Contact</DetailLabel>
                    <DetailValue>{selectedBooking.phone}</DetailValue>
                  </BookingDetail>

                  {selectedBooking.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <ActionButton
                        $variant="approve"
                        onClick={() => { setSelectedBooking(null); setConfirmAction({ bookingId: selectedBooking.id, action: 'approved', bookingData: selectedBooking }); }}
                      >
                        Approve
                      </ActionButton>
                      <ActionButton
                        $variant="cancel"
                        onClick={() => { setSelectedBooking(null); setConfirmAction({ bookingId: selectedBooking.id, action: 'cancelled', bookingData: selectedBooking }); }}
                      >
                        Cancel
                      </ActionButton>
                    </div>
                  )}
                  {selectedBooking.status === 'approved' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '15px', color: '#4caf50', textAlign: 'center', fontWeight: 800 }}>
                      ✓ Appointment Approved
                    </div>
                  )}
                  {selectedBooking.status === 'cancelled' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#ffebee', borderRadius: '15px', color: '#f44336', textAlign: 'center', fontWeight: 800 }}>
                      ✕ Appointment Cancelled
                    </div>
                  )}
                </div>
              </div>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmAction && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmAction(null)}
            style={{ zIndex: 2000 }}
          >
            <ModalContainer
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }}
            >
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4a3728', marginBottom: '1rem' }}>
                Confirm {confirmAction.action === 'approved' ? 'Approval' : 'Cancellation'}
              </h2>
              <p style={{ color: '#bcaaa4', fontWeight: 600, marginBottom: '2rem' }}>
                Are you sure you want to {confirmAction.action === 'approved' ? 'approve' : 'cancel'} this booking? An email notification will be sent to the patient.
              </p>

              {confirmAction.action === 'approved' && (
                <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#4a3728', cursor: 'pointer', marginBottom: '1rem' }}>
                    <input type="checkbox" checked={isEditMode} onChange={(e) => setIsEditMode(e.target.checked)} />
                    Modify Booking Details (Optional)
                  </label>

                  {isEditMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1887f' }}>Date</span>
                        <input type="date" value={editData.date} onChange={e => setEditData({ ...editData, date: e.target.value })} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1887f' }}>Time</span>
                        <select value={editData.time} onChange={e => setEditData({ ...editData, time: e.target.value })} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}>
                          <option value="">Select Time</option>
                          {TIME_SLOTS.map(t => {
                            const bBranch = confirmAction?.bookingData?.branch;
                            const maxPerSlot = (bBranch === 'sasa' ? settingsSasa : settingsMatina).maxReservationsPerSlot ?? 1;
                            const used = bookingCountsByBranch[bBranch]?.slots?.[editData.date]?.[t] || 0;
                            const isFull = used >= maxPerSlot && t !== confirmAction?.bookingData?.time;
                            return <option key={t} value={t} disabled={isFull}>{t} {isFull ? '(Full)' : ''}</option>;
                          })}
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1887f' }}>Dentist</span>
                        <select value={editData.dentist} onChange={e => setEditData({ ...editData, dentist: e.target.value })} style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}>
                          <option value="">Any Available Dentist</option>
                          {dentists
                            .filter(d => d.branch === confirmAction?.bookingData?.branch || d.branch === 'both')
                            .filter(d => !confirmAction?.bookingData?.reason || confirmAction.bookingData.reason === 'Other' || (d.services && d.services.includes(confirmAction.bookingData.reason)))
                            .map(d => <option key={d.name} value={d.name}>{d.name}</option>)
                          }
                        </select>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a1887f' }}>Reason for Edit (Sent in email)</span>
                        <textarea value={editData.reasonForEdit} onChange={e => setEditData({ ...editData, reasonForEdit: e.target.value })} placeholder="E.g. Dr. Jane is unavailable..." style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '60px' }} required></textarea>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <ActionButton
                  $variant="cancel"
                  onClick={() => setConfirmAction(null)}
                  style={{ marginTop: 0, background: '#f5f5f5', color: '#4a3728' }}
                >
                  Go Back
                </ActionButton>
                <ActionButton
                  $variant={confirmAction.action === 'approved' ? 'approve' : 'cancel'}
                  onClick={() => {
                    const edits = isEditMode ? editData : null;
                    if (isEditMode && !editData.reasonForEdit.trim()) {
                      alert("Please provide a reason for the edit.");
                      return;
                    }
                    handleStatusUpdate(confirmAction.bookingId, confirmAction.action, edits);
                    setConfirmAction(null);
                  }}
                  style={{ marginTop: 0, background: confirmAction.action === 'approved' ? '#4caf50' : '#f44336' }}
                >
                  Confirm
                </ActionButton>
              </div>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
            style={{ zIndex: 2000 }}
          >
            <ModalContainer
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{ maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }}
            >
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4a3728', marginBottom: '1rem' }}>
                Confirm Logout
              </h2>
              <p style={{ color: '#bcaaa4', fontWeight: 600, marginBottom: '2rem' }}>
                Are you sure you want to log out of the dashboard?
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <ActionButton
                  $variant="cancel"
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{ marginTop: 0, background: '#f5f5f5', color: '#4a3728' }}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  $variant="approve"
                  onClick={confirmLogout}
                  style={{ marginTop: 0, background: '#4a3728' }}
                >
                  Logout
                </ActionButton>
              </div>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotificationsModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNotificationsModal(false)}
            style={{ zIndex: 3000, justifyContent: 'flex-end', padding: 0 }}
          >
            <ModalContainer
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              onClick={e => e.stopPropagation()}
              style={{ 
                height: '100vh', 
                maxHeight: '100vh', 
                width: '400px', 
                maxWidth: '100%', 
                borderRadius: '30px 0 0 30px',
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexShrink: 0 }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4a3728', margin: 0 }}>
                    Notifications
                  </h2>
                  <p style={{ margin: '0.25rem 0 0 0', color: '#bcaaa4', fontSize: '0.9rem', fontWeight: 600 }}>Recent booking activity</p>
                </div>
                <CloseButton onClick={() => setShowNotificationsModal(false)} style={{ position: 'static' }}>
                  <X size={20} />
                </CloseButton>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ textAlign: 'center', marginTop: '4rem', color: '#bcaaa4' }}>
                    <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                    <p style={{ fontWeight: 600 }}>No notifications yet.</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} style={{ background: '#fdfaf7', padding: '1.25rem', borderRadius: '20px', display: 'flex', gap: '1rem', alignItems: 'flex-start', border: '1px solid #f0e6e1' }}>
                      <div style={{ background: '#e8f5e9', padding: '0.75rem', borderRadius: '50%', color: '#4caf50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Bell size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 0.25rem 0', color: '#4a3728', fontWeight: 800, fontSize: '1rem' }}>New Booking</h4>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#795548', fontWeight: 600, lineHeight: 1.4 }}>
                          <span style={{ color: '#4a3728', fontWeight: 800 }}>{notif.name}</span> has submitted a new appointment request.
                        </p>
                        <span style={{ fontSize: '0.8rem', color: '#bcaaa4', marginTop: '0.5rem', display: 'block', fontWeight: 700 }}>
                          {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ModalContainer>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <ToastContainer>
        <AnimatePresence>
          {toastNotifications.map(notif => (
            <ToastBody
              key={notif.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <ToastIcon>
                <Bell size={20} />
              </ToastIcon>
              <div>
                <h4 style={{ margin: 0, color: '#4a3728', fontWeight: 800 }}>New Booking Received!</h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#bcaaa4', fontWeight: 600 }}>{notif.name} just booked an appointment.</p>
              </div>
            </ToastBody>
          ))}
        </AnimatePresence>
      </ToastContainer>

    </AdminContainer>
  );
};

export default Admin;
