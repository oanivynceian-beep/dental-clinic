import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import Header from '../components/Header';
import { User, Phone, MessageSquare, Mail, CheckCircle2, ArrowRight, Loader2, ChevronLeft, ChevronRight, ChevronDown, MapPin, X, Home, CalendarPlus } from 'lucide-react';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fdfaf7;
  position: relative;
  overflow: hidden;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Spinner = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
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

/* ========================
   Custom Dropdown Styles
======================== */

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownTrigger = styled.button`
  width: 100%;
  padding: 1.25rem;
  background: white;
  border: 2px solid ${props => props.$isOpen ? '#4a3728' : '#f0f0f0'};
  border-radius: 16px;
  outline: none;
  font-size: 1rem;
  color: ${props => props.$hasValue ? '#4a3728' : '#bcaaa4'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  text-align: left;

  &:hover {
    border-color: #d7ccc8;
  }

  ${props => props.$isOpen && `
    box-shadow: 0 0 0 4px rgba(74, 55, 40, 0.05);
    transform: translateY(-2px);
  `}
`;

const DropdownTriggerLeft = styled.span`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
`;

const DropdownChevron = styled(motion.span)`
  display: flex;
  align-items: center;
  color: #a1887f;
  flex-shrink: 0;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  z-index: 50;
  box-shadow: 0 20px 40px rgba(74, 55, 40, 0.12), 0 4px 12px rgba(74, 55, 40, 0.06);
`;

const DropdownOption = styled.button`
  width: 100%;
  padding: 1rem 1.25rem;
  background: ${props => props.$isSelected ? 'rgba(74, 55, 40, 0.06)' : 'transparent'};
  border: none;
  outline: none;
  font-size: 1rem;
  color: #4a3728;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-align: left;
  transition: all 0.15s ease;
  position: relative;

  &:hover {
    background: rgba(74, 55, 40, 0.08);
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 1.25rem;
    right: 1.25rem;
    height: 1px;
    background: #f5f0ed;
  }
`;

const OptionIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${props => props.$color || 'rgba(74, 55, 40, 0.06)'};
  color: ${props => props.$iconColor || '#4a3728'};
  flex-shrink: 0;
`;

const OptionDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const OptionLabel = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  color: #4a3728;
`;

const OptionSub = styled.span`
  font-size: 0.78rem;
  color: #a1887f;
  font-weight: 500;
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

/* ========================
   Success Modal Styles
======================== */

const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const ModalCard = styled(motion.div)`
  background: white;
  border-radius: 32px;
  padding: 3rem 2.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  position: relative;
  box-shadow: 0 40px 80px rgba(74, 55, 40, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);

  @media (max-width: 480px) {
    padding: 2.5rem 1.5rem;
    border-radius: 24px;
  }
`;

const ModalCloseButton = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: #f5f0ed;
  border: none;
  border-radius: 12px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6d4c41;
  transition: all 0.2s ease;

  &:hover {
    background: #4a3728;
    color: white;
    transform: scale(1.05);
  }
`;

const ModalIconRing = styled(motion.div)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.75rem;
  color: #4a3728;
  font-weight: 800;
  margin-bottom: 0.5rem;
`;

const ModalSubtext = styled.p`
  color: #6d4c41;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ModalSummary = styled.div`
  background: #fdfaf7;
  border-radius: 16px;
  padding: 1.25rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: #5d4037;

  &:not(:last-child) {
    border-bottom: 1px solid #f0ebe7;
  }

  span:first-child {
    color: #a1887f;
    font-weight: 600;
    min-width: 70px;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  span:last-child {
    font-weight: 600;
    color: #4a3728;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const ModalButton = styled(motion.button)`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  border: 2px solid ${props => props.$variant === 'outline' ? '#e0d6cf' : 'transparent'};
  background: ${props => props.$variant === 'outline' ? 'transparent' : '#4a3728'};
  color: ${props => props.$variant === 'outline' ? '#4a3728' : 'white'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$variant === 'outline'
    ? '0 4px 12px rgba(74, 55, 40, 0.08)'
    : '0 8px 24px rgba(74, 55, 40, 0.25)'};
  }
`;

/* ========================
   Custom Calendar Styles
======================== */

const CalendarWrapper = styled.div`
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: 20px;
  padding: 1.5rem;
  transition: border-color 0.3s ease;
  
  &:hover {
    border-color: #d7ccc8;
  }
`;

const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
`;

const MonthYearLabel = styled.span`
  font-weight: 800;
  font-size: 1.1rem;
  color: #4a3728;
  letter-spacing: 0.5px;
`;

const NavButton = styled.button`
  background: none;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a3728;
  transition: all 0.2s ease;

  &:hover {
    background: #4a3728;
    border-color: #4a3728;
    color: white;
    transform: scale(1.05);
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #a1887f;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 6px 0;
  margin-bottom: 4px;
`;

const DayCell = styled.button`
  aspect-ratio: 1;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: ${props => (props.$disabled ? 'not-allowed' : 'pointer')};
  background: ${props => {
    if (props.$selected) return '#4a3728';
    if (props.$today) return 'rgba(74, 55, 40, 0.08)';
    return 'transparent';
  }};
  color: ${props => {
    if (props.$selected) return 'white';
    if (props.$disabled) return '#d7ccc8';
    if (props.$today) return '#4a3728';
    return '#5d4037';
  }};
  opacity: ${props => (props.$empty ? 0 : 1)};
  pointer-events: ${props => (props.$empty || props.$disabled) ? 'none' : 'auto'};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: ${props => props.$selected ? '#3e2b1f' : 'rgba(74, 55, 40, 0.12)'};
    transform: ${props => props.$disabled ? 'none' : 'scale(1.1)'};
  }

  ${props => props.$today && !props.$selected && `
    &::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #4a3728;
    }
  `}
`;

