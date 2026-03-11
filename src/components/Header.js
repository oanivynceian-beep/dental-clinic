import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../logo2.png";

/* ===============================
   Styled Components
================================ */

const NavContainer = styled.header`
  position: fixed;
  top: 10px;
  left: 10px;
  right: 10px;

  z-index: 1000;

  max-width: 1100px;
  margin: 0 auto;

  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  border-radius: 12px;
  padding: 14px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  box-shadow: 0 6px 20px rgba(0,0,0,0.08);

  transition: all 0.3s ease;

  @media (max-width: 768px) {
    left: 8px;
    right: 8px;
    padding: 12px 16px;
  }

  @media (max-width: 480px) {
    left: 6px;
    right: 6px;
    padding: 10px 14px;
  }
`;
const Logo = styled.div`
  display: flex;
  align-items: center;

  img {
    height: 46px;

    @media (max-width: 768px) {
      height: 38px;
    }

    @media (max-width: 480px) {
      height: 32px;
    }
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 36px;

  @media (max-width: 900px) {
    gap: 24px;
  }

  @media (max-width: 768px) {
    position: absolute;

    top: 100%;
    left: 0;
    right: 0;

    display: ${(props) => (props.$isOpen ? "flex" : "none")};
    flex-direction: column;

    background: white;

    padding: 20px;
    gap: 14px;

    border-radius: 0 0 12px 12px;
    box-shadow: 0 12px 25px rgba(0, 0, 0, 0.1);

    animation: slideDown 0.25s ease;

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  @media (max-width: 400px) {
    padding: 18px 12px;
  }
`;

const NavItem = styled(Link)`
  text-decoration: none;
  color: #5d4037;
  background: transparent;
  border-radius: 6px;
  font-weight: 500;
  font-size: 15px;
  position: relative;
  cursor: pointer;
  transition: color 0.3s, background 0.3s;

  &:hover {
    color: #3e2723;
    background: ${(props) => (props.$active ? "#6d4c41" : "#f5e9e5")};
  }

  &::after {
    content: "";
    position: absolute;
    width: ${(props) => (props.$active ? "100%" : "0")};
    height: 2px;
    bottom: -5px;
    left: 0;
    background: #6d4c41;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
    font-size: 18px;
    padding: 14px 0;
    &::after {
      display: block;
      width: ${(props) => (props.$active ? "100%" : "0")};
      height: 2px;
      bottom: 0;
      left: 0;
      background: #6d4c41;
      transition: width 0.3s ease;
    }
  }

  @media (max-width: 400px) {
    font-size: 17px;
  }
`;

const ContactButton = styled(Link)`
  display: inline-block;
  background: #5d4037;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.25s ease;

  &:hover {
    background: #4e342e;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(93, 64, 55, 0.35);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 15px;
    padding: 14px;
    font-size: 16px;
    text-align: center;
  }
`;

const MenuButton = styled.button`
  display: none;

  background: none;
  border: none;

  color: #5d4037;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setIsOpen(false);

  return (
    <NavContainer>
      <Logo>
        <img src={logo} alt="Dr. A Dental Clinic" />
      </Logo>

      <MenuButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </MenuButton>

      <NavLinks $isOpen={isOpen}>
        <NavItem to="/" onClick={closeMenu} $active={location.pathname === "/"}>
          Home
        </NavItem>

        <NavItem to="/services" onClick={closeMenu} $active={location.pathname === "/services"}>
 
        </NavItem>

        <NavItem to="/know-us" onClick={closeMenu} $active={location.pathname === "/know-us"}>
          Know Us
        </NavItem>

        <NavItem to="/recent-activities" onClick={closeMenu} $active={location.pathname === "/recent-activities"}>
        
        </NavItem>

        <MobileButton>
          <ContactButton to="/contact" onClick={closeMenu}>
            Contact Us
          </ContactButton>
        </MobileButton>
      </NavLinks>

      <DesktopButton>
        <ContactButton to="/contact">Contact Us</ContactButton>
      </DesktopButton>
    </NavContainer>
  );
};

export default Header;