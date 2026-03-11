import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from "framer-motion";
import Header from '../components/Header';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fdfaf7;
  position: relative;
  overflow: hidden;
`;

const ContentSection = styled.section`
  padding: 12rem 5% 8rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  color: #4a3728;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 4rem;
  max-width: 900px;
`;

const ContactGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 2rem;
`;

const ContactCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }
`;

const IconWrapper = styled.div`
  width: 60px;
  height: 60px;
  background-color: #fdfaf7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4a3728;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #4a3728;
`;

const CardText = styled.p`
  color: #6d4c41;
  line-height: 1.6;
  font-size: 1rem;
`;

const BranchName = styled.span`
  font-weight: 700;
  display: block;
  margin-bottom: 0.25rem;
`;

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PageContainer>
      <Header />
      <ContentSection>
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Contact Us
        </Title>
        <ContactGrid
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <ContactCard>
            <IconWrapper>
              <Phone size={28} />
            </IconWrapper>
            <CardTitle>Phone</CardTitle>
            <CardText>
              <BranchName>Sasa Branch</BranchName>
              012345689 | 012345689
              <br /><br />
              <BranchName>Matina Branch</BranchName>
              012345689 | 012345689
            </CardText>
          </ContactCard>
          <ContactCard>
            <IconWrapper>
              <Mail size={28} />
            </IconWrapper>
            <CardTitle>Email</CardTitle>
            <CardText>drdentalclinic@gmail.com</CardText>
          </ContactCard>
          <ContactCard>
            <IconWrapper>
              <MapPin size={28} />
            </IconWrapper>
            <CardTitle>Address</CardTitle>
            <CardText>
              <BranchName>SASA BRANCH (MAIN)</BranchName>
              2nd Floor, VGM Building, Km. 11, Sasa, Davao City
              <br /><br />
              <BranchName>MATINA BRANCH</BranchName>
              Door 4, AJV Building, Matina-McArthur Highway, Davao City
            </CardText>
          </ContactCard>
          <ContactCard>
            <IconWrapper>
              <Clock size={28} />
            </IconWrapper>
            <CardTitle>Opening Hours</CardTitle>
            <CardText>
              Monday - Saturday
              <br />
              9:00 AM - 6:00 PM
              <br />
              Sunday: Closed
            </CardText>
          </ContactCard>
        </ContactGrid>
      </ContentSection>
    </PageContainer>
  );
};

export default Contact;
