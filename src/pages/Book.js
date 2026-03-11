import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import Header from '../components/Header';
import { Calendar, User, Phone, MessageSquare, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fdfaf7;
  position: relative;
  overflow: hidden;
`;

const DecorativeBlob = styled(motion.div)`
  position: absolute;
  width: 400px;
  height: 400px;
  background: ${props => props.$color};
  filter: blur(80px);
  border-radius: 50%;
  z-index: 0;
  opacity: 0.4;
  top: ${props => props.$top || 'auto'};
  left: ${props => props.$left || 'auto'};
  right: ${props => props.$right || 'auto'};
`;


const ContentSection = styled.section`
  padding: 10rem 5% 6rem;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderGroup = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 8vw, 4rem);
  color: #4a3728;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 1rem;
  letter-spacing: -1px;
`;

const Subtitle = styled(motion.p)`
  color: #6d4c41;
  font-size: 1.1rem;
  max-width: 500px;
  margin: 0 auto;
`;

const BookingFormContainer = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 40px;
  padding: 4rem;
  box-shadow: 0 30px 60px rgba(74, 55, 40, 0.08);
  position: relative;

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
    border-radius: 30px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Label = styled.label`
  font-weight: 700;
  color: #4a3728;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 1.25rem;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  outline: none;
  font-size: 1rem;
  color: #4a3728;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    border-color: #4a3728;
    box-shadow: 0 0 0 4px rgba(74, 55, 40, 0.05);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #bcaaa4;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 1.25rem;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  outline: none;
  font-size: 1rem;
  color: #4a3728;
  appearance: none;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a3728;
    transform: translateY(-2px);
  }
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  padding: 1.25rem;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  outline: none;
  font-size: 1rem;
  color: #4a3728;
  min-height: 120px;
  resize: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4a3728;
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled(motion.button)`
  background-color: #4a3728;
  color: white;
  border: none;
  padding: 1.5rem;
  border-radius: 18px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 20px 40px rgba(74, 55, 40, 0.2);
  margin-top: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SuccessOverlay = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  z-index: 10;
  min-height: 400px;
`;

const BookNow = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <PageContainer>
      <Header />
      
      <DecorativeBlob $color="#fce4ec" $top="-100px" $right="-100px" 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      <DecorativeBlob $color="#efebe9" $bottom="-100px" $left="-100px" 
        animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
        transition={{ duration: 25, repeat: Infinity }}
      />

      <ContentSection>
        <HeaderGroup>
          <Title
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Book Now!
          </Title>
          <Subtitle
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Take the first step towards a healthier, brighter smile. 
            Fill out the form below and we'll handle the rest.
          </Subtitle>
        </HeaderGroup>

        <BookingFormContainer
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <Form key="booking-form" onSubmit={handleSubmit}>
                <FormGrid>
                  <FormGroup>
                    <Label><User size={16} /> Full Name</Label>
                    <StyledInput type="text" placeholder="John Doe" required />
                  </FormGroup>
                  <FormGroup>
                    <Label><Mail size={16} /> Email Address</Label>
                    <StyledInput type="email" placeholder="john@example.com" required />
                  </FormGroup>
                </FormGrid>

                <FormGrid>
                  <FormGroup>
                    <Label><Phone size={16} /> Phone Number</Label>
                    <StyledInput type="tel" placeholder="0912 345 6789" required />
                  </FormGroup>
                  <FormGroup>
                    <Label><Calendar size={16} /> Preferred Branch</Label>
                    <StyledSelect required>
                      <option value="">Select a branch</option>
                      <option value="sasa">Sasa Branch (Main)</option>
                      <option value="matina">Matina Branch</option>
                    </StyledSelect>
                  </FormGroup>
                </FormGrid>

                <FormGroup>
                  <Label><Calendar size={16} /> Preferred Date</Label>
                  <StyledInput type="date" required />
                </FormGroup>

                <FormGroup>
                  <Label><MessageSquare size={16} /> Reason for Visit</Label>
                  <StyledTextArea placeholder="Tell us about your dental concern (e.g., Cleaning, Check-up, Braces)..." />
                </FormGroup>

                <SubmitButton
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? "Processing..." : (
                    <>
                      Confirm Appointment <ArrowRight size={20} />
                    </>
                  )}
                </SubmitButton>
              </Form>
            ) : (
              <SuccessOverlay
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 size={80} color="#4a3728" />
                </motion.div>
                <h2 style={{ fontSize: '2rem', color: '#4a3728', marginTop: '1.5rem', fontWeight: 800 }}>
                  Booking Received!
                </h2>
                <p style={{ color: '#6d4c41', marginTop: '1rem', fontSize: '1.1rem' }}>
                  Thank you for choosing Dr. A Dental Clinic. <br />
                  We will contact you shortly to confirm your schedule.
                </p>
                <SubmitButton 
                  onClick={() => setIsSubmitted(false)}
                  style={{ marginTop: '2rem', padding: '1rem 3rem' }}
                >
                  Book Another
                </SubmitButton>
              </SuccessOverlay>
            )}
          </AnimatePresence>
        </BookingFormContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default BookNow;
