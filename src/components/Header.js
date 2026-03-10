import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import log from '../logo2.png';

// Styled Components

const NavItem = styled(Link)`
  text-decoration: none;
  color: #5d4037;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #3e2723;
  }

  /* Underline effect on hover */
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: #6d4c41;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const ContactButton = styled.button`
  background-color: #5d4037;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;

  &:hover {
    background-color: #4e342e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(93, 64, 55, 0.3);
  }
`;

const NavContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 90%;
  max-width: 1100px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;

  &:hover {
    background-color: #6d4c41;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

    ${NavItem} {
      color: white;

      &:hover {
        color: #f5f5f5;
      }

      &::after {
        background-color: white;
      }
    }

    ${ContactButton} {
      background-color: white;
      color: #6d4c41;

      &:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
      }
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #4a3728;
  text-transform: uppercase;
  letter-spacing: 1px;

  svg {
    width: 32px;
    height: 32px;
    color: #6b4226;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 40px;
  align-items: center;

  @media (max-width: 768px) {
    display: none; /* Simple responsive hide for mobile in this demo */
  }
`;

const Header = () => {
  return (
    <NavContainer>
      <Logo>
        <img src={log} alt="Dr. A Dental Clinic" style={{height: '48px'}} />
      </Logo>

      <NavLinks>
        <NavItem to="/">Home</NavItem>
        <NavItem to="/services">Services</NavItem>
        <NavItem to="/know-us">Know us</NavItem>
        <NavItem to="/recent-activities">Recent Activities</NavItem>
      </NavLinks>

      <ContactButton>Contact Us</ContactButton>
    </NavContainer>
  );
};

export default Header;