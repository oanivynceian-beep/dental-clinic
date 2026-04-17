import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Lock, LogIn, Eye, EyeOff,
  Save, RotateCcw, CalendarX, Settings2, Plus, Minus,
  Trash2, Check, Info, ShieldOff, Hash, MapPin, X, Stethoscope
} from 'lucide-react';
import { db } from './firebase';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/Sidebar';

/* ─────────────────────────── Layout ─────────────────────────── */

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: 'Inter', sans-serif;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 3rem 5%;
  overflow-x: hidden;
  margin-left: 100px;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 2rem 5% 80px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 900;
  color: #4a3728;
  letter-spacing: -2px;
`;

const ClinicName = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: #4a3728;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

/* ─────────────────────────── Branch Tabs ─────────────────────────── */

const BranchTabRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  background: white;
  border-radius: 20px;
  padding: 0.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.04);
  width: fit-content;
`;

const BranchTab = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  background: ${p => p.$active
    ? p.$branch === 'sasa' ? '#e8f5e9' : '#e3f2fd'
    : 'transparent'};
  color: ${p => p.$active
    ? p.$branch === 'sasa' ? '#2e7d32' : '#1565c0'
    : '#bcaaa4'};

  &:hover {
    background: ${p => p.$branch === 'sasa' ? '#e8f5e9' : '#e3f2fd'};
    color: ${p => p.$branch === 'sasa' ? '#2e7d32' : '#1565c0'};
  }
`;

const BranchDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$branch === 'sasa' ? '#4caf50' : '#2196f3'};
  display: inline-block;
`;

/* ─────────────────────────── Grid ─────────────────────────── */

const PageGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled(motion.div)`
  background: white;
  border-radius: 24px;
  padding: 1.75rem;
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
`;

const PanelTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 900;
  color: #4a3728;
  margin-bottom: 0.3rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PanelSubtitle = styled.p`
  font-size: 0.82rem;
  color: #bcaaa4;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

/* ─────────────────────────── Mini Calendar ─────────────────────────── */

const CalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const MonthLabel = styled.span`
  font-weight: 900;
  font-size: 1rem;
  color: #4a3728;
`;

const NavBtn = styled.button`
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a3728;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #4a3728;
    color: white;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const DayHeader = styled.div`
  text-align: center;
  font-size: 0.68rem;
  font-weight: 800;
  color: #bcaaa4;
  text-transform: uppercase;
  padding: 3px 0 8px;
  letter-spacing: 0.5px;
`;

const DayCell = styled.button`
  aspect-ratio: 1;
  border: 2px solid ${p => {
    if (p.$selected) return '#4a3728';
    if (p.$blocked) return '#f44336';
    if (p.$hasCap) return '#ff9800';
    if (p.$today) return 'rgba(74,55,40,0.3)';
    return 'transparent';
  }};
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: ${p => (p.$empty || p.$past) ? 'default' : 'pointer'};
  background: ${p => {
    if (p.$selected) return '#4a3728';
    if (p.$blocked) return '#ffebee';
    if (p.$hasCap) return '#fff8e1';
    if (p.$today) return 'rgba(74,55,40,0.07)';
    return 'transparent';
  }};
  color: ${p => {
    if (p.$selected) return 'white';
    if (p.$past) return '#d7ccc8';
    if (p.$blocked) return '#c62828';
    if (p.$hasCap) return '#e65100';
    if (p.$today) return '#4a3728';
    return '#5d4037';
  }};
  opacity: ${p => p.$empty ? 0 : 1};
  pointer-events: ${p => (p.$empty || p.$past) ? 'none' : 'auto'};
  transition: all 0.15s ease;
  position: relative;

  &:hover:not(:disabled) {
    transform: ${p => (p.$empty || p.$past) ? 'none' : 'scale(1.1)'};
    background: ${p => p.$selected ? '#3e2b1f' : p.$blocked ? '#ffcdd2' : 'rgba(74,55,40,0.1)'};
  }
`;

