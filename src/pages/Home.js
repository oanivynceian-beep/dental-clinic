import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import Header from '../components/Header';
import Footer from '../components/Footer';
import HighlightsCarousel from '../components/HighlightsCarousel';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const servicesData = [
  {
    category: "Veneers",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Comparison_-_Crowns_and_veneer.jpg",
    items: [
      { name: "VENEERS COMPOSITE OR DIRECT - 4500 per tooth" },
      { name: "VENEERS EMAX - 20000 per tooth" },
      { name: "VENEERS ZIRCONIA - 25000 per tooth" }
    ]
  },
  {
    category: "Dentures",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Mr_M%27s_Complete_Denture2.jpg",
    items: [
      { name: "REMOVABLE DENTURE - Plastic - 2000 per missing tooth" },
      { name: "REMOVABLE DENTURE - Porcelain - 2500 per missing tooth" },
      { name: "FULL DENTURE (ORDINARY) - 13000 per arch" },
      { name: "IVOCAP - 25000 per arch" }
    ]
  },
  {
    category: "Retainers",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Retainer.jpg",
    items: [
      { name: "HAWLEY'S RETAINERS - 7000 per arch" },
      { name: "CLEAR RETAINERS - 10000 per arch" }
    ]
  },
  {
    category: "Major Services",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/db/GI_at_Guantanamo_visits_the_dentist.JPG",
    items: [
      { name: "REMOVABLE DENTURE" },
      { name: "FIXED/CROWN BRIDGES" },
      { name: "VENEERS" },
      { name: "RETAINERS" },
      { name: "TEETH WHITENING" },
      { name: "GINGIVECTOMY (GUM CONTOURING)" },
      { name: "ODONTECTOMY (WISDOM TOOTH EXTRACTION)" },
      { name: "FRENECTOMY" },
      { name: "ROOT CANAL TREATMENT" },
      { name: "IMPLANTS WITH ZIRCONIA" },
      { name: "DIASTEMA CLOSURE" }
    ]
  },
  {
    category: "Minor Services",
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Dental_Hygienist.jpg",
    items: [
      { name: "FLUORIDE APPLICATION" },
      { name: "TOOTH RESTORATION (PASTA)" },
      { name: "TOOTH EXTRACTION (BUNOT)" },
      { name: "ORAL PROPHYLAXIS (CLEANING)" },
      { name: "TEMPORARY CROWNS" }
    ]
  },
  {
    category: "Braces",
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Orthobraces_-_dental_braces_lower_upper_jaw.jpg",
    items: [
      { name: "BRACES PACKAGE - Upper and Lower - 45000" },
      { name: "BRACES PACKAGE - Upper or Lower only - 25000" }
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
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('/hero-image.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transform: scale(1.15);
    z-index: 0;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.85);
    z-index: 1;
  }
`;

const TopWave = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 250px;
  z-index: 2;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 250' preserveAspectRatio='none'%3E%3Cpath fill='%236a4b3d' fill-opacity='0.1' d='M600,0 C900,150 1100,50 1440,150 L1440,0 Z' /%3E%3Cpath fill='%236a4b3d' fill-opacity='0.15' d='M800,0 C1000,80 1200,30 1440,80 L1440,0 Z' /%3E%3C/svg%3E");
  background-size: 100% 100%;
  pointer-events: none;
`;

const BottomWave = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 250px;
  z-index: 2;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 250' preserveAspectRatio='none'%3E%3Cpath fill='%236a4b3d' fill-opacity='0.1' d='M0,100 C300,250 500,100 800,250 L0,250 Z' /%3E%3Cpath fill='%236a4b3d' fill-opacity='0.15' d='M0,170 C200,220 400,170 600,250 L0,250 Z' /%3E%3C/svg%3E");
  background-size: 100% 100%;
  pointer-events: none;
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 20px;
`;

const BackgroundLogo = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  opacity: 0.1;
  z-index: 2;
  pointer-events: none;

  @media (max-width: 768px) {
    width: 350px;
  }
`;

const MainHeadline = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 900;
  color: #4a3728;
  line-height: 1.15;
  letter-spacing: -0.5px;
  margin-bottom: 40px;
  margin-top: 60px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.9);

  @media (max-width: 900px) {
    font-size: 2.5rem;
  }
  @media (max-width: 400px) {
    font-size: 2rem;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 6px 20px rgba(106, 75, 61, 0.35), 0 0 0 0 rgba(106, 75, 61, 0.4);
  }
  50% {
    transform: scale(1.04);
    box-shadow: 0 6px 25px rgba(106, 75, 61, 0.45), 0 0 0 15px rgba(106, 75, 61, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 6px 20px rgba(106, 75, 61, 0.35), 0 0 0 0 rgba(106, 75, 61, 0);
  }
`;

const HeroButton = styled(motion.button)`
  background: linear-gradient(135deg, #8d6e63 0%, #5d4037 100%);
  color: white;
  border: none;
  padding: 18px 54px;
  border-radius: 50px;
  font-weight: 800;
  font-size: 1.4rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  animation: ${pulse} 2s infinite ease-in-out;
  transition: background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #7b5e53 0%, #4e342e 100%);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 25px rgba(106, 75, 61, 0.5);
    animation: none;
  }

  @media (max-width: 900px) {
    padding: 14px 38px;
    font-size: 1.15rem;
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
  align-items: start;
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
  const [services, setServices] = useState(servicesData);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'services'));
        if (!querySnapshot.empty) {
          const categoryMapping = {
            minor: { title: "Minor Services", image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Dental_Hygienist.jpg" },
            major: { title: "Major Services", image: "https://upload.wikimedia.org/wikipedia/commons/d/db/GI_at_Guantanamo_visits_the_dentist.JPG" },
            dentures: { title: "Dentures", image: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Mr_M%27s_Complete_Denture2.jpg" },
            braces: { title: "Braces", image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Orthobraces_-_dental_braces_lower_upper_jaw.jpg" },
            veneers: { title: "Veneers", image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Comparison_-_Crowns_and_veneer.jpg" },
            retainers: { title: "Retainers", image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Retainer.jpg" }
          };

          const grouped = {};
          querySnapshot.docs.forEach(doc => {
            const data = doc.data();
            const type = data.type || 'other';
            if (!grouped[type]) {
              grouped[type] = [];
            }
            grouped[type].push({ name: data.name, description: data.description });
          });

          const fetchedServices = Object.keys(grouped).map(type => ({
            category: categoryMapping[type]?.title || type,
            image: categoryMapping[type]?.image || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1000",
            items: grouped[type]
          }));

          if (fetchedServices.length > 0) {
            setServices(fetchedServices);
          }
        }
      } catch (error) {
        console.error("Error fetching services: ", error);
      }
    };

    fetchServices();
  }, []);

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
      <Header />
      <HeroSection>
        <TopWave />
        <BottomWave />
        <BackgroundLogo src="/logo.png" alt="Tooth Logo Background" />

        <HeroContent>
          <MainHeadline
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Dedicated to Smiles,<br />
            Anchored in Care
          </MainHeadline>

          <HeroButton
            onClick={() => navigate('/book-now')}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Book Now!
          </HeroButton>
        </HeroContent>
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
          {services.map((service, index) => (
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
