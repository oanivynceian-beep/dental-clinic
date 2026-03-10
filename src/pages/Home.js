import React from 'react';
import styled from 'styled-components';
import { Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { motion } from "framer-motion";
import Header from '../components/Header';

// --- Styled Components ---

// 1. Main Layout Container
const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh; /* Full viewport height */
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  /* Background Image handling */
  background-image: url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  /* Overlay to ensure text readability */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.15); /* Slight white tint overlay */
    z-index: 0;
  }
`;

// 2. Logo Section (needed by footer) - kept minimal here
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

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 800px;
  padding: 0 20px;
  margin-top: -50px; /* Optical adjustment */
`;

const Headline = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem); /* Responsive font size */
  color: #5d4037;
  font-weight: 800;
  margin-bottom: 10px;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(255,255,255,0.5);
`;

const SubHeadline = styled.h2`
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #5d4037;
  font-weight: 800;
  margin-bottom: 40px;
  line-height: 1.2;
  text-shadow: 0 2px 10px rgba(255,255,255,0.5);
`;

// 7. CTA Button with Animation
const CTAButton = styled.button`
  background-color: #5d4037;
  color: white;
  border: none;
  padding: 18px 50px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(93, 64, 55, 0.4);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 10px 25px rgba(93, 64, 55, 0.4);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 15px 35px rgba(93, 64, 55, 0.5);
    }
    100% {
      transform: scale(1);
      box-shadow: 0 10px 25px rgba(93, 64, 55, 0.4);
    }
  }

  &:hover {
    background-color: #4e342e;
    animation: none; /* Stop pulsing on hover for better UX */
    transform: scale(1.1);
  }
`;

// 8. Services Banner
const ServicesBanner = styled(motion.div)`
  width: 100%;
  height: 300px;
  background-image: linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), 
    url('https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=2000');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    height: 200px;
  }
`;

const BannerTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #4a3728;
  font-weight: 700;
  text-align: center;
`;

// 9. Services Section
const ServicesSection = styled.section`
  padding: 5rem 5%;
  background-color: #fff;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ServiceImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ServiceLabel = styled.div`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background-color: #4a3728;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.125rem;
  letter-spacing: 0.5px;
  box-shadow: 5px 5px 0px rgba(255, 255, 255, 0.2);

  @media (max-width: 640px) {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

// 10. Comments Section
const CommentsSection = styled.section`
  padding:5rem 5%;
  background:#fff;
  display:flex;
  flex-direction:column;
  align-items:center;
  position:relative;
`;

const Watermark = styled.div`
  position:absolute;
  font-size:20rem;
  font-weight:900;
  opacity:.04;
  pointer-events:none;
`;

const CommentsTitle = styled.h2`
  font-size:2.5rem;
  color:#4a3728;
  margin-bottom:2rem;
  text-align:center;
`;

const CommentsContainer = styled.div`
  width:100%;
  max-width:700px;
  background:#e5e7e1;
  border-radius:40px;
  padding:3rem;
`;

const CommentForm = styled.form`
  display:flex;
  flex-direction:column;
  gap:1.5rem;
`;

const FormRow = styled.div`
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:1rem;

  @media(max-width:640px){
    grid-template-columns:1fr;
  }
`;

const Input = styled.input`
  padding:1rem;
  border:none;
  border-radius:10px;
  outline:none;
`;

const TextArea = styled.textarea`
  padding:1rem;
  border:none;
  border-radius:10px;
  min-height:140px;
  resize:none;
`;

const SubmitButton = styled.button`
  align-self:flex-end;
  padding:.8rem 2rem;
  border:none;
  border-radius:10px;
  background:#4a3728;
  color:white;
  cursor:pointer;

  &:hover{
    background:#3a2b20;
  }
`;

// Simple Tooth Icon Component
const ToothIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 12c.5 0 1-.5 1-1V8c0-2 1-3 3-3s3 1 3 3v3c0 .5.5 1 1 1h1c1.5 0 3 1 3 3v2c0 2-1 3-3 3h-8c-2 0-3-1-3-3v-2c0-2 1.5-3 3-3h1z" />
    <path d="M10 17v2" />
    <path d="M14 17v2" />
  </svg>
);


// 11. Footer
const FooterContainer = styled(motion.footer)`
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

const CopyrightBar = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 4rem;
  padding-top: 2rem;
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
`;

const Home = () => {
  return (
    <>
      <HeroSection>
        {/* Navigation Bar */}
        <Header />
        {/* Hero Text & CTA */}
        <ContentWrapper
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Headline>Dedicated to Smiles,</Headline>
          <SubHeadline>Anchored in Care</SubHeadline>
          <CTAButton>Book Now!</CTAButton>
        </ContentWrapper>
      </HeroSection>
      {/* Services Banner */}
      <ServicesBanner
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <BannerTitle>Services Offered</BannerTitle>
      </ServicesBanner>
      {/* Services Section */}
      <ServicesSection>
        <ServicesGrid>
          <ServiceCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ServiceImage 
              src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000" 
              alt="General Services" 
              referrerPolicy="no-referrer"
            />
            <ServiceLabel>General Services</ServiceLabel>
          </ServiceCard>
          
          <ServiceCard
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ServiceImage 
              src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000" 
              alt="Specialized Services" 
              referrerPolicy="no-referrer"
            />
            <ServiceLabel>Specialized</ServiceLabel>
          </ServiceCard>
        </ServicesGrid>
      </ServicesSection>
      {/* Comments Section */}
      <CommentsSection>
        <Watermark>Dr A</Watermark>
        <CommentsTitle>LET US KNOW YOUR COMMENTS</CommentsTitle>
        <CommentsContainer>
          <CommentForm>
            <FormRow>
              <Input placeholder="Your Name"/>
              <Input placeholder="Your Email"/>
            </FormRow>
            <TextArea placeholder="Write your comment here..."/>
            <SubmitButton>
              Submit Comment
            </SubmitButton>
          </CommentForm>
        </CommentsContainer>
      </CommentsSection>
      {/* Footer */}
      <FooterContainer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
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
    </>
  );
};

export default Home;