const CapBadge = styled.span`
  position: absolute;
  bottom: 1px;
  right: 2px;
  font-size: 0.52rem;
  font-weight: 900;
  color: ${p => p.$blocked ? '#c62828' : '#e65100'};
  line-height: 1;
`;

/* ─────────────────────────── Day Settings Panel ─────────────────────────── */

const DayPanel = styled(motion.div)`
  background: #fdfaf7;
  border: 1px solid #f0ebe6;
  border-radius: 16px;
  padding: 1.25rem;
  margin-top: 1.25rem;
`;

const DayPanelTitle = styled.div`
  font-size: 0.85rem;
  font-weight: 900;
  color: #4a3728;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BlockToggleRow = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 12px;
  border: 2px solid ${p => p.$checked ? '#f44336' : '#f0f0f0'};
  background: ${p => p.$checked ? '#ffebee' : 'white'};
  transition: all 0.2s;

  input { display: none; }
`;

const ToggleIcon = styled.div`
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid ${p => p.$checked ? '#f44336' : '#e0e0e0'};
  background: ${p => p.$checked ? '#f44336' : 'white'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
`;

const ToggleLabel = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${p => p.$checked ? '#c62828' : '#5d4037'};
`;

const CapInputRow = styled.div`
  margin-bottom: 1rem;
`;

const CapLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 800;
  color: #9e9e9e;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const CapInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 800;
  color: #4a3728;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    border-color: #4a3728;
  }

  &::placeholder {
    color: #d7ccc8;
    font-weight: 600;
  }
`;

const DayApplyBtn = styled.button`
  width: 100%;
  background: #4a3728;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #3e2b1f;
  }
`;

/* ─────────────────────────── Counter ─────────────────────────── */

const SlotRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fdfaf7;
  border-radius: 16px;
  padding: 1.1rem 1.25rem;
`;

const SlotLabel = styled.div`
  font-weight: 800;
  color: #4a3728;
  font-size: 0.95rem;
`;

const SlotSub = styled.div`
  font-size: 0.78rem;
  color: #bcaaa4;
  font-weight: 600;
  margin-top: 0.1rem;
`;

const CounterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const CounterBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 2px solid #e0e0e0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a3728;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #4a3728;
    border-color: #4a3728;
    color: white;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const CountValue = styled.span`
  font-size: 1.6rem;
  font-weight: 900;
  color: #4a3728;
  min-width: 42px;
  text-align: center;
`;

/* ─────────────────────────── Date Config List ─────────────────────────── */

const ConfigList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 260px;
  overflow-y: auto;
  margin-top: 1rem;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
`;

const ConfigItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${p => p.$type === 'blocked' ? '#ffebee' : '#fff8e1'};
  border: 1px solid ${p => p.$type === 'blocked' ? '#ffcdd2' : '#ffe082'};
  border-radius: 12px;
  padding: 0.65rem 1rem;
`;

const ConfigBadge = styled.span`
  font-size: 0.7rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  background: ${p => p.$type === 'blocked' ? '#f44336' : '#ff9800'};
  color: white;
  flex-shrink: 0;
`;

const ConfigDate = styled.span`
  font-size: 0.88rem;
  font-weight: 700;
  color: ${p => p.$type === 'blocked' ? '#c62828' : '#e65100'};
  flex: 1;
`;

const ConfigCap = styled.span`
  font-size: 0.78rem;
  color: #9e9e9e;
  font-weight: 600;
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #bdbdbd;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.2rem;
  border-radius: 6px;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover {
    color: #4a3728;
    background: rgba(74,55,40,0.08);
  }
`;

const EmptyConfig = styled.div`
  text-align: center;
  padding: 1.5rem;
  color: #bcaaa4;
  font-weight: 600;
  font-size: 0.85rem;
