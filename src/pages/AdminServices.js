import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, CheckCircle2, AlertCircle,
  Lock, LogIn, Eye, EyeOff, ShieldOff, Stethoscope, Search, ChevronDown, DollarSign
} from 'lucide-react';
import { db } from './firebase';
import {
  collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/Sidebar';

/* ========================
   Styled Components
======================== */

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fdfaf7;
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
  font-size: 0.85rem;
  font-weight: 800;
  color: #bcaaa4;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ServicesGrid = styled.div`
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
  border-radius: 28px;
  padding: 2.25rem;
  box-shadow: 0 10px 40px rgba(74, 55, 40, 0.05);
  border: 1px solid rgba(74, 55, 40, 0.05);

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
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

const AddServiceForm = styled.form`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.8rem 1.25rem;
  border: 2px solid #f0f0f0;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #4a3728;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #4a3728;
  }
`;

const SelectionContainer = styled.div`
  position: relative;
  min-width: 160px;
`;

const SelectTrigger = styled.button`
  width: 100%;
  padding: 0.8rem 1.25rem;
  border: 2px solid #f0f0f0;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 700;
  color: #4a3728;
  outline: none;
  cursor: pointer;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: all 0.2s;

  &:hover {
    border-color: #d7ccc8;
  }
`;

const SelectMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(74, 55, 40, 0.12);
  padding: 0.4rem;
  z-index: 50;
  border: 1px solid #f0f0f0;
`;

const SelectOption = styled.button`
  width: 100%;
  padding: 0.7rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${props => props.$isSelected ? '#fdfaf7' : 'transparent'};
  color: #4a3728;
  font-weight: 700;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background: #fdfaf7;
  }
`;

const IconButton = styled(motion.button)`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${props => props.$variant === 'danger' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(74, 55, 40, 0.1)'};
  color: ${props => props.$variant === 'danger' ? '#f44336' : '#4a3728'};

  &:hover {
    background: ${props => props.$variant === 'danger' ? '#f44336' : '#4a3728'};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

const ServiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
`;

const ServiceItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  background: white;
  border: 1px solid #f0ebe6;
  border-radius: 20px;
  transition: all 0.2s;
  gap: 1rem;

  &:hover {
    border-color: #d7ccc8;
    box-shadow: 0 4px 15px rgba(74, 55, 40, 0.08);
  }

  @media (max-width: 768px) {
    gap: 0.75rem;
    padding: 1rem 1.1rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0.85rem;
  }
`;

const ServiceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

const ServiceName = styled.span`
  font-weight: 800;
  color: #4a3728;
  font-size: 1rem;
  line-height: 1.2;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    -webkit-line-clamp: 1;
  }
`;

const ServiceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ServiceType = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  color: #bcaaa4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #fdfaf7;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  width: fit-content;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
  }
`;

const ServicePrice = styled.span`
  font-size: 0.7rem;
  font-weight: 800;
  color: #2e7d32;
  background: #e8f5e9;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 0.15rem 0.4rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #bcaaa4;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Toast = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${p => p.$error ? '#f44336' : '#4a3728'};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;

/* ========================
   Auth Screens (Duplicate for consistency)
======================== */

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
    box-shadow: 0 10px 20px rgba(74, 55, 40, 0.2);
  }
