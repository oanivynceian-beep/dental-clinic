import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import Header from '../components/Header';
import Footer from '../components/Footer';
import HighlightsCarousel from '../components/HighlightsCarousel';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const servicesData = [
  {
    category: "Minor Services",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000",
    items: [
      { name: "Dental Check-up" },
      { name: "Tooth Extraction (Front Tooth)" },
      { name: "Tooth Extraction (Molar Tooth)" },
      { name: "Tooth Restoration" },
      { name: "Oral Prophylaxis" },
      { name: "Fluoride Treatment" }
    ]
  },
  {
    category: "Dentures",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000",
    items: [
      { name: "Removable Dentures (Plastic)" },
      { name: "Removable Dentures (Porcelain)" },
      { name: "Full Denture (Ordinary)" },
      { name: "Full Denture (Ivocap)" },
      { name: "Flexible Dentures (Unilateral)" },
      { name: "Flexible Dentures (Bilateral)" },
      { name: "Fixed Bridge (Ordinary or Plastic)" },
      { name: "Fixed Bridge (Porcelain Fused to Metal - PFM)" },
      { name: "Fixed Bridge (Ceramage)" },
      { name: "Fixed Bridge (Tilite)" },
      { name: "Fixed Bridge (Zirconia)" },
      { name: "Crown or Jacket (Ordinary or Plastic)" },
      { name: "Crown or Jacket (Porcelain Fused to Metal - PFM)" },
      { name: "Crown or Jacket (Ceramage)" },
      { name: "Crown or Jacket (Tilite)" },
      { name: "Crown or Jacket (Zirconia)" }
    ]
  },
  {
    category: "Braces",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1000",
    items: [
      { 
        name: "Braces (Upper and Lower Package)", 
        description: "Inclusions: Free cleaning every 6 months, 1 free restoration (pasta), 1 free extraction (bunot)" 
      },
      { 
        name: "Braces (Upper or Lower only)", 
        description: "Inclusion: Free cleaning every 6 months" 
      },
      { name: "Hawley's Retainers" },
      { name: "Clear Retainers" },
      { name: "Braces Removal" }
    ]
  },
  {
    category: "Veneers",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000",
    items: [
      { name: "Composite or Direct Veneers" },
      { name: "Emax Veneers" },
      { name: "Zirconia Veneers" }
    ]
  },
  {
    category: "Major Services",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1000",
    items: [
      { name: "Teeth Whitening" },
      { name: "Root Canal Treatment" },
      { name: "Diastema Closure" }
    ]
  },
  {
    category: "Major Major",
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1000",
    items: [
      { name: "Implants w/ Zirconia Crown" },
      { name: "Odontectomy (Wisdom Tooth Extraction - Fully Erupted)" },
      { name: "Odontectomy (Wisdom Tooth Extraction - Impacted)" }
    ]
  }
];


// --- Styled Components ---

const HeroSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  display: flex;
  overflow: hidden;

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
`;

const HeroLeftPane = styled.div`
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
    min-height: 45vh;
    width: 100%;
    padding-top: 80px;
  }
`;

const HeroLogo = styled(motion.img)`
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

const HeroRightPane = styled.div`
  flex: 1;
  background-color: #f8f5f2;
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
    min-height: 45vh;
  }
`;

const Headline = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  color: #6a4b3d;
  line-height: 1.1;
  margin-bottom: 20px;
  letter-spacing: -1px;

  @media (max-width: 900px) {
    font-size: 2.2rem;
  }
`;

const CTAButton = styled.button`
  background-color: #6a4b3d;
  color: white;
  border: none;
  padding: 14px 36px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  &:hover {
    background-color: #4e342e;
    animation: none;
    transform: scale(1.1);
  }
`;

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

const ServicesSection = styled.section`
  padding: 5rem 5%;
  background-color: #fff;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCardContainer = styled(motion.div)`
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ServiceImage = styled(motion.img)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.33, 1, 0.68, 1);
`;

const ServiceCard = styled(motion.div)`
  position: relative;
  aspect-ratio: 16 / 9;
  cursor: pointer;
  overflow: hidden;

  &:hover ${ServiceImage} {
    transform: scale(1.1);
  }
`;

const ServiceLabel = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  background-color: #4a3728;
  color: white;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 0.5px;
  box-shadow: 4px 4px 0px rgba(255, 255, 255, 0.2);
  z-index: 2;

  @media (max-width: 640px) {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

const ExpandIcon = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  color: #4a3728;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  z-index: 2;
  transition: transform 0.3s ease;
`;

const ServiceDetails = styled(motion.div)`
  padding: 0;
  background: #faf8f5;
  overflow: hidden;
`;