`;

/* ─────────────────────────── Action Buttons ─────────────────────────── */

const ActionRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const SaveButton = styled(motion.button)`
  flex: 1;
  background: #4a3728;
  color: white;
  border: none;
  padding: 0.9rem 1.25rem;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;

  &:hover:not(:disabled) { background: #3e2b1f; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ResetButton = styled(motion.button)`
  background: white;
  color: #f44336;
  border: 2px solid #ffcdd2;
  padding: 0.9rem 1.25rem;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: #ffebee;
    border-color: #f44336;
  }
`;

/* ─────────────────────────── Toast ─────────────────────────── */

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${p => p.$error ? '#f44336' : '#4a3728'};
  color: white;
  padding: 0.9rem 1.4rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 9999;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;

/* ─────────────────────────── Auth Screens ─────────────────────────── */

const CenteredContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #fdfaf7;
  padding: 2rem;
  text-align: center;
`;

const AuthCard = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 40px;
  box-shadow: 0 20px 50px rgba(74,55,40,0.1);
  max-width: 450px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const LoginButton = styled.button`
  background-color: #4a3728;
  color: white;
  border: none;
  padding: 1.25rem 2.5rem;
  border-radius: 20px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(74,55,40,0.2);
  }
`;

/* ─────────────────────────── Legend ─────────────────────────── */

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.25rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #9e9e9e;
  font-weight: 600;
`;

const LegendBox = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  background: ${p => p.$bg};
  border: 2px solid ${p => p.$border};
`;

/* ─────────────────────────── Constants ─────────────────────────── */

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ACCOUNTS = {
  'admin123': 'superadmin',
  'matina123': 'matina',
  'sasa123': 'sasa'
};

const BRANCHES = [
  { key: 'sasa', label: 'Sasa Branch', sub: 'Main Clinic', color: '#4caf50' },
  { key: 'matina', label: 'Matina Branch', sub: 'Branch Clinic', color: '#2196f3' },
];

const fmtKey = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

const fmtDisplay = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'long', day: 'numeric', year: 'numeric'
  });
};

const fmtShort = (key) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });
};

/* ─────────────────────────── Main Component ─────────────────────────── */

