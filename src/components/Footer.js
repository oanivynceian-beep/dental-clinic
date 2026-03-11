import React from 'react';
import styled from 'styled-components';
import { Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import logo3 from './logo3.png';

const FooterContainer = styled.footer`
  background-color: #4a3728;
  color: #fff;
  padding: 4rem 5% 2rem;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FooterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FooterNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FooterNavLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.95rem;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }
`;

const ContactItem = styled.div`
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.4;

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-top: 0.2rem;
  }
`;

const BranchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const BranchName = styled.span`
  font-weight: 700;
  color: #fff;
`;

const FooterLogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;

  img {
    width: 120px;
    height: 120px;
    opacity: 0.5;
    object-fit: contain;
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
const CopyrightBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
  padding-top: 2rem;
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Footer = () => (
  <FooterContainer>
    <FooterGrid>
      <FooterColumn>
        <FooterTitle>Follow us</FooterTitle>
        <SocialLinks>
          <SocialIcon href="#" aria-label="Facebook"><Facebook size={20} /></SocialIcon>
          <SocialIcon href="#" aria-label="Instagram"><Instagram size={20} /></SocialIcon>
        </SocialLinks>
      </FooterColumn>
      <FooterColumn>
        <FooterTitle>Navigation</FooterTitle>
        <FooterNav>
          <FooterNavLink href="#">Home</FooterNavLink>
          <FooterNavLink href="#">Services</FooterNavLink>
          <FooterNavLink href="#">Recent Activities</FooterNavLink>
        </FooterNav>
      </FooterColumn>
      <FooterColumn>
        <FooterTitle>Contact</FooterTitle>
        <ContactItem>
          <Phone />
          <BranchInfo>
            <BranchName>Sasa Branch</BranchName>
            <span>012345689 | 012345689</span>
            <BranchName>Matina Branch</BranchName>
            <span>012345689 | 012345689</span>
          </BranchInfo>
        </ContactItem>
        <ContactItem>
          <Clock />
          <span>drdentalclinic@gmail.com</span>
        </ContactItem>
        <ContactItem>
          <MapPin />
          <BranchInfo>
            <BranchName>SASA BRANCH (MAIN)</BranchName>
            <span>2nd Floor, VGM Building, Km. 11, Sasa, Davao City</span>
            <BranchName>MATINA BRANCH</BranchName>
            <span>Door 4, AJV Building, Matina-McArthur Highway, Davao City</span>
          </BranchInfo>
        </ContactItem>
      </FooterColumn>
      <FooterColumn>
        <FooterLogoSection>
          <img src={logo3} alt="Dr. A Dental Clinic Logo" />
          <Logo style={{ color: '#fff', background: 'transparent' }}>
            DR. A DENTAL CLINIC
          </Logo>
        </FooterLogoSection>
      </FooterColumn>
    </FooterGrid>
    <CopyrightBar>
      &copy; {new Date().getFullYear()} Dr. A Dental Clinic. All rights reserved.
    </CopyrightBar>
  </FooterContainer>
);

export default Footer;
