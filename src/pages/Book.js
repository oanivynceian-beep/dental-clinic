import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from "framer-motion";
import Header from '../components/Header';
import { User, Phone, MessageSquare, Mail, CheckCircle2, ArrowRight, Loader2, ChevronLeft, ChevronRight, ChevronDown, MapPin, X, Home, CalendarPlus, Clock, Download, Stethoscope } from 'lucide-react';
import html2canvas from 'html2canvas';
import { db } from './firebase';
import {
  collection, addDoc, onSnapshot, query, doc,
  serverTimestamp, orderBy
} from 'firebase/firestore';

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
  font-family: inherit;
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
  padding: 1rem 1.25rem;
  background: white;
  border: 2px solid ${props => (props.$isOpen ? '#4a3728' : '#f0f0f0')};
  border-radius: 16px;
  outline: none;
  font-size: 1rem;
  font-weight: 600;
  color: ${props => (props.$hasValue ? '#4a3728' : '#bcaaa4')};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  text-align: left;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01);

  &:hover {
    border-color: #d7ccc8;
    background: #fafafa;
  }

  ${props =>
    props.$isOpen &&
    `
    box-shadow: 0 0 0 4px rgba(74, 55, 40, 0.08);
    background: white;
  `}

  @media (max-width: 768px) {
    padding: 0.9rem 1.1rem;
    font-size: 0.95rem;
  }
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
  border: 2px solid #efefef;
  border-radius: 20px;
  overflow-y: auto;
  max-height: 320px;
  z-index: 100;
  box-shadow: 0 20px 50px rgba(74, 55, 40, 0.15);
  padding: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0d7d2;
    border-radius: 10px;
  }
`;

const DropdownOption = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  background: ${props => (props.$isSelected ? '#faf8f6' : 'transparent')};
  border: none;
  outline: none;
  font-size: 0.95rem;
  font-weight: ${props => (props.$isSelected ? '700' : '500')};
  color: #4a3728;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  text-align: left;
  transition: all 0.2s;
  border-radius: 12px;
  margin-bottom: 2px;
  position: relative;

  &:hover {
    background: #f5f0ed;
    transform: translateX(4px);
  }

  ${props =>
    props.$isSelected &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: #4a3728;
      border-radius: 0 4px 4px 0;
    }
  `}
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

const DropdownHeader = styled.div`
  padding: 1rem 1.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 800;
  color: #a1887f;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: #fdfaf7;
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
  font-family: inherit;
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

const TermsCheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-top: 1rem;
`;

const Checkbox = styled.input`
  margin-top: 0.25rem;
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #4a3728;
`;

const TermsText = styled.p`
  font-size: 0.9rem;
  color: #6d4c41;
  line-height: 1.4;
`;

const TermsLink = styled.span`
  color: #4a3728;
  font-weight: 800;
  text-decoration: underline;
  cursor: pointer;
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
  padding: 2rem;
  max-width: 520px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  text-align: center;
  position: relative;
  box-shadow: 0 40px 80px rgba(74, 55, 40, 0.2), 0 8px 24px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d7ccc8;
    border-radius: 6px;
  }

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
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
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
  margin-bottom: 1.5rem;
`;

const ModalSummary = styled.div`
  background: #fdfaf7;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  & > *:last-child {
    grid-column: 1 / -1;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
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
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 2px;

  &:hover {
    background: ${props => props.$selected ? '#3e2b1f' : 'rgba(74, 55, 40, 0.12)'};
    transform: ${props => props.$disabled ? 'none' : 'scale(1.1)'};
  }

  @media (max-width: 480px) {
    aspect-ratio: auto;
    min-height: 44px;
    padding: 4px 2px;
    font-size: 0.85rem;
  }
  
  ${props => props.$today && !props.$selected && `
    &::after {
      content: '';
      position: absolute;
      top: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #4a3728;
    }
  `}
`;

