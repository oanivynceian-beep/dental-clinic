import React from "react";
import styled from "styled-components";
import { Phone, Clock, Instagram, Facebook } from "lucide-react";
import logo3 from "./logo3.png";

/* ================== STYLES ================== */

const FooterContainer = styled.footer`
  background-color: #4a3728;
  color: #fff;
  padding: clamp(3rem, 6vw, 5rem) 5% 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(2rem, 4vw, 3rem);
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LogoColumn = styled(FooterColumn)`
  @media (min-width: 1201px) {
    grid-column: 1 / -1;
    align-items: center;
    text-align: center;
    margin-top: 2rem;
  }
`;

const FooterTitle = styled.h3`
  font-size: clamp(1.4rem, 2vw, 1.7rem);
  font-weight: 700;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const SocialIcon = styled.a`
  background: rgba(255, 255, 255, 0.1);
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: #fff; /* 👈 this is key */

  svg {
    stroke: currentColor; /* ensures lucide uses the color */
  }

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    color: #fff;
  }
`;

const FooterNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 640px) {
    align-items: center;
  }
`;

const FooterNavLink = styled.a`
  color: rgba(255, 255, 255, 0.85);
  font-size: clamp(1rem, 1.2vw, 1.1rem);
  text-decoration: none;

  &:hover {
    color: #fff;
  }
`;

const ContactItem = styled.div`
  display: flex;
  gap: 1rem;
  font-size: clamp(0.95rem, 1.1vw, 1.05rem);

  svg {
    width: 22px;
    height: 22px;
  }

  @media (max-width: 640px) {
    justify-content: center;
    text-align: left;
  }
`;

const BranchInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const BranchName = styled.span`
  font-weight: bold;
`;

const FooterLogoSection = styled.div`
  text-align: center;

  img {
    width: 140px;
    opacity: 0.6;
  }
`;

const Logo = styled.div`
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 0.5rem;
`;

const MapWrapper = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;

  iframe {
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const CopyrightBar = styled.div`
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 0.9rem;
`;

/* ================== COMPONENT ================== */

const Footer = () => {
  return (
    <FooterContainer>
      <FooterGrid>
        {/* Social */}
        <FooterColumn>
          <FooterTitle>Follow Us</FooterTitle>
          <SocialLinks>
            <SocialIcon href="https://www.facebook.com/dr.ayannadentalclinic">
              <Facebook />
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/dr.adentalclinic">
              <Instagram />
            </SocialIcon>
          </SocialLinks>
        </FooterColumn>

        {/* Navigation */}
        <FooterColumn>
          <FooterTitle>Navigation</FooterTitle>
          <FooterNav>
            <FooterNavLink href="#">Home</FooterNavLink>
            <FooterNavLink href="/know-us">Know Us</FooterNavLink>
          </FooterNav>
        </FooterColumn>

        {/* Contact */}
        <FooterColumn>
          <FooterTitle>Contact</FooterTitle>

          <ContactItem>
            <Phone />
            <BranchInfo>
              <BranchName>Sasa Branch</BranchName>
              <span>0960 484 2905</span>
              <BranchName>Matina Branch</BranchName>
              <span>0968 415 3301</span>
            </BranchInfo>
          </ContactItem>

          <ContactItem>
            <Clock />
            <span>drdentalclinic@gmail.com</span>
          </ContactItem>
        </FooterColumn>

        {/* Sasa Map */}
        <FooterColumn>
          <FooterTitle>Sasa Branch</FooterTitle>
          <MapWrapper>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.9221549991385!2d125.6588734756821!3d7.135000615753906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f96942b7d4c04d%3A0xfb759abf3ca3d68c!2sDr.%20A%20Dental%20Clinic!5e0!3m2!1sen!2sph!4v1776504834308!5m2!1sen!2sph"
              loading="lazy"
            />
          </MapWrapper>
        </FooterColumn>

        {/* Matina Map */}
        <FooterColumn>
          <FooterTitle>Matina Branch</FooterTitle>
          <MapWrapper>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.600773618855!2d125.57192387568158!3d7.056106916743607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6441df9ec34c02ad%3A0x6d898c492bff697f!2sDR%20A%20DENTAL%20CLINIC%20-%20MATINA%20BRANCH!5e0!3m2!1sen!2sph!4v1776504772383!5m2!1sen!2sph"
              loading="lazy"
            />
          </MapWrapper>
        </FooterColumn>

        {/* Centered Logo */}
        <LogoColumn>
          <FooterLogoSection>
            <img src={logo3} alt="Dr. A Dental Clinic Logo" />
            <Logo>Dr. A Dental Clinic</Logo>
          </FooterLogoSection>
        </LogoColumn>
      </FooterGrid>

      <CopyrightBar>
        © {new Date().getFullYear()} Dr. A Dental Clinic
      </CopyrightBar>
    </FooterContainer>
  );
};

export default Footer;
