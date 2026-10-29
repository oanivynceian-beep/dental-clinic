import React from 'react';
import styled from 'styled-components';
import { LayoutDashboard, CalendarCheck, CalendarPlus, MessageSquare, BarChart2, Settings2, Stethoscope, Users, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../logo.png';

// Fallback for logo if it doesn't exist

const SidebarContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100px;
  height: 100vh;
  background-color: #4a3728;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  flex-shrink: 0;
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 60px;
    bottom: 0;
    top: auto;
    flex-direction: row;
    padding-top: 0;
    justify-content: flex-start;
    overflow-x: auto;
    overflow-y: hidden;
  }
`;

const SidebarLogo = styled.div`
  width: 50px;
  height: 50px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2.5rem;
  color: #4a3728;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const SidebarItem = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.55)'};
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.12)' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 15%;
    height: 70%;
    width: 4px;
    background: #ffb74d;
    border-radius: 0 4px 4px 0;
    opacity: ${props => props.$active ? 1 : 0};
    transition: opacity 0.2s;
  }

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  @media (max-width: 768px) {
    height: 100%;
    min-width: 55px;
    flex: 1;

    &::before {
      left: 15%;
      top: 0;
      width: 70%;
      height: 3px;
      border-radius: 0 0 4px 4px;
    }
  }
`;

const AdminSidebar = ({ activeIndex = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin123 = sessionStorage.getItem('admin_auth') === 'admin123';
  const isBookNowActive = activeIndex === 'book' || activeIndex === 8 || location.pathname === '/book-now';

  return (
    <SidebarContainer>
      <SidebarLogo onClick={() => navigate('/admin')} title="Dr. A Dental Clinic">
        <img src={logo} alt="Clinic Logo" />
      </SidebarLogo>

      <SidebarItem
        $active={activeIndex === 0 && !isBookNowActive}
        title="Dashboard"
        onClick={() => navigate('/admin')}
      >
        <LayoutDashboard size={26} />
      </SidebarItem>

      <SidebarItem
        $active={activeIndex === 1 && !isBookNowActive}
        title="Appointment Calendar"
        onClick={() => navigate('/admin/calendar')}
      >
        <CalendarCheck size={26} />
      </SidebarItem>

      <SidebarItem
        $active={isBookNowActive}
        title="Book Now (New Appointment)"
        onClick={() => navigate('/book-now')}
      >
        <CalendarPlus size={26} />
      </SidebarItem>

      {isAdmin123 && (
        <>
          <SidebarItem
            $active={activeIndex === 2 && !isBookNowActive}
            title="Calendar Settings"
            onClick={() => navigate('/admin/calendar-settings')}
          >
            <Settings2 size={26} />
          </SidebarItem>
          <SidebarItem
            $active={activeIndex === 3 && !isBookNowActive}
            title="Comments & Feedback"
            onClick={() => navigate('/admin/comments')}
          >
            <MessageSquare size={26} />
          </SidebarItem>
          <SidebarItem
            $active={activeIndex === 4 && !isBookNowActive}
            title="Analytics & Stats"
            onClick={() => navigate('/admin/stats')}
          >
            <BarChart2 size={26} />
          </SidebarItem>
          <SidebarItem
            $active={activeIndex === 5 && !isBookNowActive}
            title="Manage Services"
            onClick={() => navigate('/admin/services')}
          >
            <Stethoscope size={26} />
          </SidebarItem>
          <SidebarItem
            $active={activeIndex === 6 && !isBookNowActive}
            title="Manage Dentists"
            onClick={() => navigate('/admin/dentists')}
          >
            <Users size={26} />
          </SidebarItem>
          <SidebarItem
            $active={activeIndex === 7 && !isBookNowActive}
            title="Manage Articles"
            onClick={() => navigate('/admin/articles')}
          >
            <FileText size={26} />
          </SidebarItem>
        </>
      )}
    </SidebarContainer>
  );
};

export default AdminSidebar;