const SlotBadge = styled.span`
  margin-top: 3px;
  font-size: 0.62rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  letter-spacing: -0.2px;
  pointer-events: none;
  color: ${p => p.$selected ? 'rgba(255,255,255,0.9)' :
    p.$full ? '#e53935' :
      p.$low ? '#f57c00' :
        '#388e3c'
  };

  @media (max-width: 480px) {
    font-size: 0.55rem;
    margin-top: 2px;
    letter-spacing: -0.3px;
  }
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

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM'
];

const CustomCalendar = ({ value, onChange, blockedDates = [], bookingCounts = {}, maxPerDay = 10, dateCaps = {}, showAvailability = false }) => {
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

  const isAdminBlocked = (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return blockedDates.includes(key);
  };

  const isAtCapacity = (day) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    // Per-date cap overrides global cap
    const effectiveCap = dateCaps[key] !== undefined ? dateCaps[key] : maxPerDay;
    return (bookingCounts[key] || 0) >= effectiveCap;
  };

  const isDisabled = (day) => isPastDate(day) || isAdminBlocked(day) || isAtCapacity(day);

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
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const effectiveCap = dateCaps[key] !== undefined ? dateCaps[key] : maxPerDay;
    const used = bookingCounts[key] || 0;
    const remaining = Math.max(0, effectiveCap - used);
    const disabled = isDisabled(d);
    const adminBlocked = isAdminBlocked(d);
    const atCap = isAtCapacity(d);
    const selected = isSelected(d);
    const blockedStyle = adminBlocked || atCap
      ? { background: adminBlocked ? 'rgba(244,67,54,0.08)' : 'rgba(255,152,0,0.08)', color: adminBlocked ? '#ef9a9a' : '#ffb74d' }
      : {};
    const showBadge = showAvailability && !isPastDate(d);
    cells.push(
      <DayCell
        key={d}
        type="button"
        $disabled={disabled}
        $today={isToday(d)}
        $selected={selected}
        onClick={() => !disabled && handleSelect(d)}
        title={
          adminBlocked ? 'Unavailable — blocked by clinic' :
            atCap ? 'Fully booked for this day' :
              showBadge ? `${remaining} spot${remaining !== 1 ? 's' : ''} remaining` :
                undefined
        }
        style={blockedStyle}
      >
        {d}
        {showBadge && (
          <SlotBadge
            $full={remaining === 0 || adminBlocked}
            $low={remaining > 0 && remaining <= Math.max(2, Math.ceil(effectiveCap * 0.3)) && !adminBlocked}
            $selected={selected}
          >
            {adminBlocked ? 'Closed' : remaining === 0 ? 'Full' : `${remaining} left`}
          </SlotBadge>
        )}
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

const CustomDropdown = ({ value, onChange, placeholder, options, icon: IconComponent = MapPin }) => {
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
                <IconComponent size={18} />
              </OptionIcon>
              <OptionDetails>
                <OptionLabel>{selectedOption.label}</OptionLabel>
                {selectedOption.sub && <OptionSub>{selectedOption.sub}</OptionSub>}
              </OptionDetails>
            </>
          ) : (
            <span style={{ fontWeight: 500, marginLeft: '0.25rem' }}>{placeholder}</span>
          )}
        </DropdownTriggerLeft>
        <DropdownChevron
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, cubicBezier: [0.4, 0, 0.2, 1] }}
        >
          <ChevronDown size={20} />
        </DropdownChevron>
      </DropdownTrigger>

      <AnimatePresence>
        {isOpen && (
          <>
            <DropdownMenu
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, cubicBezier: [0.4, 0, 0.2, 1] }}
            >
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {options.map((opt) => {
                  if (opt.isHeader) {
                    return <DropdownHeader key={opt.value}>{opt.label}</DropdownHeader>;
                  }
                  return (
                    <DropdownOption
                      key={opt.value + opt.label}
                      type="button"
                      $isSelected={value === opt.value}
                      disabled={opt.disabled}
                      onClick={() => {
                        if (opt.disabled) return;
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      style={{ opacity: opt.disabled ? 0.5 : 1, cursor: opt.disabled ? 'not-allowed' : 'pointer' }}
                    >
                      <OptionIcon $color={opt.color} $iconColor={opt.iconColor}>
                        <IconComponent size={16} />
                      </OptionIcon>
                      <OptionDetails>
                        <OptionLabel>{opt.label}</OptionLabel>
                        {opt.sub && <OptionSub>{opt.sub}</OptionSub>}
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
                  );
                })}
              </div>
            </DropdownMenu>
          </>
        )}
      </AnimatePresence>
    </DropdownContainer>
  );
};

// Services will be fetched from Firestore

/* ========================
   Main BookNow Component
======================== */

const BookNow = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    branch: '',
    date: '',
    time: '',
    reason: '',
    customReason: '',
    dentist: ''
  });

  // Calendar availability settings — per branch
  const [settingsSasa, setSettingsSasa] = useState({ blockedDates: [], maxReservationsPerDay: 10, maxReservationsPerSlot: 1, dateCaps: {}, disabledServicesByDate: {} });
  const [settingsMatina, setSettingsMatina] = useState({ blockedDates: [], maxReservationsPerDay: 10, maxReservationsPerSlot: 1, dateCaps: {}, disabledServicesByDate: {} });
  const [globalServices, setGlobalServices] = useState({ major: [], minor: [], dentures: [], braces: [], veneers: [], retainers: [] });
  // Booking counts keyed by branch: { sasa: { totals: {}, slots: {} }, matina: { ... } }
  const [bookingCountsByBranch, setBookingCountsByBranch] = useState({ sasa: { totals: {}, slots: {} }, matina: { totals: {}, slots: {} } });
  const [globalDentists, setGlobalDentists] = useState([]);

  useEffect(() => {
    // Fetch both branch settings from Firestore
    const unsubSasa = onSnapshot(doc(db, 'calendarSettings', 'sasa'), snap => {
      if (snap.exists()) {
        const d = snap.data();
        setSettingsSasa({
          blockedDates: d.blockedDates || [],
          maxReservationsPerDay: d.maxReservationsPerDay ?? 10,
          maxReservationsPerSlot: d.maxReservationsPerSlot ?? 1,
          dateCaps: d.dateCaps || {},
          disabledServicesByDate: d.disabledServicesByDate || {}
        });
      }
    });
    const unsubMatina = onSnapshot(doc(db, 'calendarSettings', 'matina'), snap => {
      if (snap.exists()) {
        const d = snap.data();
        setSettingsMatina({
          blockedDates: d.blockedDates || [],
          maxReservationsPerDay: d.maxReservationsPerDay ?? 10,
          maxReservationsPerSlot: d.maxReservationsPerSlot ?? 1,
          dateCaps: d.dateCaps || {},
          disabledServicesByDate: d.disabledServicesByDate || {}
        });
      }
    });


    // Fetch all services from Firestore grouped by type
    const unsubServices = onSnapshot(query(collection(db, 'services'), orderBy('name')), snap => {
      const grouped = { major: [], minor: [], dentures: [], braces: [], veneers: [], retainers: [] };
      snap.docs.forEach(d => {
        const s = { id: d.id, value: d.data().name, label: d.data().name, ...d.data() };
        const type = s.type;
        if (grouped[type] !== undefined) grouped[type].push(s);
      });
      setGlobalServices(grouped);
    });

    // Count bookings per branch per date and slot (pending + approved only)
    const unsubBookings = onSnapshot(query(collection(db, 'bookings')), snap => {
      const counts = { sasa: { totals: {}, slots: {} }, matina: { totals: {}, slots: {} } };
      snap.docs.forEach(d => {
        const { date, time, status, branch } = d.data();
        if (date && status !== 'cancelled' && (branch === 'sasa' || branch === 'matina')) {
          counts[branch].totals[date] = (counts[branch].totals[date] || 0) + 1;
          if (time) {
            if (!counts[branch].slots[date]) counts[branch].slots[date] = {};
            counts[branch].slots[date][time] = (counts[branch].slots[date][time] || 0) + 1;
          }
        }
      });
      setBookingCountsByBranch(counts);
    });

    const unsubDentists = onSnapshot(query(collection(db, 'dentists')), snap => {
      setGlobalDentists(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubSasa();
      unsubMatina();
      unsubBookings();
      unsubServices();
      unsubDentists();
    };
  }, []);

  const availableServices = useMemo(() => {
    const settings = formData.branch === 'sasa' ? settingsSasa : settingsMatina;
    const disabledIds = settings.disabledServicesByDate?.[formData.date] || [];

    const other = { value: 'Other', label: 'Other (Please specify)' };

    const formatSub = (s) => s.price != null ? `₱${Number(s.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })} min` : undefined;

    const filterAndFormat = (list) =>
      [...list.filter(s => !disabledIds.includes(s.id)).map(s => ({ ...s, sub: formatSub(s) })), other];

    return {
      major: filterAndFormat(globalServices.major),
      minor: filterAndFormat(globalServices.minor),
      dentures: filterAndFormat(globalServices.dentures),
      braces: filterAndFormat(globalServices.braces),
      veneers: filterAndFormat(globalServices.veneers),
      retainers: filterAndFormat(globalServices.retainers),
    };
  }, [formData.branch, formData.date, globalServices, settingsSasa, settingsMatina]);

  const dentistOptions = useMemo(() => {
    let filtered = globalDentists;
    if (formData.branch) {
      filtered = filtered.filter(d => d.branch === formData.branch || d.branch === 'both');
    }
    if (formData.reason && formData.reason !== 'Other') {
      filtered = filtered.filter(d => d.services && d.services.includes(formData.reason));
    }

    return [
      { value: '', label: 'Any Available Dentist', color: 'rgba(0,0,0,0.03)', iconColor: '#bcaaa4' },
      ...filtered.map(d => ({
        value: d.name,
        label: d.name,
        sub: d.branch ? (d.branch === 'both' ? 'Both Branches' : (d.branch === 'sasa' ? 'Sasa Branch' : 'Matina Branch')) : '',
        color: 'rgba(74, 55, 40, 0.06)',
        iconColor: '#4a3728'
      }))
    ];
  }, [globalDentists, formData.branch, formData.reason]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (dateStr) => {
    setFormData(prev => ({ ...prev, date: dateStr, time: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      const submissionData = { ...formData };
      if (submissionData.reason === 'Other') {
        submissionData.reason = submissionData.customReason;
      }
      // Remove customReason before saving to DB
      delete submissionData.customReason;

      await addDoc(collection(db, 'bookings'), {
        ...submissionData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setShowConfirmation(false);
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

  const modalRef = useRef(null);

  const handleSaveAsPng = async () => {
    if (!modalRef.current) return;
    try {
      // Hide buttons before taking screenshot
      const buttonsContainer = modalRef.current.querySelector('[data-hide-for-png]');
      const originalDisplay = buttonsContainer?.style.display;
      if (buttonsContainer) buttonsContainer.style.display = 'none';

      const canvas = await html2canvas(modalRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      // Restore buttons
      if (buttonsContainer) buttonsContainer.style.display = originalDisplay;

      const link = document.createElement('a');
      link.download = `appointment-${formData.fullName.replace(/\s+/g, '-')}-${formData.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  };

  const handleBookAnother = () => {
    setIsSubmitted(false);
    setAgreedToTerms(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      branch: '',
      date: '',
      time: '',
      reason: '',
      customReason: '',
      dentist: ''
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
                blockedDates={formData.branch ? (formData.branch === 'sasa' ? settingsSasa.blockedDates : settingsMatina.blockedDates) : []}
                bookingCounts={formData.branch ? (bookingCountsByBranch[formData.branch]?.totals || {}) : {}}
                maxPerDay={formData.branch ? (formData.branch === 'sasa' ? settingsSasa.maxReservationsPerDay : settingsMatina.maxReservationsPerDay) : 10}
                dateCaps={formData.branch ? (formData.branch === 'sasa' ? settingsSasa.dateCaps : settingsMatina.dateCaps) : {}}
                showAvailability={!!formData.branch}
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

            <AnimatePresence>
              {formData.date && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'visible' }} // ensure dropdown works
                >
                  <FormGroup style={{ marginBottom: '2.5rem' }}>
                    <Label><Clock size={16} /> Preferred Time</Label>
                    <CustomDropdown
                      value={formData.time}
                      onChange={(val) => setFormData(prev => ({ ...prev, time: val }))}
                      placeholder="Select a time slot"
                      options={TIME_SLOTS.map(slot => {
                        const branchSettings = formData.branch === 'sasa' ? settingsSasa : settingsMatina;
                        const maxPerSlot = branchSettings.maxReservationsPerSlot ?? 1;
                        const usedSlots = bookingCountsByBranch[formData.branch]?.slots?.[formData.date] || {};
                        const isFull = (usedSlots[slot] || 0) >= maxPerSlot;

                        return {
                          value: isFull ? '' : slot,
                          label: slot,
                          sub: isFull ? 'Already Booked' : 'Available',
                          disabled: isFull,
                          color: isFull ? 'rgba(244,67,54,0.1)' : 'rgba(74, 55, 40, 0.06)',
                          iconColor: isFull ? '#f44336' : '#4a3728'
                        };
                      })}
                      icon={Clock}
                    />
                    {/* Hidden required input for validation */}
                    <input
                      type="text"
                      value={formData.time}
                      required
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
                      tabIndex={-1}
                      onChange={() => { }}
                    />
                  </FormGroup>
                </motion.div>
              )}
            </AnimatePresence>

            <FormGroup>
              <Label><MessageSquare size={16} /> Reason for Visit</Label>
              <FormGrid>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label style={{ fontSize: '0.8rem', color: '#a1887f' }}>Major Services</Label>
                  <CustomDropdown
                    value={availableServices.major.some(s => s.value === formData.reason) ? formData.reason : ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, reason: val }))}
                    placeholder="Select Major Service"
                    options={availableServices.major.map(opt => ({
                      ...opt,
                      color: 'rgba(74, 55, 40, 0.06)',
                      iconColor: '#4a3728'
                    }))}
                    icon={MessageSquare}
                  />
                </FormGroup>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label style={{ fontSize: '0.8rem', color: '#a1887f' }}>Minor Services</Label>
                  <CustomDropdown
                    value={availableServices.minor.some(s => s.value === formData.reason) ? formData.reason : ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, reason: val }))}
                    placeholder="Select Minor Service"
                    options={availableServices.minor.map(opt => ({
                      ...opt,
                      color: 'rgba(74, 55, 40, 0.06)',
                      iconColor: '#4a3728'
                    }))}
                    icon={MessageSquare}
                  />
                </FormGroup>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label style={{ fontSize: '0.8rem', color: '#a1887f' }}>Dentures</Label>
                  <CustomDropdown
                    value={availableServices.dentures.some(s => s.value === formData.reason) ? formData.reason : ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, reason: val }))}
                    placeholder="Select Dentures Service"
                    options={availableServices.dentures.map(opt => ({
                      ...opt,
                      color: 'rgba(76, 175, 80, 0.06)',
                      iconColor: '#4caf50'
                    }))}
                    icon={MessageSquare}
                  />
                </FormGroup>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label style={{ fontSize: '0.8rem', color: '#a1887f' }}>Braces</Label>
                  <CustomDropdown
                    value={availableServices.braces.some(s => s.value === formData.reason) ? formData.reason : ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, reason: val }))}
                    placeholder="Select Braces Service"
                    options={availableServices.braces.map(opt => ({
                      ...opt,
                      color: 'rgba(33, 150, 243, 0.06)',
                      iconColor: '#2196f3'
                    }))}
                    icon={MessageSquare}
                  />
                </FormGroup>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label style={{ fontSize: '0.8rem', color: '#a1887f' }}>Veneers</Label>
                  <CustomDropdown
                    value={availableServices.veneers.some(s => s.value === formData.reason) ? formData.reason : ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, reason: val }))}
                    placeholder="Select Veneers Service"
                    options={availableServices.veneers.map(opt => ({
                      ...opt,
                      color: 'rgba(156, 39, 176, 0.06)',
                      iconColor: '#9c27b0'
                    }))}
                    icon={MessageSquare}
                  />
                </FormGroup>
                <FormGroup style={{ marginBottom: 0 }}>
                  <Label style={{ fontSize: '0.8rem', color: '#a1887f' }}>Retainers</Label>
                  <CustomDropdown
                    value={availableServices.retainers.some(s => s.value === formData.reason) ? formData.reason : ''}
                    onChange={(val) => setFormData(prev => ({ ...prev, reason: val }))}
                    placeholder="Select Retainers Service"
                    options={availableServices.retainers.map(opt => ({
                      ...opt,
                      color: 'rgba(255, 152, 0, 0.06)',
                      iconColor: '#ff9800'
                    }))}
                    icon={MessageSquare}
                  />
                </FormGroup>
              </FormGrid>

              {/* Hidden required input for validation */}
              <input
                type="text"
                value={formData.reason}
                required
                style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
                tabIndex={-1}
                onChange={() => { }}
              />

              <AnimatePresence>
                {formData.reason === 'Other' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ marginTop: '1rem', overflow: 'hidden' }}
                  >
                    <Label style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Please specify your concern</Label>
                    <StyledTextArea
                      name="customReason"
                      value={formData.customReason}
                      onChange={handleChange}
                      placeholder="Tell us about your dental concern..."
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </FormGroup>

            <FormGroup>
              <Label><Stethoscope size={16} /> Preferred Dentist (Optional)</Label>
              <Subtitle style={{ fontSize: '0.8rem', margin: '0 0 0.5rem 0', color: '#bcaaa4' }}>
                Options are filtered by your selected branch and service.
              </Subtitle>
              <CustomDropdown
                value={formData.dentist}
                onChange={(val) => setFormData(prev => ({ ...prev, dentist: val }))}
                placeholder="Any Available Dentist"
                options={dentistOptions}
                icon={User}
              />
            </FormGroup>

            <TermsCheckboxContainer>
              <Checkbox
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <TermsText>
                By proceeding, you agree to our{' '}
                <TermsLink onClick={() => setShowTermsModal(true)}>Terms & Conditions</TermsLink>.
              </TermsText>
            </TermsCheckboxContainer>

            <SubmitButton
              type="submit"
              disabled={isLoading || !agreedToTerms}
              whileHover={(!isLoading && agreedToTerms) ? { scale: 1.02, y: -2 } : {}}
              whileTap={(!isLoading && agreedToTerms) ? { scale: 0.98 } : {}}
              style={{ opacity: (!isLoading && agreedToTerms) ? 1 : 0.6 }}
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
        {showConfirmation && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowConfirmation(false)}
          >
            <ModalCard
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalCloseButton onClick={() => setShowConfirmation(false)}>
                <X size={16} />
              </ModalCloseButton>

              <ModalTitle>Confirm Your Booking</ModalTitle>
              <ModalSubtext>
                Please review your appointment details before confirming.
              </ModalSubtext>

              <ModalSummary>
                <SummaryRow>
                  <span>Name</span>
                  <span>{formData.fullName}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Email</span>
                  <span>{formData.email}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Phone</span>
                  <span>{formData.phone}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Branch</span>
                  <span>{getBranchLabel(formData.branch)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Date</span>
                  <span>{formatDate(formData.date)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Time</span>
                  <span>{formData.time}</span>
                </SummaryRow>
                {formData.reason && (
                  <>
                    <SummaryRow>
                      <span>Reason</span>
                      <span>{formData.reason === 'Other' ? formData.customReason : formData.reason}</span>
                    </SummaryRow>
                    {formData.reason !== 'Other' && (() => {
                      const selectedService = [...globalServices.major, ...globalServices.minor].find(s => s.value === formData.reason);
                      if (selectedService && selectedService.price != null) {
                        return (
                          <SummaryRow>
                            <span>Price</span>
                            <span style={{ color: '#2e7d32' }}>₱{Number(selectedService.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })} min</span>
                          </SummaryRow>
                        );
                      }
                      return null;
                    })()}
                  </>
                )}
                {formData.dentist && (
                  <SummaryRow>
                    <span>Dentist</span>
                    <span>{formData.dentist}</span>
                  </SummaryRow>
                )}
              </ModalSummary>

              <ModalActions>
                <ModalButton
                  $variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </ModalButton>
                <ModalButton
                  onClick={handleConfirmBooking}
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ opacity: isLoading ? 0.6 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <Spinner size={18} /> Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Confirm Booking
                    </>
                  )}
                </ModalButton>
              </ModalActions>
            </ModalCard>
          </ModalBackdrop>
        )}
      </AnimatePresence>
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
              ref={modalRef}
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
                  <span>Email</span>
                  <span>{formData.email}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Phone</span>
                  <span>{formData.phone}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Branch</span>
                  <span>{getBranchLabel(formData.branch)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Date</span>
                  <span>{formatDate(formData.date)}</span>
                </SummaryRow>
                <SummaryRow>
                  <span>Time</span>
                  <span>{formData.time}</span>
                </SummaryRow>
                {formData.reason && (
                  <>
                    <SummaryRow>
                      <span>Reason</span>
                      <span>{formData.reason === 'Other' ? formData.customReason : formData.reason}</span>
                    </SummaryRow>
                    {formData.reason !== 'Other' && (() => {
                      const selectedService = [...globalServices.major, ...globalServices.minor].find(s => s.value === formData.reason);
                      if (selectedService && selectedService.price != null) {
                        return (
                          <SummaryRow>
                            <span>Price</span>
                            <span style={{ color: '#2e7d32' }}>₱{Number(selectedService.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</span>
                          </SummaryRow>
                        );
                      }
                      return null;
                    })()}
                  </>
                )}
                {formData.dentist && (
                  <SummaryRow>
                    <span>Dentist</span>
                    <span>{formData.dentist}</span>
                  </SummaryRow>
                )}
              </ModalSummary>

              {/* Payment reminder */}
              <div style={{
                background: 'linear-gradient(135deg, #fff8e1, #fff3cd)',
                border: '1px solid #ffe082',
                borderRadius: '14px',
                padding: '1rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#795548', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <span>💰</span> Payment Information
                </div>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#5d4037', fontWeight: 600, lineHeight: 1.6 }}>
                  Partial payment or full payment will be determined <strong>on-site</strong> at the time of your appointment. Please bring a valid ID.
                </p>
              </div>

              <ModalActions data-hide-for-png>
                <ModalButton
                  $variant="outline"
                  onClick={handleBookAnother}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <CalendarPlus size={18} /> Book Another
                </ModalButton>
                <ModalButton
                  onClick={handleSaveAsPng}
                  $variant="outline"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ background: '#f1f8e9', borderColor: '#aed581', color: '#388e3c' }}
                >
                  <Download size={18} /> Save as PNG
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
      <AnimatePresence>
        {showTermsModal && (
          <ModalBackdrop
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowTermsModal(false)}
          >
            <ModalCard
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalCloseButton onClick={() => setShowTermsModal(false)}>
                <X size={16} />
              </ModalCloseButton>
              <ModalTitle>Terms & Conditions</ModalTitle>
              <div style={{ textAlign: 'left', marginTop: '1.5rem', maxHeight: '50vh', overflowY: 'auto', paddingRight: '1rem', color: '#6d4c41', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <h4 style={{ color: '#4a3728', fontWeight: '800', marginBottom: '0.5rem' }}>1. Appointment Policy</h4>
                <p style={{ marginBottom: '1rem' }}>Please arrive at least 10 minutes before your scheduled time. Late arrivals may need to be rescheduled to accommodate other patients.</p>
                <h4 style={{ color: '#4a3728', fontWeight: '800', marginBottom: '0.5rem' }}>2. Cancellation Policy</h4>
                <p style={{ marginBottom: '1rem' }}>If you need to cancel or modify your booking, please do so at least 24 hours prior to your appointment time.</p>
                <h4 style={{ color: '#4a3728', fontWeight: '800', marginBottom: '0.5rem' }}>3. Data Privacy</h4>
                <p style={{ marginBottom: '1rem' }}>Your personal data will be kept strictly confidential and will only be used by Dr. A Dental Clinic for the purposes of your dental care and related communication.</p>
                <h4 style={{ color: '#4a3728', fontWeight: '800', marginBottom: '0.5rem' }}>4. Medical History</h4>
                <p>You agree to provide accurate and complete medical history to ensure safe and effective dental treatment.</p>
              </div>
              <ModalActions style={{ marginTop: '2rem' }}>
                <ModalButton
                  type="button"
                  onClick={() => {
                    setAgreedToTerms(true);
                    setShowTermsModal(false);
                  }}
                >
                  I Agree
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