const ServiceList = styled.ul`
  list-style: none;
  padding: 1.5rem;
  margin: 0;
`;

const ServiceItem = styled.li`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.8rem 0;
  border-bottom: 1px solid #e0e0e0;
  font-size: 0.95rem;
  color: #4a3728;

  &:last-child {
    border-bottom: none;
  }
`;

const ServiceName = styled.span`
  font-weight: 600;
  white-space: pre-line;
`;

const ServiceDescription = styled.span`
  font-size: 0.85rem;
  color: #795548;
  margin-top: 0.25rem;
  white-space: pre-line;
`;

const CommentsSection = styled(motion.section)`
  padding: 5rem 5%;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const Watermark = styled(motion.div)`
  position: absolute;
  font-size: 20rem;
  font-weight: 900;
  opacity: .04;
  pointer-events: none;
  white-space: nowrap;
`;

const CommentsTitle = styled(motion.h2)`
  font-size: 2.5rem;
  color: #4a3728;
  margin-bottom: 2rem;
  text-align: center;
  z-index: 1;
`;

const CommentsContainer = styled(motion.div)`
  width: 100%;
  max-width: 700px;
  background: #e5e7e1;
  border-radius: 40px;
  padding: 3rem;
  z-index: 1;
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);
`;

const CommentForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media(max-width:640px){
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  padding: 1rem;
  border: none;
  border-radius: 10px;
  outline: none;
  background: white;
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: none;
  border-radius: 10px;
  min-height: 140px;
  resize: none;
  background: white;
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  padding: .8rem 2rem;
  border: none;
  border-radius: 10px;
  background: #4a3728;
  color: white;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #3a2b20;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;



const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [expandedService, setExpandedService] = useState(null);

  const toggleService = (index) => {
    if (expandedService === index) {
      setExpandedService(null);
    } else {
      setExpandedService(index);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.comment) {
      setMessage('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        name: formData.name,
        email: formData.email,
        comment: formData.comment,
        timestamp: new Date(),
      });
      setMessage('Thank you! Your comment has been submitted.');
      setFormData({ name: '', email: '', comment: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error adding comment:', error);
      setMessage('Error submitting comment. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <HeroSection>
        <Header />
        <HeroLeftPane>
          <HeroLogo
            src="/logo.png"
            alt="Dr. A Logo"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </HeroLeftPane>
        <HeroRightPane>
          <Headline
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Dedicated to Smiles,<br />
            Anchored in Care
          </Headline>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{ marginTop: '20px' }}
          >
            <CTAButton onClick={() => navigate('/book-now')}>Book Now!</CTAButton>
          </motion.div>
        </HeroRightPane>
      </HeroSection>

      <HighlightsCarousel />

      <ServicesBanner
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <BannerTitle>Services Offered</BannerTitle>
      </ServicesBanner>

      <ServicesSection>
        <ServicesGrid>
          {servicesData.map((service, index) => (
            <ServiceCardContainer key={index} layout>
              <ServiceCard
                onClick={() => toggleService(index)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ServiceImage 
                  src={service.image} 
                  alt={service.category} 
                  referrerPolicy="no-referrer"
                />
                <ServiceLabel>{service.category}</ServiceLabel>
                <ExpandIcon style={{ transform: expandedService === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  {expandedService === index ? "−" : "+"}
                </ExpandIcon>
              </ServiceCard>
              <AnimatePresence>
                {expandedService === index && (
                  <ServiceDetails
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ServiceList>
                      {service.items.map((item, idx) => (
                        <ServiceItem key={idx}>
                          <ServiceName>{item.name}</ServiceName>
                          {item.description && (
                            <ServiceDescription>{item.description}</ServiceDescription>
                          )}
                        </ServiceItem>
                      ))}
                    </ServiceList>
                  </ServiceDetails>
                )}
              </AnimatePresence>
            </ServiceCardContainer>
          ))}
        </ServicesGrid>
      </ServicesSection>

      <CommentsSection
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8 }}
      >
        <Watermark
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.04 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2 }}
        >
          Dr A
        </Watermark>
        <CommentsTitle
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          LET US KNOW YOUR COMMENTS
        </CommentsTitle>
        <CommentsContainer
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <CommentForm onSubmit={handleSubmitComment}>
            <FormRow>
              <Input 
                placeholder="Your Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <Input 
                placeholder="Your Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormRow>
            <TextArea 
              placeholder="Write your comment here..."
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
            />
            {message && <p style={{ color: message.includes('Error') ? 'red' : 'green', textAlign: 'center' }}>{message}</p>}
            <SubmitButton type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Comment'}
            </SubmitButton>
          </CommentForm>
        </CommentsContainer>
      </CommentsSection>

      <Footer />
    </>
  );
};

export default Home;
