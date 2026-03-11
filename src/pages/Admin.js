import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from 'lucide-react';

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
  min-width: 280px;
  background: white;
  border-radius: 25px;
  padding: 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;

  @media (max-width: 768px) {
    min-width: 260px;
    padding: 1.5rem;
  }
`;

const PatientName = styled.h3`
  font-size: 1.75rem;
  font-weight: 900;
  color: #4a3728;
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

const ApproveButton = styled.button`
  background: #6b4226;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 15px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #4a3728;
    transform: translateY(-2px);
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

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Online Bookings');

  const stats = [
    { label: 'Bookings', value: 123 },
    { label: 'Pendings', value: 123 },
    { label: 'Approved', value: 123 },
    { label: 'Comments', value: 123 },
  ];

  const bookings = [
    { name: 'Adrian Albener', service: 'Teeth Removal', date: 'January 01, 2025', time: '12:00' },
    { name: 'Adrian Albener', service: 'Teeth Removal', date: 'January 01, 2025', time: '12:00' },
    { name: 'Adrian Albener', service: 'Teeth Removal', date: 'January 01, 2025', time: '12:00' },
    { name: 'Adrian Albener', service: 'Teeth Removal', date: 'January 01, 2025', time: '12:00' },
  ];

  // Ref for BookingsSlider
  const sliderRef = useRef(null);

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
          <DashboardTitle>Dashboard</DashboardTitle>
          <ClinicName>Dr. A Dental Clinic</ClinicName>
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ArrowButton onClick={handleBack}>
            <ChevronLeft size={32} color="#4a3728" />
          </ArrowButton>
          <BookingsSlider ref={sliderRef}>
            {bookings.map((booking, index) => (
              <BookingCard
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <PatientName>{booking.name}</PatientName>
                
                <BookingDetail>
                  <DetailLabel>Service:</DetailLabel>
                  <DetailValue>{booking.service}</DetailValue>
                </BookingDetail>

                <DateTimeRow>
                  <BookingDetail>
                    <DetailLabel>Date:</DetailLabel>
                    <DetailValue>{booking.date}</DetailValue>
                  </BookingDetail>
                  <BookingDetail>
                    <DetailLabel>Time:</DetailLabel>
                    <DetailValue style={{ fontSize: '1.5rem' }}>{booking.time}</DetailValue>
                  </BookingDetail>
                </DateTimeRow>

                <ApproveButton>Approve</ApproveButton>
              </BookingCard>
            ))}
          </BookingsSlider>
          <ArrowButton onClick={handleNext}>
            <ChevronRight size={32} color="#4a3728" />
          </ArrowButton>
        </div>
      </MainContent>
    </AdminContainer>
  );
};

export default Admin;
