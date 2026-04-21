import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import Header from '../components/Header';
import { Search, AlertCircle, Calendar, MapPin, User, Loader2, XCircle } from 'lucide-react';
import { db } from './firebase';
import { collection, query, getDocs, where, or, updateDoc, doc } from 'firebase/firestore';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fdfaf7;
  position: relative;
  overflow: hidden;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`;

const DecorativeBlob = styled(motion.div)`
  position: absolute;
  width: 400px;
  height: 400px;
  background: ${props => props.$color};
  filter: blur(80px);
  border-radius: 50%;
  z-index: 0;
  opacity: 0.4;
  top: ${props => props.$top || 'auto'};
  left: ${props => props.$left || 'auto'};
  right: ${props => props.$right || 'auto'};
  bottom: ${props => props.$bottom || 'auto'};
`;

const ContentSection = styled.section`
  padding: 10rem 5% 6rem;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderGroup = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2rem, 6vw, 3.5rem);
  color: #4a3728;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1rem;
  letter-spacing: -1px;
`;

const Subtitle = styled(motion.p)`
  color: #6d4c41;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchContainer = styled(motion.div)`
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(74, 55, 40, 0.08);
  margin-bottom: 3rem;
  border: 1px solid rgba(0,0,0,0.05);
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 1.25rem;
  background: #fdfaf7;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  color: #4a3728;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a3728;
    background: white;
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #bcaaa4;
  }
`;

const SearchButton = styled(motion.button)`
  background-color: #4a3728;
  color: white;
  border: none;
  padding: 0 2rem;
  border-radius: 16px;
  font-size: 1.05rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 10px 20px rgba(74, 55, 40, 0.15);

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 600px) {
    padding: 1.25rem;
  }
`;

const BookingsList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BookingCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(74, 55, 40, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const BookingStatusInfo = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 0.5rem 1.5rem;
  background: ${props => props.$status === 'approved' ? '#e8f5e9' : props.$status === 'cancelled' ? '#ffebee' : '#fff3e0'};
  color: ${props => props.$status === 'approved' ? '#2e7d32' : props.$status === 'cancelled' ? '#c62828' : '#ef6c00'};
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  border-bottom-left-radius: 20px;
  letter-spacing: 1px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const InfoLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: #a1887f;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 1.05rem;
  font-weight: 700;
  color: #4a3728;
`;

const ActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
  min-width: 150px;

  @media (max-width: 768px) {
    align-items: stretch;
    width: 100%;
  }
`;

const CancelButton = styled(motion.button)`
  background: white;
  border: 2px solid #ef5350;
  color: #ef5350;
  padding: 0.8rem 1.5rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  width: 100%;

  &:hover {
    background: #ef5350;
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: white;
    color: #ef5350;
  }
`;

const EmptyState = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 15px 35px rgba(74, 55, 40, 0.05);
  border: 1px solid rgba(0,0,0,0.05);
  width: 100%;
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #fdfaf7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #bcaaa4;
`;

const MyBookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [cancellingId, setCancellingId] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      // Allow searching by email or phone
      const q = query(
        collection(db, 'bookings'),
        or(
          where('email', '==', searchTerm.trim()),
          where('phone', '==', searchTerm.trim())
        )
      );

      const querySnapshot = await getDocs(q);
      const fetchedBookings = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by creation date descending
      fetchedBookings.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setBookings(fetchedBookings);
    } catch (error) {
      console.error("Error searching bookings: ", error);
      alert("Failed to search bookings. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(id);
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'cancelled'
      });

      // Update local state
      setBookings(prev => prev.map(booking =>
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      ));

      alert("Booking has been successfully cancelled.");
    } catch (error) {
      console.error("Error cancelling booking: ", error);
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const getBranchLabel = (val) => {
    if (val === 'sasa') return 'Sasa Branch';
    if (val === 'matina') return 'Matina Branch';
    return val;
  };

  return (
    <PageContainer>
      <Header />

      <DecorativeBlob $color="#e0f2f1" $top="-150px" $right="-100px"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />
      <DecorativeBlob $color="#f3e5f5" $bottom="-100px" $left="-100px"
        animate={{ scale: [1.1, 1, 1.1], rotate: [0, -90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      <ContentSection>
        <HeaderGroup>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            My Bookings
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Enter your email or phone number to view your appointments.
            You can cancel pending appointments here.
          </Subtitle>
        </HeaderGroup>

        <SearchContainer
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <form onSubmit={handleSearch}>
            <InputGroup>
              <StyledInput
                type="text"
                placeholder="Enter Email Address or Phone Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                required
              />
              <SearchButton
                type="submit"
                disabled={isSearching}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSearching ? <><Spinner size={20} /> Searching</> : <><Search size={20} /> Search</>}
              </SearchButton>
            </InputGroup>
          </form>
        </SearchContainer>

        <AnimatePresence mode="wait">
          {hasSearched && !isSearching && bookings.length === 0 && (
            <EmptyState
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <EmptyIcon>
                <AlertCircle size={40} />
              </EmptyIcon>
              <h3 style={{ color: '#4a3728', fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>No Bookings Found</h3>
              <p style={{ color: '#bcaaa4', fontWeight: 500 }}>
                We couldn't find any bookings matching that email or phone number.
              </p>
            </EmptyState>
          )}

          {bookings.length > 0 && (
            <BookingsList
              key="list"
              as={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {bookings.map((booking, idx) => (
                <BookingCard
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <BookingStatusInfo $status={booking.status || 'pending'}>
                    {booking.status || 'Pending'}
                  </BookingStatusInfo>

                  <InfoGrid>
                    <InfoItem>
                      <InfoLabel><User size={14} /> Patient Name</InfoLabel>
                      <InfoValue>{booking.fullName}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel><Calendar size={14} /> Date & Time</InfoLabel>
                      <InfoValue>{formatDate(booking.date)} at {booking.time || 'N/A'}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel><MapPin size={14} /> Branch</InfoLabel>
                      <InfoValue>{getBranchLabel(booking.branch)}</InfoValue>
                    </InfoItem>

                    <InfoItem>
                      <InfoLabel><AlertCircle size={14} /> Service / Reason</InfoLabel>
                      <InfoValue style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {booking.reason || 'General Check-up'}
                      </InfoValue>
                    </InfoItem>
                  </InfoGrid>

                  <ActionsContainer>
                    {(!booking.status || booking.status === 'pending') && (
                      <CancelButton
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={cancellingId === booking.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {cancellingId === booking.id ? (
                          <><Spinner size={16} /> Cancelling</>
                        ) : (
                          <><XCircle size={16} /> Cancel Booking</>
                        )}
                      </CancelButton>
                    )}
                    {(booking.status === 'approved' || booking.status === 'cancelled') && (
                      <div style={{ padding: '0.8rem', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.85rem', color: '#a1887f', fontWeight: 600 }}>
                          Action unavailable
                        </span>
                      </div>
                    )}
                  </ActionsContainer>
                </BookingCard>
              ))}
            </BookingsList>
          )}
        </AnimatePresence>
      </ContentSection>
    </PageContainer>
  );
};

export default MyBookings;
