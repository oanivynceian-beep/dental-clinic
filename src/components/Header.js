import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../logo2.png";

/* ===============================
   Styled Components
================================ */

const NavContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  width: 90%;
  max-width: 1100px;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 15px 30px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 12px 20px;
    width: 95%;
    top: 10px;
    flex-wrap: wrap;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 48px;

    @media (max-width: 768px) {
      height: 36px;
    }
  }
`;

const NavLinks = styled.nav`
  display: flex;
  gap: 40px;
  align-items: center;

  @media (max-width: 768px) {
    display: ${(props) => (props.$isOpen ? "flex" : "none")};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;

    background: white;
    padding: 20px;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

    gap: 10px;
    margin-top: 5px;
  }
`;

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

  &::after {
    content: "";
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

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 15px 0;
    width: 100%;
    text-align: center;

    &::after {
      display: none;
    }
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

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 20px;
    padding: 15px;
    font-size: 16px;
  }
`;

const MenuButton = styled.button`
  display: none;

  background: none;
  border: none;

  color: #5d4037;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const DesktopButton = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileButton = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    width: 100%;
  }
`;

/* ===============================
   Header Component
================================ */

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <NavContainer>
      <Logo>
        <img src={logo} alt="Dr. A Dental Clinic" />
      </Logo>

      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </MenuButton>

      <NavLinks $isOpen={isOpen}>
        <NavItem to="/" onClick={closeMenu}>
          Home
        </NavItem>

        <NavItem to="/services" onClick={closeMenu}>
          Services
        </NavItem>

        <NavItem to="/know-us" onClick={closeMenu}>
          Know Us
        </NavItem>

        <NavItem to="/recent-activities" onClick={closeMenu}>
          Recent Activities
        </NavItem>

        <MobileButton>
          <ContactButton onClick={closeMenu}>Contact Us</ContactButton>
        </MobileButton>
      </NavLinks>

      <DesktopButton>
        <ContactButton>Contact Us</ContactButton>
      </DesktopButton>
    </NavContainer>
  );
};

export default Header;