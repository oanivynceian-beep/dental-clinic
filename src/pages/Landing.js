import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

const TopNav = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: 30px 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;

  @media (max-width: 600px) {
    padding: 20px;
    flex-direction: column;
    gap: 15px;
    background: rgba(255,255,255,0.9);
  }
`;

const BrandText = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #796150;
  letter-spacing: 1px;
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Tagline = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #6a4b3d;
  font-style: italic;

  @media (max-width: 600px) {
    display: none;
  }
`;

const InquireButton = styled(Link)`
  background: #6a4b3d;
  color: white;
  padding: 12px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: background 0.3s ease;

  &:hover {
    background: #4e342e;
  }
`;

const LeftPane = styled.div`
  flex: 1;
  position: relative;
  background-image: url('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.85);
  }

  @media (max-width: 900px) {
    min-height: 50vh;
    width: 100%;
    padding-top: 80px; /* Space for the top nav */
  }
`;

const MainLogo = styled(motion.img)`
  position: relative;
  z-index: 2;
  width: 80%;
  max-width: 700px;

  @media (max-width: 900px) {
    width: 60%;
    max-width: 300px;
    margin-bottom: 20px;
  }
`;

const RightPane = styled.div`
  flex: 1;
  background-color: #F8F5F2; /* Cream color */
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 10%;
  position: relative;

  @media (max-width: 900px) {
    flex: none;
    padding: 60px 8%;
    align-items: center;
    text-align: center;
    min-height: 50vh;
  }
`;

const Heading = styled(motion.h1)`
  font-size: clamp(3rem, 5vw, 4.5rem);
  font-weight: 900;
  color: #6a4b3d;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -1px;

  @media (max-width: 900px) {
    font-size: 2.2rem;
  }
`;

const PartnerSection = styled(motion.div)`
  position: absolute;
  bottom: 50px;
  right: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 900px) {
    position: relative;
    bottom: auto;
    right: auto;
    margin-top: 40px;
    align-items: center;
  }
`;

const PartnerText = styled.div`
  font-size: 14px;
  color: #796150;
  margin-bottom: 10px;
`;

const PartnerLogo = styled.img`
  height: 40px;
  object-fit: contain;
`;

const Landing = () => {
  return (
    <Container>
      <TopNav>
        <BrandText></BrandText>
        <RightNav>
          <Tagline>“Your Smile, Our Passion”</Tagline>
        </RightNav>
      </TopNav>

      <LeftPane>
        <MainLogo
          src="/logo.png"
          alt="Dr. A Logo"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onError={(e) => { e.target.src = '/logo.png' }}
        />
      </LeftPane>

      <RightPane>
        <Heading
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Committed to<br />
          Creating Smiles,<br />
          Grounded in<br />
          Compassionate Care
        </Heading>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.5 }}
           style={{ marginTop: '20px' }}
        >
            <InquireButton to="/home">Inquire Now</InquireButton>
        </motion.div>

        <PartnerSection
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <PartnerText>Official Partner/s:</PartnerText>
          <PartnerLogo
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2G3kKpRfTXAxhO_sHkZ7QJVCOc9EQwBbmMg&s"
            alt="Holy Cross of Davao College"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div style={{ display: 'none', fontWeight: 'bold', color: '#880000', marginTop: '10px' }}>
            HOLY CROSS OF DAVAO COLLEGE
          </div>
        </PartnerSection>
      </RightPane>
    </Container>
  );
};

export default Landing;