const SelectedDateChip = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #4a3728, #6d4c41);
  color: white;
  padding: 0.3rem 0.85rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  margin-left: 0.5rem;
  white-space: nowrap;
  vertical-align: middle;
`;

/* ========================
   Custom Calendar Component
======================== */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CustomCalendar = ({ value, onChange }) => {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const isPastDate = (day) => {
    const cellDate = new Date(year, month, day);
    cellDate.setHours(0, 0, 0, 0);
    return cellDate < today;
  };

  const isToday = (day) => {
    return year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
  };

  const isSelected = (day) => {
    if (!value) return false;
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return formatted === value;
  };

  const handleSelect = (day) => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formatted);
  };

  const canGoPrev = () => {
    return !(year === today.getFullYear() && month === today.getMonth());
  };

  // Build cells
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<DayCell key={`empty-${i}`} $empty />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      <DayCell
        key={d}
        type="button"
        $disabled={isPastDate(d)}
        $today={isToday(d)}
        $selected={isSelected(d)}
        onClick={() => handleSelect(d)}
      >
        {d}
      </DayCell>
    );
  }


  return (
    <CalendarWrapper>
      <CalendarHeader>
        <NavButton type="button" onClick={prevMonth} disabled={!canGoPrev()} style={{ opacity: canGoPrev() ? 1 : 0.3 }}>
          <ChevronLeft size={18} />
        </NavButton>
        <MonthYearLabel>{MONTH_NAMES[month]} {year}</MonthYearLabel>
        <NavButton type="button" onClick={nextMonth}>
          <ChevronRight size={18} />
        </NavButton>
      </CalendarHeader>

      <DaysGrid>
        {DAY_LABELS.map(d => <DayHeader key={d}>{d}</DayHeader>)}
        {cells}
      </DaysGrid>

    </CalendarWrapper>
  );
};

/* ========================
   Custom Dropdown Component
======================== */

const CustomDropdown = ({ value, onChange, placeholder, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <DropdownContainer ref={containerRef}>
      <DropdownTrigger
        type="button"
        $isOpen={isOpen}
        $hasValue={!!value}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <DropdownTriggerLeft>
          {selectedOption ? (
            <>
              <OptionIcon $color={selectedOption.color} $iconColor={selectedOption.iconColor}>
                <MapPin size={16} />
              </OptionIcon>
              <OptionDetails>
                <OptionLabel>{selectedOption.label}</OptionLabel>
                <OptionSub>{selectedOption.sub}</OptionSub>
              </OptionDetails>
            </>
          ) : (
            placeholder
          )}
        </DropdownTriggerLeft>
        <DropdownChevron
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronDown size={18} />
        </DropdownChevron>
      </DropdownTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: 'top center' }}
          >
            {options.map((opt) => (
              <DropdownOption
                key={opt.value}
                type="button"
                $isSelected={value === opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
              >
                <OptionIcon $color={opt.color} $iconColor={opt.iconColor}>
                  <MapPin size={16} />
                </OptionIcon>
                <OptionDetails>
                  <OptionLabel>{opt.label}</OptionLabel>
                  <OptionSub>{opt.sub}</OptionSub>
                </OptionDetails>
                {value === opt.value && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ marginLeft: 'auto', color: '#4a3728' }}
                  >
                    <CheckCircle2 size={18} />
                  </motion.span>
                )}
              </DropdownOption>
            ))}
          </DropdownMenu>
        )}
      </AnimatePresence>
    </DropdownContainer>
  );
};

/* ========================
   Main BookNow Component
======================== */

const BookNow = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    branch: '',
    date: '',
    reason: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dateStr) => {
    setFormData(prev => ({ ...prev, date: dateStr }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleBookAnother = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      branch: '',
      date: '',
      reason: ''
    });
  };

  const getBranchLabel = (val) => {
    if (val === 'sasa') return 'Sasa Branch (Main)';
    if (val === 'matina') return 'Matina Branch';
    return val;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
    });
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
          <Form onSubmit={handleSubmit}>
            <FormGrid>
              <FormGroup>
                <Label><User size={16} /> Full Name</Label>
                <StyledInput
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label><Mail size={16} /> Email Address</Label>
                <StyledInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </FormGroup>
            </FormGrid>

            <FormGrid>
              <FormGroup>
                <Label><Phone size={16} /> Phone Number</Label>
                <StyledInput
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912 345 6789"
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label><MapPin size={16} /> Preferred Branch</Label>
                <CustomDropdown
                  value={formData.branch}
                  onChange={(val) => setFormData(prev => ({ ...prev, branch: val }))}
                  placeholder="Select a branch"
                  options={[
                    { value: 'sasa', label: 'Sasa Branch', sub: 'Main Clinic', color: 'rgba(76, 175, 80, 0.1)', iconColor: '#4caf50' },
                    { value: 'matina', label: 'Matina Branch', sub: 'Branch Clinic', color: 'rgba(33, 150, 243, 0.1)', iconColor: '#2196f3' }
                  ]}
                />
                {/* Hidden required input for HTML validation */}
                <input
                  type="text"
                  value={formData.branch}
                  required
                  style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
                  tabIndex={-1}
                  onChange={() => { }}
                />
              </FormGroup>
            </FormGrid>

            <FormGroup>
              <Label>
                📅 Preferred Date
                <AnimatePresence>
                  {formData.date && (
                    <SelectedDateChip
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      key={formData.date}
                    >
                      {(() => {
                        const [y, m, d] = formData.date.split('-').map(Number);
                        return new Date(y, m - 1, d).toLocaleDateString('en-US', {
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                        });
                      })()}
                    </SelectedDateChip>
                  )}
                </AnimatePresence>
              </Label>
              <CustomCalendar
                value={formData.date}
                onChange={handleDateChange}
              />
              {/* Hidden required input to enforce HTML validation */}
              <input
                type="text"
                value={formData.date}
                required
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
                tabIndex={-1}
                onChange={() => { }}
              />
            </FormGroup>

            <FormGroup>
              <Label><MessageSquare size={16} /> Reason for Visit</Label>
              <StyledTextArea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Tell us about your dental concern (e.g., Cleaning, Check-up, Braces)..."
              />
            </FormGroup>

            <SubmitButton
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <Spinner size={20} /> Processing...
                </>
              ) : (
                <>
                  Confirm Appointment <ArrowRight size={20} />
                </>
              )}
            </SubmitButton>
          </Form>
        </BookingFormContainer>
      </ContentSection>
      <AnimatePresence>
        {isSubmitted && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleGoHome}
          >
            <ModalCard
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalCloseButton onClick={handleGoHome}>
                <X size={16} />
              </ModalCloseButton>

              <ModalIconRing
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 size={48} color="#4caf50" />
              </ModalIconRing>

              <ModalTitle>Booking Confirmed!</ModalTitle>
              <ModalSubtext>
                Thank you for choosing Dr. A Dental Clinic.<br />
                We'll contact you shortly to finalize your schedule.
              </ModalSubtext>

              <ModalSummary>
                <SummaryRow>
                  <span>Name</span>
                  <span>{formData.fullName}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Branch</span>
                  <span>{getBranchLabel(formData.branch)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Date</span>
                  <span>{formatDate(formData.date)}</span>
                </SummaryRow>
                {formData.reason && (
                  <SummaryRow>
                    <span>Reason</span>
                    <span>{formData.reason}</span>
                  </SummaryRow>
                )}
              </ModalSummary>

              <ModalActions>
                <ModalButton
                  $variant="outline"
                  onClick={handleBookAnother}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CalendarPlus size={18} /> Book Another
                </ModalButton>
                <ModalButton
                  onClick={handleGoHome}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home size={18} /> Go Home
                </ModalButton>
              </ModalActions>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default BookNow;