const AdminCalendarSettings = () => {
  const navigate = useNavigate();

  // ── Auth ──
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // ── Branch ──
  const [activeBranch, setActiveBranch] = useState('sasa');

  // ── Branch settings ──
  const [blockedDates, setBlockedDates] = useState([]);
  const [maxPerDay, setMaxPerDay] = useState(10);
  const [dateCaps, setDateCaps] = useState({});   // { 'YYYY-MM-DD': number }

  // ── Calendar ──
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // ── Selected date settings ──
  const [selectedKey, setSelectedKey] = useState(null);
  const [dayBlocked, setDayBlocked] = useState(false);
  const [dayCapInput, setDayCapInput] = useState('');   // '' = use global
  const [dayDisabledServices, setDayDisabledServices] = useState([]); // Services disabled on this day

  // ── Global Services ──
  const [globalServices, setGlobalServices] = useState([]);

  // ── Save / Toast ──
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Restore auth from session ──
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_auth');
    if (saved && ACCOUNTS[saved]) {
      setIsAuthorized(true);
      setPassword(saved);
      setAdminRole(ACCOUNTS[saved]);
    }
  }, []);

  // ── Real-time Firestore sync per branch ──
  useEffect(() => {
    if (!isAuthorized || adminRole !== 'superadmin') return;

    setSelectedKey(null);  // clear selection on branch switch

    const ref = doc(db, 'calendarSettings', activeBranch);
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        const data = snap.data();
        setBlockedDates(data.blockedDates || []);
        setMaxPerDay(data.maxReservationsPerDay ?? 10);
        setDateCaps(data.dateCaps || {});
      } else {
        setBlockedDates([]);
        setMaxPerDay(10);
        setDateCaps({});
      }
    });
    return () => unsub();
  }, [isAuthorized, adminRole, activeBranch]);

  // ── Fetch Global Services ──
  useEffect(() => {
    if (!isAuthorized || adminRole !== 'superadmin') return;
    const unsub = onSnapshot(collection(db, 'services'), snap => {
      setGlobalServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [isAuthorized, adminRole]);

  // ── Branch settings ──
  const [disabledServicesByDate, setDisabledServicesByDate] = useState({}); // { 'YYYY-MM-DD': [ids] }

  useEffect(() => {
    if (!isAuthorized || adminRole !== 'superadmin') return;

    const ref = doc(db, 'calendarSettings', activeBranch);
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        const data = snap.data();
        setBlockedDates(data.blockedDates || []);
        setMaxPerDay(data.maxReservationsPerDay ?? 10);
        setDateCaps(data.dateCaps || {});
        setDisabledServicesByDate(data.disabledServicesByDate || {});
      } else {
        setBlockedDates([]);
        setMaxPerDay(10);
        setDateCaps({});
        setDisabledServicesByDate({});
      }
    });
    return () => unsub();
  }, [isAuthorized, adminRole, activeBranch]);

  // ── Auth ──
  const handleLogin = e => {
    e.preventDefault();
    if (ACCOUNTS[password]) {
      setIsAuthorized(true);
      setAdminRole(ACCOUNTS[password]);
      setLoginError('');
      sessionStorage.setItem('admin_auth', password);
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setPassword('');
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  // ── Calendar helpers ──
  const vYear = viewDate.getFullYear();
  const vMonth = viewDate.getMonth();
  const daysInMonth = new Date(vYear, vMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(vYear, vMonth, 1).getDay();

  const isPast = d => {
    const dt = new Date(vYear, vMonth, d);
    dt.setHours(0, 0, 0, 0);
    return dt < today;
  };
  const isToday = d =>
    vYear === today.getFullYear() &&
    vMonth === today.getMonth() &&
    d === today.getDate();

  // ── Day click → populate day panel ──
  const handleDayClick = d => {
    if (isPast(d)) return;
    const key = fmtKey(vYear, vMonth, d);
    setSelectedKey(key);
    setDayBlocked(blockedDates.includes(key));
    setDayCapInput(dateCaps[key] !== undefined ? String(dateCaps[key]) : '');
    setDayDisabledServices(disabledServicesByDate[key] || []);
  };

// ── Apply day settings locally (not saved yet) ──
const handleApplyDay = () => {
  if (!selectedKey) return;

  // Update blocked dates
  if (dayBlocked) {
    if (!blockedDates.includes(selectedKey)) {
      setBlockedDates(prev => [...prev, selectedKey]);
    }
  } else {
    setBlockedDates(prev => prev.filter(d => d !== selectedKey));
  }

  // Update dateCaps
  const capNum = parseInt(dayCapInput, 10);
  if (dayCapInput !== '' && !isNaN(capNum) && capNum > 0) {
    setDateCaps(prev => ({ ...prev, [selectedKey]: capNum }));
  } else {
    setDateCaps(prev => {
      const next = { ...prev };
      delete next[selectedKey];
      return next;
    });
  }

  // Update disabled services
  if (dayDisabledServices.length > 0) {
    setDisabledServicesByDate(prev => ({ ...prev, [selectedKey]: dayDisabledServices }));
  } else {
    setDisabledServicesByDate(prev => {
      const next = { ...prev };
      delete next[selectedKey];
      return next;
    });
  }

  showToast('Day settings applied. Hit Save to persist.', false);
  setSelectedKey(null);
};

// ── Remove a specific date config ──
const removeConfig = key => {
  setBlockedDates(prev => prev.filter(d => d !== key));
  setDateCaps(prev => {
    const next = { ...prev };
    delete next[key];
    return next;
  });
  if (selectedKey === key) setSelectedKey(null);
};

// ── Save to Firestore ──
const handleSave = async () => {
  setIsSaving(true);
  try {
    await setDoc(doc(db, 'calendarSettings', activeBranch), {
      blockedDates: [...blockedDates].sort(),
      maxReservationsPerDay: maxPerDay,
      dateCaps,
      disabledServicesByDate,
      updatedAt: new Date().toISOString()
    });
    showToast(`${activeBranch === 'sasa' ? 'Sasa' : 'Matina'} settings saved!`, false);
  } catch (err) {
    console.error(err);
    showToast('Failed to save. Please try again.', true);
  } finally {
    setIsSaving(false);
  }
};

const handleReset = () => {
  setBlockedDates([]);
  setDateCaps({});
  setSelectedKey(null);
  showToast('All overrides cleared. Hit Save to apply.', false);
};

const showToast = (msg, error = false) => {
  setToast({ msg, error });
  setTimeout(() => setToast(null), 3000);
};

// ── Build calendar cells ──
const buildCells = () => {
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<DayCell key={`e-${i}`} $empty />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = fmtKey(vYear, vMonth, d);
    const blocked = blockedDates.includes(key);
    const hasCap = dateCaps[key] !== undefined;
    const selected = selectedKey === key;
    const past = isPast(d);

    cells.push(
      <DayCell
        key={d}
        type="button"
        $past={past}
        $today={isToday(d)}
        $blocked={blocked}
        $hasCap={hasCap && !blocked}
        $selected={selected}
        $empty={false}
        onClick={() => handleDayClick(d)}
        title={
          past ? 'Past date (read-only)' :
            blocked ? 'Blocked — click to edit' :
              hasCap ? `Custom cap: ${dateCaps[key]} — click to edit` :
                'Click to configure this date'
        }
      >
        {d}
        {(blocked || hasCap) && !selected && (
          <CapBadge $blocked={blocked}>
            {blocked ? '✕' : dateCaps[key]}
          </CapBadge>
        )}
      </DayCell>
    );
  }
  return cells;
};

// ── Unified config list (sorted) ──
const allConfiguredKeys = [...new Set([
  ...blockedDates,
  ...Object.keys(dateCaps),
  ...Object.keys(disabledServicesByDate)
])].sort().filter(key => {
  // filter out past dates
  const [y, m, d] = key.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt >= today;
});

const canGoPrev =
  !(vYear === today.getFullYear() && vMonth === today.getMonth());

/* ─────────── RENDER: Login ─────────── */
if (!isAuthorized) {
  return (
    <CenteredContainer>
      <AuthCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '50%' }}>
          <Lock size={48} color="#4a3728" />
        </div>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#4a3728', marginBottom: '0.5rem' }}>
            Admin Access
          </h1>
          <p style={{ color: '#bcaaa4', fontWeight: 600 }}>
            This section is restricted. Enter the clinic access key.
          </p>
        </div>
        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter Access Key"
              style={{
                width: '100%', padding: '1.25rem', paddingRight: '3.5rem',
                borderRadius: '15px', border: '2px solid #f0f0f0',
                fontSize: '1rem', outline: 'none', boxSizing: 'border-box'
              }}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#bcaaa4' }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
          {loginError && (
            <p style={{ color: '#f44336', fontSize: '0.9rem', fontWeight: 600 }}>{loginError}</p>
          )}
          <LoginButton type="submit">
            <LogIn size={20} /> Access Settings
          </LoginButton>
        </form>
      </AuthCard>
    </CenteredContainer>
  );
}

