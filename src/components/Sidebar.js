import React from 'react';
import styled from 'styled-components';
import { LayoutDashboard, CalendarCheck, MessageSquare, BarChart2, Settings2, Stethoscope, Users, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

  @media (max-width: 768px) {
    width: 100%;
    height: 60px;
    bottom: 0;
    top: auto;
    flex-direction: row;
    padding-top: 0;
    justify-content: space-around;
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
  margin-bottom: 3rem;
  color: #4a3728;

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
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 768px) {
    height: 100%;
    flex: 1;
  }
`;

const AdminSidebar = ({ activeIndex = 0 }) => {
  const navigate = useNavigate();
  const isAdmin123 = sessionStorage.getItem('admin_auth') === 'admin123';

  return (
    <SidebarContainer>
      <SidebarLogo>
        <img src={logo} alt="Clinic Logo" />
      </SidebarLogo>
      <SidebarItem $active={activeIndex === 0} onClick={() => navigate('/admin')}>
        <LayoutDashboard size={28} />
      </SidebarItem>
      <SidebarItem $active={activeIndex === 1} onClick={() => navigate('/admin/calendar')}>
        <CalendarCheck size={28} />
      </SidebarItem>

      {isAdmin123 && (
        <>
          <SidebarItem $active={activeIndex === 2} onClick={() => navigate('/admin/calendar-settings')}>
            <Settings2 size={28} />
          </SidebarItem>
          <SidebarItem $active={activeIndex === 3} onClick={() => navigate('/admin/comments')}>
            <MessageSquare size={28} />
          </SidebarItem>
          <SidebarItem $active={activeIndex === 4} onClick={() => navigate('/admin/stats')}>
            <BarChart2 size={28} />
          </SidebarItem>
          <SidebarItem $active={activeIndex === 5} onClick={() => navigate('/admin/services')}>
            <Stethoscope size={28} />
          </SidebarItem>
          <SidebarItem $active={activeIndex === 6} onClick={() => navigate('/admin/dentists')}>
            <Users size={28} />
          </SidebarItem>
          <SidebarItem $active={activeIndex === 7} onClick={() => navigate('/admin/articles')}>
            <FileText size={28} />
          </SidebarItem>
        </>
      )}
    </SidebarContainer>
  );
};

export default AdminSidebar;