`;

const ACCOUNTS = {
  'admin123': 'superadmin',
  'matina123': 'matina',
  'sasa123': 'sasa'
};

const DEFAULT_MAJOR = [
  "REMOVABLE DENTURE", "FIXED/CROWN BRIDGES", "VENEERS", "RETAINERS",
  "TEETH WHITENING", "GINGIVECTOMY (GUM CONTOURING)", "ODONTECTOMY (WISDOM TOOTH EXTRACTION)",
  "FRENECTOMY", "ROOT CANAL TREATMENT", "IMPLANTS WITH ZIRCONIA", "DIASTEMA CLOSURE"
];

const DEFAULT_MINOR = [
  "FLUORIDE APPLICATION", "TOOTH RESTORATION (PASTA)", "TOOTH EXTRACTION (BUNOT)",
  "ORAL PROPHYLAXIS (CLEANING)", "TEMPORARY CROWNS"
];

// New service categories
const DEFAULT_DENTURES = [
  "REMOVABLE DENTURE - Plastic - 2000 per missing tooth",
  "REMOVABLE DENTURE - Porcelain - 2500 per missing tooth",
  "FULL DENTURE (ORDINARY) - 13000 per arch",
  "IVOCAP - 25000 per arch"
];

const DEFAULT_BRACES = [
  "BRACES PACKAGE - Upper and Lower - 45000",
  "BRACES PACKAGE - Upper or Lower only - 25000"
];

const DEFAULT_VENEERS = [
  "VENEERS COMPOSITE OR DIRECT - 4500 per tooth",
  "VENEERS EMAX - 20000 per tooth",
  "VENEERS ZIRCONIA - 25000 per tooth"
];

const DEFAULT_RETENTERS = [
  "HAWLEY'S RETAINERS - 7000 per arch",
  "CLEAR RETAINERS - 10000 per arch"
];

/* ========================
   Main Component
======================== */

const AdminServices = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceType, setNewServiceType] = useState('major');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_auth');
    if (saved && ACCOUNTS[saved]) {
      setIsAuthorized(true);
      setPassword(saved);
      setAdminRole(ACCOUNTS[saved]);
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized || adminRole !== 'superadmin') return;

    const q = query(collection(db, 'services'), orderBy('name', 'asc'));
    const unsub = onSnapshot(q, snap => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsub();
  }, [isAuthorized, adminRole]);

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
    sessionStorage.removeItem('admin_auth');
    navigate('/');
  };

  const showMsg = (msg, error = false) => {
    setToast({ msg, error });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    const serviceData = {
      name: newServiceName.trim().toUpperCase(),
      type: newServiceType
    };

    const priceNum = parseFloat(newServicePrice);
    if (!isNaN(priceNum) && priceNum > 0) {
      serviceData.price = priceNum;
    }

    try {
      await addDoc(collection(db, 'services'), serviceData);
      setNewServiceName('');
      setNewServicePrice('');
      showMsg('Service added successfully');
    } catch (err) {
      showMsg('Failed to add service', true);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      showMsg('Service deleted');
    } catch (err) {
      showMsg('Failed to delete', true);
    }
  };

  const handleInitialize = async () => {
    if (!window.confirm('Initialize with default services? This will overwrite nothing but add to the list.')) return;
    setIsLoading(true);
    try {
      // Add major services
      for (const s of DEFAULT_MAJOR) {
        if (!services.some(ex => ex.name === s)) {
          await addDoc(collection(db, 'services'), { name: s, type: 'major' });
        }
      }
      // Add minor services
      for (const s of DEFAULT_MINOR) {
        if (!services.some(ex => ex.name === s)) {
          await addDoc(collection(db, 'services'), { name: s, type: 'minor' });
        }
      }
      // Add denture services
      for (const s of DEFAULT_DENTURES) {
        if (!services.some(ex => ex.name === s)) {
          await addDoc(collection(db, 'services'), { name: s, type: 'dentures' });
        }
      }
      // Add braces services
      for (const s of DEFAULT_BRACES) {
        if (!services.some(ex => ex.name === s)) {
          await addDoc(collection(db, 'services'), { name: s, type: 'braces' });
        }
      }
      // Add veneers services
      for (const s of DEFAULT_VENEERS) {
        if (!services.some(ex => ex.name === s)) {
          await addDoc(collection(db, 'services'), { name: s, type: 'veneers' });
        }
      }
      // Add retainers services
      for (const s of DEFAULT_RETENTERS) {
        if (!services.some(ex => ex.name === s)) {
          await addDoc(collection(db, 'services'), { name: s, type: 'retainers' });
        }
      }
      showMsg('Initialized defaults');
    } catch (err) {
      showMsg('Initialization failed', true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const majorServices = filteredServices.filter(s => s.type === 'major');
  const minorServices = filteredServices.filter(s => s.type === 'minor');

  const denturesServices = filteredServices.filter(s => s.type === 'dentures');
  const bracesServices = filteredServices.filter(s => s.type === 'braces');
  const veneersServices = filteredServices.filter(s => s.type === 'veneers');
  const retainersServices = filteredServices.filter(s => s.type === 'retainers');

  /* ---------- Auth View ---------- */
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
              Management area restricted. Enter Access Key.
            </p>
          </div>
          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter Access Key"
                style={{ width: '100%', paddingRight: '3.5rem' }}
              />
              <div
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#bcaaa4' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {loginError && <p style={{ color: '#f44336', fontSize: '0.9rem', fontWeight: 600 }}>{loginError}</p>}
            <LoginButton type="submit">
              <LogIn size={20} /> Access Services
            </LoginButton>
          </form>
        </AuthCard>
      </CenteredContainer>
    );
  }

  /* ---------- Access Restricted View ---------- */
  if (adminRole !== 'superadmin') {
    return (
      <AdminContainer>
        <AdminSidebar activeIndex={5} />
        <MainContent>
          <CenteredContainer style={{ minHeight: 'auto', paddingTop: '6rem' }}>
            <AuthCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: '#ffebee', padding: '1.5rem', borderRadius: '50%' }}>
                <ShieldOff size={48} color="#f44336" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4a3728' }}>Access Restricted</h2>
              <p style={{ color: '#bcaaa4', fontWeight: 600 }}>Only superadmin can manage services.</p>
              <LoginButton onClick={() => navigate('/admin')}>← Back to Dashboard</LoginButton>
            </AuthCard>
          </CenteredContainer>
        </MainContent>
      </AdminContainer>
    );
  }

  /* ---------- Main View ---------- */
  return (
    <AdminContainer>
      <AdminSidebar activeIndex={5} />
      <MainContent>
        <PageHeader>
          <div>
            <DashboardTitle>Services</DashboardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <ClinicName>Dr. A Dental Clinic</ClinicName>
              <span style={{ color: '#e0e0e0' }}>|</span>
              <span style={{ fontSize: '0.8rem', color: '#bcaaa4', fontWeight: 600 }}>Service Management</span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#f44336', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                Logout
              </button>
            </div>
          </div>
          {services.length === 0 && !isLoading && (
            <LoginButton onClick={handleInitialize} style={{ width: 'auto' }}>
              Initialize Defaults
            </LoginButton>
          )}
        </PageHeader>

        <Panel style={{ marginBottom: '2rem' }}>
          <PanelTitle><Plus size={18} /> Add New Service</PanelTitle>
          <PanelSubtitle>Define a new dental procedure and its category.</PanelSubtitle>
          <AddServiceForm onSubmit={handleAddService}>
            <Input
              type="text"
              placeholder="Service Name (e.g. TEETH WHITENING)"
              value={newServiceName}
              onChange={e => setNewServiceName(e.target.value)}
              required
            />

            <div style={{ position: 'relative', minWidth: '130px' }}>
              <DollarSign size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: '#bcaaa4' }} />
              <Input
                type="number"
                placeholder="Price"
                value={newServicePrice}
                onChange={e => setNewServicePrice(e.target.value)}
                min="0"
                step="0.01"
                style={{ paddingLeft: '2.5rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>

            <SelectionContainer>
              <SelectTrigger
                type="button"
                onClick={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                      { { major: 'Major Service', minor: 'Minor Service', dentures: 'Dentures', braces: 'Braces', veneers: 'Veneers', retainers: 'Retainers' }[newServiceType] }
                <ChevronDown size={14} style={{ transform: showTypeDropdown ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </SelectTrigger>
              <AnimatePresence>
                {showTypeDropdown && (
                  <SelectMenu
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <SelectOption
                      type="button"
                      $isSelected={newServiceType === 'major'}
                      onClick={() => { setNewServiceType('major'); setShowTypeDropdown(false); }}
                    >
                      Major Service
                    </SelectOption>
                    <SelectOption
                      type="button"
                      $isSelected={newServiceType === 'minor'}
                      onClick={() => { setNewServiceType('minor'); setShowTypeDropdown(false); }}
                    >
                      Minor Service
                    </SelectOption>
                    <SelectOption
                      type="button"
                      $isSelected={newServiceType === 'dentures'}
                      onClick={() => { setNewServiceType('dentures'); setShowTypeDropdown(false); }}
                    >
                      Dentures
                    </SelectOption>
                    <SelectOption
                      type="button"
                      $isSelected={newServiceType === 'braces'}
                      onClick={() => { setNewServiceType('braces'); setShowTypeDropdown(false); }}
                    >
                      Braces
                    </SelectOption>
                    <SelectOption
                      type="button"
                      $isSelected={newServiceType === 'veneers'}
                      onClick={() => { setNewServiceType('veneers'); setShowTypeDropdown(false); }}
                    >
                      Veneers
                    </SelectOption>
                    <SelectOption
                      type="button"
                      $isSelected={newServiceType === 'retainers'}
                      onClick={() => { setNewServiceType('retainers'); setShowTypeDropdown(false); }}
                    >
                      Retainers
                    </SelectOption>
                  </SelectMenu>
                )}
              </AnimatePresence>
            </SelectionContainer>

            <IconButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Plus size={20} />
            </IconButton>
          </AddServiceForm>

          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#bcaaa4' }} />
            <Input
              placeholder="Search services..."
              style={{ paddingLeft: '3rem' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </Panel>

        <ServicesGrid>
          {/* Major Services */}
          <Panel initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <PanelTitle><Stethoscope size={18} color="#4caf50" /> Major Services ({majorServices.length})</PanelTitle>
            <PanelSubtitle>Invasive or complex dental procedures.</PanelSubtitle>
            <ServiceList>
              {majorServices.length === 0 ? (
                <EmptyState>No major services found.</EmptyState>
              ) : (
                <AnimatePresence>
                  {majorServices.map(s => (
                    <ServiceItem key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ServiceInfo>
                        <ServiceName>{s.name}</ServiceName>
                        <ServiceMeta>
                          <ServiceType>Major Procedure</ServiceType>
                          {s.price != null && <ServicePrice>₱{Number(s.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</ServicePrice>}
                        </ServiceMeta>
                      </ServiceInfo>
                      <IconButton $variant="danger" onClick={() => handleDeleteService(s.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </ServiceItem>
                  ))}
                </AnimatePresence>
              )}
            </ServiceList>
          </Panel>

          {/* Minor Services */}
          <Panel initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <PanelTitle><CheckCircle2 size={18} color="#2196f3" /> Minor Services ({minorServices.length})</PanelTitle>
            <PanelSubtitle>Routine checkups and maintenance.</PanelSubtitle>
            <ServiceList>
              {minorServices.length === 0 ? (
                <EmptyState>No minor services found.</EmptyState>
              ) : (
                <AnimatePresence>
                  {minorServices.map(s => (
                    <ServiceItem key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ServiceInfo>
                        <ServiceName>{s.name}</ServiceName>
                        <ServiceMeta>
                          <ServiceType>Minor Procedure</ServiceType>
                          {s.price != null && <ServicePrice>₱{Number(s.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</ServicePrice>}
                        </ServiceMeta>
                      </ServiceInfo>
                      <IconButton $variant="danger" onClick={() => handleDeleteService(s.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </ServiceItem>
                  ))}
                </AnimatePresence>
              )}
            </ServiceList>
          </Panel>

          {/* Dentures Services */}
          <Panel initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }}>
            <PanelTitle><Stethoscope size={18} color="#4caf50" /> Dentures ({denturesServices.length})</PanelTitle>
            <PanelSubtitle>Dental prosthetics and removable options.</PanelSubtitle>
            <ServiceList>
              {denturesServices.length === 0 ? (
                <EmptyState>No denture services found.</EmptyState>
              ) : (
                <AnimatePresence>
                  {denturesServices.map(s => (
                    <ServiceItem key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ServiceInfo>
                        <ServiceName>{s.name}</ServiceName>
                        <ServiceMeta>
                          <ServiceType>Dentures Service</ServiceType>
                          {s.price != null && <ServicePrice>₱{Number(s.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</ServicePrice>}
                        </ServiceMeta>
                      </ServiceInfo>
                      <IconButton $variant="danger" onClick={() => handleDeleteService(s.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </ServiceItem>
                  ))}
                </AnimatePresence>
              )}
            </ServiceList>
          </Panel>

          {/* Braces Services */}
          <Panel initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }}>
            <PanelTitle><Stethoscope size={18} color="#4caf50" /> Braces ({bracesServices.length})</PanelTitle>
            <PanelSubtitle>Orthodontic brace options.</PanelSubtitle>
            <ServiceList>
              {bracesServices.length === 0 ? (
                <EmptyState>No braces services found.</EmptyState>
              ) : (
                <AnimatePresence>
                  {bracesServices.map(s => (
                    <ServiceItem key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ServiceInfo>
                        <ServiceName>{s.name}</ServiceName>
                        <ServiceMeta>
                          <ServiceType>Braces Service</ServiceType>
                          {s.price != null && <ServicePrice>₱{Number(s.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</ServicePrice>}
                        </ServiceMeta>
                      </ServiceInfo>
                      <IconButton $variant="danger" onClick={() => handleDeleteService(s.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </ServiceItem>
                  ))}
                </AnimatePresence>
              )}
            </ServiceList>
          </Panel>

          {/* Veneers Services */}
          <Panel initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }}>
            <PanelTitle><Stethoscope size={18} color="#4caf50" /> Veneers ({veneersServices.length})</PanelTitle>
            <PanelSubtitle>Cosmetic veneer options.</PanelSubtitle>
            <ServiceList>
              {veneersServices.length === 0 ? (
                <EmptyState>No veneers services found.</EmptyState>
              ) : (
                <AnimatePresence>
                  {veneersServices.map(s => (
                    <ServiceItem key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ServiceInfo>
                        <ServiceName>{s.name}</ServiceName>
                        <ServiceMeta>
                          <ServiceType>Veneers Service</ServiceType>
                          {s.price != null && <ServicePrice>₱{Number(s.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</ServicePrice>}
                        </ServiceMeta>
                      </ServiceInfo>
                      <IconButton $variant="danger" onClick={() => handleDeleteService(s.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </ServiceItem>
                  ))}
                </AnimatePresence>
              )}
            </ServiceList>
          </Panel>

          {/* Retainers Services */}
          <Panel initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }}>
            <PanelTitle><Stethoscope size={18} color="#4caf50" /> Retainers ({retainersServices.length})</PanelTitle>
            <PanelSubtitle>Retention appliances.</PanelSubtitle>
            <ServiceList>
              {retainersServices.length === 0 ? (
                <EmptyState>No retainers services found.</EmptyState>
              ) : (
                <AnimatePresence>
                  {retainersServices.map(s => (
                    <ServiceItem key={s.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ServiceInfo>
                        <ServiceName>{s.name}</ServiceName>
                        <ServiceMeta>
                          <ServiceType>Retainers Service</ServiceType>
                          {s.price != null && <ServicePrice>₱{Number(s.price).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</ServicePrice>}
                        </ServiceMeta>
                      </ServiceInfo>
                      <IconButton $variant="danger" onClick={() => handleDeleteService(s.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </ServiceItem>
                  ))}
                </AnimatePresence>
              )}
            </ServiceList>
          </Panel>
        </ServicesGrid>
      </MainContent>

      <AnimatePresence>
        {toast && (
          <Toast $error={toast.error} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
            {toast.error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            {toast.msg}
          </Toast>
        )}
      </AnimatePresence>
    </AdminContainer>
  );
};

export default AdminServices;