/* ─────────── RENDER: Access Denied (non-superadmin) ─────────── */
if (adminRole !== 'superadmin') {
  return (
    <AdminContainer>
      <AdminSidebar activeIndex={2} />
      <MainContent>
        <CenteredContainer style={{ minHeight: 'auto', paddingTop: '6rem' }}>
          <AuthCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: '#ffebee', padding: '1.5rem', borderRadius: '50%' }}>
              <ShieldOff size={48} color="#f44336" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4a3728', marginBottom: '0.5rem' }}>
                Access Restricted
              </h2>
              <p style={{ color: '#bcaaa4', fontWeight: 600, lineHeight: 1.6 }}>
                Calendar availability settings can only be managed by the superadmin (admin123).
              </p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              style={{
                background: '#4a3728', color: 'white', border: 'none',
                padding: '1rem 2rem', borderRadius: '15px', fontWeight: 800,
                cursor: 'pointer', fontSize: '0.95rem'
              }}
            >
              ← Back to Dashboard
            </button>
          </AuthCard>
        </CenteredContainer>
      </MainContent>
    </AdminContainer>
  );
}

/* ─────────── RENDER: Main ─────────── */
return (
  <AdminContainer>
    <AdminSidebar activeIndex={2} />
    <MainContent>

      <PageHeader>
        <div>
          <DashboardTitle>Availability</DashboardTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <ClinicName>Dr. A Dental Clinic</ClinicName>
            <span style={{ color: '#e0e0e0' }}>|</span>
            <span style={{ fontSize: '0.8rem', color: '#bcaaa4', fontWeight: 600 }}>
              Calendar Settings
            </span>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: '#f44336', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Logout
            </button>
          </div>
        </div>
      </PageHeader>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #fff8e1, #fff3cd)',
          border: '1px solid #ffe082',
          borderRadius: '14px',
          padding: '0.9rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          color: '#795548',
          fontWeight: 600,
          fontSize: '0.85rem'
        }}
      >
        <Info size={16} color="#f59300" style={{ flexShrink: 0 }} />
        Settings are per-branch. Click any future date on the calendar to block it or set a custom capacity.
        Hit <strong style={{ marginLeft: '0.2rem' }}>Save Changes</strong> to apply to Firestore.
      </motion.div>

      {/* Branch Tabs */}
      <BranchTabRow>
        {BRANCHES.map(b => (
          <BranchTab
            key={b.key}
            type="button"
            $active={activeBranch === b.key}
            $branch={b.key}
            onClick={() => setActiveBranch(b.key)}
            whileTap={{ scale: 0.97 }}
          >
            <BranchDot $branch={b.key} />
            {b.label}
          </BranchTab>
        ))}
      </BranchTabRow>

      <PageGrid>

        {/* ─── LEFT: Calendar ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <Panel
            key={activeBranch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PanelTitle>
              <CalendarX size={18} color="#f44336" />
              Configure Dates
              <span style={{
                marginLeft: 'auto',
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '0.2rem 0.6rem',
                borderRadius: '8px',
                background: activeBranch === 'sasa' ? '#e8f5e9' : '#e3f2fd',
                color: activeBranch === 'sasa' ? '#2e7d32' : '#1565c0'
              }}>
                {activeBranch === 'sasa' ? 'Sasa' : 'Matina'}
              </span>
            </PanelTitle>
            <PanelSubtitle>
              Click a future date to block it or set a custom daily cap.
            </PanelSubtitle>

            {/* Mini Calendar */}
            <CalHeader>
              <NavBtn
                type="button"
                disabled={!canGoPrev}
                onClick={() => setViewDate(new Date(vYear, vMonth - 1, 1))}
              >
                <ChevronLeft size={15} />
              </NavBtn>
              <MonthLabel>{MONTH_NAMES[vMonth]} {vYear}</MonthLabel>
              <NavBtn
                type="button"
                onClick={() => setViewDate(new Date(vYear, vMonth + 1, 1))}
              >
                <ChevronRight size={15} />
              </NavBtn>
            </CalHeader>

            <CalGrid>
              {DAY_LABELS.map(d => <DayHeader key={d}>{d}</DayHeader>)}
              {buildCells()}
            </CalGrid>

            <Legend>
              {[
                { bg: '#ffebee', border: '#f44336', label: 'Blocked' },
                { bg: '#fff8e1', border: '#ff9800', label: 'Custom cap' },
                { bg: '#4a3728', border: '#4a3728', label: 'Selected' },
                { bg: 'transparent', border: 'rgba(74,55,40,0.3)', label: 'Today' },
              ].map(item => (
                <LegendItem key={item.label}>
                  <LegendBox $bg={item.bg} $border={item.border} />
                  {item.label}
                </LegendItem>
              ))}
            </Legend>

            {/* ─── Day Settings Panel ─── */}
            <AnimatePresence>
              {selectedKey && (
                <DayPanel
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <DayPanelTitle>
                    <span>📅 {fmtShort(selectedKey)}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedKey(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bcaaa4', display: 'flex', alignItems: 'center' }}
                    >
                      <X size={16} />
                    </button>
                  </DayPanelTitle>

                  {/* Block toggle */}
                  <BlockToggleRow $checked={dayBlocked}>
                    <input
                      type="checkbox"
                      checked={dayBlocked}
                      onChange={e => setDayBlocked(e.target.checked)}
                    />
                    <ToggleIcon $checked={dayBlocked}>
                      {dayBlocked && <Check size={13} color="white" />}
                    </ToggleIcon>
                    <div>
                      <ToggleLabel $checked={dayBlocked}>
                        {dayBlocked ? 'Blocked — no bookings allowed' : 'Block this date'}
                      </ToggleLabel>
                      <div style={{ fontSize: '0.75rem', color: '#bcaaa4', fontWeight: 600, marginTop: '0.1rem' }}>
                        Patients won't be able to select this date
                      </div>
                    </div>
                  </BlockToggleRow>

                  {/* Custom cap */}
                  <CapInputRow>
                    <CapLabel>
                      <Hash size={12} /> Custom capacity for this date
                    </CapLabel>
                    <CapInput
                      type="number"
                      min="1"
                      max="100"
                      value={dayCapInput}
                      onChange={e => setDayCapInput(e.target.value)}
                      placeholder={`Global default: ${maxPerDay} slots`}
                      disabled={dayBlocked}
                      style={{ opacity: dayBlocked ? 0.4 : 1 }}
                    />
                    <div style={{ fontSize: '0.75rem', color: '#bcaaa4', fontWeight: 600, marginTop: '0.4rem' }}>
                      Leave empty to use the global daily cap ({maxPerDay} slots). Only applies if not blocked.
                    </div>
                  </CapInputRow>

                  {/* Service Restrictions */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <CapLabel>
                      <Stethoscope size={12} /> Service Availability
                    </CapLabel>
                    <div style={{
                      background: 'white',
                      border: '2px solid #f0f0f0',
                      borderRadius: '14px',
                      padding: '1rem',
                      marginTop: '0.5rem',
                      maxHeight: '180px',
                      overflowY: 'auto'
                    }}>
                      {globalServices.length === 0 ? (
                        <div style={{ fontSize: '0.8rem', color: '#bcaaa4' }}>No services defined yet.</div>
                      ) : (
                        globalServices.map(s => {
                          const isOffered = !dayDisabledServices.includes(s.id);
                          return (
                            <label key={s.id} style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.75rem',
                              padding: '0.5rem 0',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f9f9f9',
                              opacity: dayBlocked ? 0.4 : 1,
                              pointerEvents: dayBlocked ? 'none' : 'auto'
                            }}>
                              <input
                                type="checkbox"
                                checked={isOffered}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setDayDisabledServices(prev => prev.filter(id => id !== s.id));
                                  } else {
                                    setDayDisabledServices(prev => [...prev, s.id]);
                                  }
                                }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4a3728' }}>{s.name}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#bcaaa4', textTransform: 'uppercase' }}>{s.type}</span>
                              </div>
                              {!isOffered && (
                                <X size={14} style={{ marginLeft: 'auto', color: '#f44336' }} />
                              )}
                            </label>
                          );
                        })
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#bcaaa4', fontWeight: 600, marginTop: '0.5rem' }}>
                      Uncheck a service to disable it for this specific date and branch.
                    </div>
                  </div>

                  <DayApplyBtn type="button" onClick={handleApplyDay}>
                    <Check size={16} /> Apply to {fmtShort(selectedKey).split(',')[0]}
                  </DayApplyBtn>
                </DayPanel>
              )}
            </AnimatePresence>
          </Panel>
        </div>

        {/* ─── RIGHT: Global Cap + Config List ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* Global Daily Cap */}
          <Panel
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <PanelTitle>
              <Settings2 size={18} color="#4a3728" />
              Global Daily Cap
            </PanelTitle>
            <PanelSubtitle>
              Default max bookings per day for{' '}
              <strong>{activeBranch === 'sasa' ? 'Sasa Branch' : 'Matina Branch'}</strong>.
              Per-date overrides take priority.
            </PanelSubtitle>

            <SlotRow>
              <div>
                <SlotLabel>Max Reservations / Day</SlotLabel>
                <SlotSub>Applied to all dates without a custom cap</SlotSub>
              </div>
              <CounterGroup>
                <CounterBtn
                  type="button"
                  onClick={() => setMaxPerDay(p => Math.max(1, p - 1))}
                  disabled={maxPerDay <= 1}
                >
                  <Minus size={14} />
                </CounterBtn>
                <CountValue>{maxPerDay}</CountValue>
                <CounterBtn
                  type="button"
                  onClick={() => setMaxPerDay(p => Math.min(100, p + 1))}
                  disabled={maxPerDay >= 100}
                >
                  <Plus size={14} />
                </CounterBtn>
              </CounterGroup>
            </SlotRow>
          </Panel>

          {/* Date Config Summary */}
          <Panel
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            <PanelTitle>
              <MapPin size={18} color="#4a3728" />
              Date Overrides ({allConfiguredKeys.length})
            </PanelTitle>
            <PanelSubtitle>
              All configured dates for {activeBranch === 'sasa' ? 'Sasa Branch' : 'Matina Branch'}.
              Click trash to remove.
            </PanelSubtitle>

            <ConfigList>
              {allConfiguredKeys.length === 0 ? (
                <EmptyConfig>
                  No date overrides yet — all future dates use the global cap.
                </EmptyConfig>
              ) : (
                <AnimatePresence>
                  {allConfiguredKeys.map(key => {
                    const isBlocked = blockedDates.includes(key);
                    const hasCap = dateCaps[key] !== undefined;
                    const type = isBlocked ? 'blocked' : 'cap';
                    return (
                      <ConfigItem
                        key={key}
                        $type={type}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        layout
                      >
                        <ConfigBadge $type={type}>
                          {isBlocked ? 'Blocked' : `Cap: ${dateCaps[key]}`}
                        </ConfigBadge>
                        <ConfigDate $type={type}>{fmtDisplay(key)}</ConfigDate>
                        {!isBlocked && hasCap && (
                          <ConfigCap>{dateCaps[key]} slots</ConfigCap>
                        )}
                        <RemoveBtn type="button" onClick={() => removeConfig(key)} title="Remove override">
                          <Trash2 size={14} />
                        </RemoveBtn>
                      </ConfigItem>
                    );
                  })}
                </AnimatePresence>
              )}
            </ConfigList>

            <ActionRow>
              <SaveButton
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSaving ? 'Saving…' : <><Save size={15} /> Save Changes</>}
              </SaveButton>
              <ResetButton
                type="button"
                onClick={handleReset}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <RotateCcw size={14} /> Clear All
              </ResetButton>
            </ActionRow>
          </Panel>

        </div>
      </PageGrid>
    </MainContent>

    {/* Toast */}
    <AnimatePresence>
      {toast && (
        <Toast
          $error={toast.error}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
        >
          {toast.error ? '⚠️' : <Check size={15} />}
          {toast.msg}
        </Toast>
      )}
    </AnimatePresence>
  </AdminContainer>
  );
};

export default AdminCalendarSettings;
