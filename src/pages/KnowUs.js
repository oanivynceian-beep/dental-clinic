import { motion } from "framer-motion";
import styled from 'styled-components';
import Header from '../components/Header';
import { Heart,Users } from 'lucide-react';
import Footer from '../components/Footer';




const PageContainerAnimated = styled.div`
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

const WatermarkContainer = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
  opacity: 0.03;
  pointer-events: none;
  
  svg {
    width: 800px;
    height: 800px;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  color: #4a3728;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 4rem;
  max-width: 900px;
`;

const TextBlock = styled(motion.div)`
  max-width: 800px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const Paragraph = styled.p`
  font-size: 1.25rem;
  line-height: 1.7;
  color: #6d4c41;
  font-weight: 400;
`;

const ActionButton = styled(motion.button)`
  align-self: flex-end;
  background-color: #6b4226;
  color: white;
  border: none;
  padding: 1.25rem 4rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 2rem;
  box-shadow: 0 10px 20px rgba(107, 66, 38, 0.2);
  
  &:hover {
    background-color: #5a3720;
  }
`;

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

const TeamBanner = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background-color: #4a2c1a;
  color: white;
  padding: 1.5rem 3rem;
  border-radius: 0 50px 50px 0;
  margin-top: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
  
  h2 {
    font-size: 1.75rem;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    max-width: 90%;
    padding: 1.25rem 2rem;
    h2 {
      font-size: 1.4rem;
    }
  }
`;
const TeamSection = styled(motion.section)`
  padding: 4rem 5% 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
  background-color: #fff;
`;

const LargeTeamIcon = styled(motion.div)`
  color: #4a2c1a;
  
  svg {
    width: 180px;
    height: 180px;
  }

  @media (max-width: 768px) {
    svg {
      width: 120px;
      height: 120px;
    }
  }
`;


const KnowUs = () => {
  return (
    <>
      {/* Know Us Section First */}
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
      </PageContainer>
      {/* New Animated Section Second */}
      <PageContainerAnimated>
        <Header />
        <WatermarkContainer
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <Heart fill="currentColor" />
        </WatermarkContainer>
        <ContentSection>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Committed to Offering the Finest Care.
          </Title>
          <TextBlock
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Paragraph>
              We provide a wide range of necessary dental services as a patient-centered dental facility. 
              with state-of-the-art diagnostics such as dental CT scans and x-rays, and sophisticated technology.
            </Paragraph>
            <Paragraph>
              For customers of all ages, we offer emergency dental care, providing timely care when you need it most. 
              Our highly skilled dental team, which competes globally, is prepared to offer you outstanding care 
              that is customized to meet your needs. All of our patients will benefit from increased accessibility 
              and convenience thanks to our scalable model.
            </Paragraph>
            <ActionButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </ActionButton>
          </TextBlock>
           <TeamBanner
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2>Get to Know Our Team</h2>
        </TeamBanner>
        </ContentSection>
           <TeamSection>
        <LargeTeamIcon
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8 }}
        >
          <Users strokeWidth={1.5} />
        </LargeTeamIcon>

      
      </TeamSection>
      </PageContainerAnimated>
      <Footer />
    </>
  );
};

export default KnowUs;
