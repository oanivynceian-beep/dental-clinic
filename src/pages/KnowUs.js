import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import { Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

// --- Styled Components ---

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const KnowUsSection = styled.section`
  padding: 5rem 5%;
  background-color: #fff;
  text-align: center;
  flex: 1;
`;

const KnowUsTitle = styled.h2`
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: #4a3728;
  font-weight: 800;
  margin-bottom: 4rem;
  text-transform: capitalize;
`;

const KnowUsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const KnowUsImageWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 3 / 4;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  background-color: #f9f9f9;
`;

const KnowUsImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.9;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

// Footer Styled Components (copied from App.tsx to maintain consistency)
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

  svg {
    width: 120px;
    height: 120px;
    opacity: 0.5;
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

const ToothIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 12c.5 0 1-.5 1-1V8c0-2 1-3 3-3s3 1 3 3v3c0 .5.5 1 1 1h1c1.5 0 3 1 3 3v2c0 2-1 3-3 3h-8c-2 0-3-1-3-3v-2c0-2 1.5-3 3-3h1z" />
    <path d="M10 17v2" />
    <path d="M14 17v2" />
  </svg>
);

const KnowUs = () => {
  return (
    <PageContainer>
      <div style={{ background: '#f5f5f5' }}>
        <Header />
      </div>
      <KnowUsSection>
        <KnowUsTitle>Know us</KnowUsTitle>
        <KnowUsGrid>
          <KnowUsImageWrapper>
            <KnowUsImage 
              src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800" 
              alt="Dental Care" 
              referrerPolicy="no-referrer"
            />
          </KnowUsImageWrapper>
          <KnowUsImageWrapper>
            <KnowUsImage 
              src="https://images.unsplash.com/photo-1593022356769-11f762e25ed9?auto=format&fit=crop&q=80&w=800" 
              alt="Dental Mirror" 
              referrerPolicy="no-referrer"
            />
          </KnowUsImageWrapper>
          <KnowUsImageWrapper>
            <KnowUsImage 
              src="https://images.unsplash.com/photo-1597764650032-133adb96771f?auto=format&fit=crop&q=80&w=800" 
              alt="Dentist and Child" 
              referrerPolicy="no-referrer"
            />
          </KnowUsImageWrapper>
        </KnowUsGrid>
      </KnowUsSection>

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
              <FooterNavLink href="/">Home</FooterNavLink>
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
              <ToothIcon size={80} />
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
    </PageContainer>
  );
};

export default KnowUs;
