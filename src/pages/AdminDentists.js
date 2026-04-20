import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, CheckCircle2, AlertCircle,
  Lock, LogIn, Eye, EyeOff, ShieldOff, Users, Search,
  CheckSquare, Square, Stethoscope, MapPin, Pencil, X
} from 'lucide-react';
import { db } from './firebase';
import {
  collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, updateDoc
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

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
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

const AddForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.75rem;
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

const ServicesSelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
  background: #fdfaf7;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #f0ebe6;
  max-height: 250px;
  overflow-y: auto;
  
  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
`;

const ServiceCheckbox = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: white;
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
`;

const SubmitButton = styled(motion.button)`
  background: #4a3728;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 1rem;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #5a4331;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
`;

const ListItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
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
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
`;

const ItemName = styled.span`
  font-weight: 800;
  color: #4a3728;
  font-size: 1.1rem;
`;

const ServicesTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ServiceTag = styled.span`
  background: #ffecb3;
  color: #ff6f00;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
`;

const BranchBadge = styled.span`
  background: ${p => p.$branch === 'sasa' ? '#e3f2fd' : p.$branch === 'matina' ? '#fce4ec' : '#f3e5f5'};
  color: ${p => p.$branch === 'sasa' ? '#1565c0' : p.$branch === 'matina' ? '#ad1457' : '#6a1b9a'};
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  text-transform: capitalize;
`;

const BranchSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const BranchOption = styled.button`
  padding: 0.55rem 1.1rem;
  border-radius: 12px;
  border: 2px solid ${p => p.$active ? '#4a3728' : '#f0f0f0'};
  background: ${p => p.$active ? '#4a3728' : 'white'};
  color: ${p => p.$active ? 'white' : '#bcaaa4'};
  font-size: 0.85rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4a3728;
    color: ${p => p.$active ? 'white' : '#4a3728'};
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const ModalCard = styled(motion.div)`
  background: white;
  border-radius: 28px;
  padding: 2.25rem;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 60px rgba(74,55,40,0.18);

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
`;

const ModalCloseBtn = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: #f5f5f5;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4a3728;
  transition: all 0.2s;

  &:hover { background: #e0e0e0; }
`;

/* ========================
   Auth Screens
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


/* ========================
   Main Component
======================== */

const AdminDentists = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [dentists, setDentists] = useState([]);
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newDentistName, setNewDentistName] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState('');

  const [editingDentist, setEditingDentist] = useState(null);
  const [editName, setEditName] = useState('');
  const [editServices, setEditServices] = useState([]);
  const [editBranch, setEditBranch] = useState('');

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

    // Fetch Dentists
    const qDentists = query(collection(db, 'dentists'), orderBy('name', 'asc'));
    const unsubDentists = onSnapshot(qDentists, snap => {
      setDentists(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Services
    const qServices = query(collection(db, 'services'), orderBy('name', 'asc'));
    const unsubServices = onSnapshot(qServices, snap => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => {
      unsubDentists();
      unsubServices();
    }
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

  const toggleServiceSelection = (serviceName) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceName)) {
        return prev.filter(name => name !== serviceName);
      } else {
        return [...prev, serviceName];
      }
    });
  };

  const handleAddDentist = async (e) => {
    e.preventDefault();
    if (!newDentistName.trim()) {
      showMsg('Dentist name is required', true);
      return;
    }

    if (selectedServices.length === 0) {
      showMsg('Please assign at least one service', true);
      return;
    }

    if (!selectedBranch) {
      showMsg('Please assign a branch', true);
      return;
    }

    try {
      await addDoc(collection(db, 'dentists'), {
        name: newDentistName.trim(),
        services: selectedServices,
        branch: selectedBranch
      });
      setNewDentistName('');
      setSelectedServices([]);
      setSelectedBranch('');
      showMsg('Dentist added successfully');
    } catch (err) {
      showMsg('Failed to add dentist', true);
    }
  };

  const handleDeleteDentist = async (id) => {
    if (!window.confirm('Are you sure you want to remove this dentist?')) return;
    try {
      await deleteDoc(doc(db, 'dentists', id));
      showMsg('Dentist removed');
    } catch (err) {
      showMsg('Failed to remove', true);
    }
  };

  const openEditModal = (dentist) => {
    setEditingDentist(dentist);
    setEditName(dentist.name);
    setEditServices(dentist.services || []);
    setEditBranch(dentist.branch || '');
  };

  const closeEditModal = () => {
    setEditingDentist(null);
  };

  const toggleEditService = (serviceName) => {
    setEditServices(prev =>
      prev.includes(serviceName)
        ? prev.filter(s => s !== serviceName)
        : [...prev, serviceName]
    );
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) { showMsg('Name is required', true); return; }
    if (editServices.length === 0) { showMsg('Assign at least one service', true); return; }
    if (!editBranch) { showMsg('Please assign a branch', true); return; }
    try {
      await updateDoc(doc(db, 'dentists', editingDentist.id), {
        name: editName.trim(),
        services: editServices,
        branch: editBranch
      });
      showMsg('Dentist updated successfully');
      closeEditModal();
    } catch (err) {
      showMsg('Failed to update dentist', true);
    }
  };

  const filteredDentists = dentists.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <LogIn size={20} /> Access Dentists
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
        <AdminSidebar activeIndex={6} />
        <MainContent>
          <CenteredContainer style={{ minHeight: 'auto', paddingTop: '6rem' }}>
            <AuthCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: '#ffebee', padding: '1.5rem', borderRadius: '50%' }}>
                <ShieldOff size={48} color="#f44336" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4a3728' }}>Access Restricted</h2>
              <p style={{ color: '#bcaaa4', fontWeight: 600 }}>Only superadmin can manage dentists.</p>
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
      <AdminSidebar activeIndex={6} />
      <MainContent>
        <PageHeader>
          <div>
            <DashboardTitle>Dentists</DashboardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <ClinicName>Dr. A Dental Clinic</ClinicName>
              <span style={{ color: '#e0e0e0' }}>|</span>
              <span style={{ fontSize: '0.8rem', color: '#bcaaa4', fontWeight: 600 }}>Personnel Management</span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#f44336', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                Logout
              </button>
            </div>
          </div>
        </PageHeader>

        <Panel style={{ marginBottom: '2rem' }}>
          <PanelTitle><Plus size={18} /> Add New Dentist</PanelTitle>
          <PanelSubtitle>Register a dentist and assign their designated services.</PanelSubtitle>
          <AddForm onSubmit={handleAddDentist}>
            <InputGroup>
              <Input
                type="text"
                placeholder="Dentist Name (e.g. Dr. Jane Doe)"
                value={newDentistName}
                onChange={e => setNewDentistName(e.target.value)}
                required
              />
            </InputGroup>

            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4a3728', display: 'block', marginBottom: '0.5rem' }}>
                Assigned Branch
              </span>
              <BranchSelector>
                {['sasa', 'matina', 'both'].map(branch => (
                  <BranchOption
                    key={branch}
                    type="button"
                    $active={selectedBranch === branch}
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {branch.charAt(0).toUpperCase() + branch.slice(1)}
                  </BranchOption>
                ))}
              </BranchSelector>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4a3728', display: 'block', marginBottom: '0.5rem' }}>
                Designated Services from Firebase
              </span>
              <ServicesSelectionGrid>
                {Array.from(new Set(services.map(s => s.name))).map((serviceName, index) => {
                  const isSelected = selectedServices.includes(serviceName);
                  return (
                    <ServiceCheckbox key={index} onClick={() => toggleServiceSelection(serviceName)}>                     
                      {isSelected ? <CheckSquare size={18} color="#4a3728" /> : <Square size={18} color="#bcaaa4" />}
                      <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 600, color: isSelected ? '#4a3728' : '#6d5a4d' }}>
                        {serviceName}
                      </span>
                    </ServiceCheckbox>
                  )
                })}
                {services.length === 0 && !isLoading && (
                  <span style={{ color: '#bcaaa4', fontSize: '0.85rem' }}>No services found in Firebase. Please add services first.</span>
                )}
              </ServicesSelectionGrid>
            </div>

            <SubmitButton type="submit" whileTap={{ scale: 0.98 }}>
              <Plus size={20} /> Register Dentist
            </SubmitButton>
          </AddForm>

          <div style={{ position: 'relative', marginTop: '2rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#bcaaa4' }} />
            <Input
              placeholder="Search dentists..."
              style={{ paddingLeft: '3rem', width: '100%', boxSizing: 'border-box' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </Panel>

        <MainGrid>
          <Panel initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PanelTitle><Users size={18} color="#4a3728" /> Registered Dentists ({dentists.length})</PanelTitle>
            <PanelSubtitle>List of all clinic dentists and their specializations.</PanelSubtitle>

            <ListContainer>
              {filteredDentists.length === 0 ? (
                <EmptyState>No dentists found.</EmptyState>
              ) : (
                <AnimatePresence>
                  {filteredDentists.map(d => (
                    <ListItem key={d.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <HeaderRow>
                        <ItemInfo>
                          <ItemName>{d.name}</ItemName>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                            {d.branch && (
                              <BranchBadge $branch={d.branch}>
                                <MapPin size={10} />
                                {d.branch.charAt(0).toUpperCase() + d.branch.slice(1)}
                              </BranchBadge>
                            )}
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#bcaaa4', fontWeight: 600, marginTop: '0.2rem' }}>
                            Designated Services:
                          </span>
                          <ServicesTags>
                            {(d.services || []).map((s, i) => (
                              <ServiceTag key={i}>
                                <Stethoscope size={10} /> {s}
                              </ServiceTag>
                            ))}
                            {(!d.services || d.services.length === 0) && (
                              <span style={{ fontSize: '0.8rem', color: '#f44336', fontWeight: 600 }}>None assigned</span>
                            )}
                          </ServicesTags>
                        </ItemInfo>
                        <IconButton onClick={() => openEditModal(d)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ marginLeft: 'auto' }}>
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton $variant="danger" onClick={() => handleDeleteDentist(d.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Trash2 size={16} />
                        </IconButton>
                      </HeaderRow>
                    </ListItem>
                  ))}
                </AnimatePresence>
              )}
            </ListContainer>
          </Panel>
        </MainGrid>
      </MainContent>

      <AnimatePresence>
        {toast && (
          <Toast $error={toast.error} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
            {toast.error ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            {toast.msg}
          </Toast>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingDentist && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeEditModal}
          >
            <ModalCard
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <ModalCloseBtn onClick={closeEditModal}><X size={18} /></ModalCloseBtn>

              <PanelTitle style={{ marginBottom: '0.25rem' }}><Pencil size={18} /> Edit Dentist</PanelTitle>
              <PanelSubtitle>Update the dentist's name, branch, and services.</PanelSubtitle>

              {/* Name */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4a3728', display: 'block', marginBottom: '0.5rem' }}>Name</span>
                <Input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box' }}
                />
              </div>

              {/* Branch */}
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4a3728', display: 'block', marginBottom: '0.5rem' }}>Assigned Branch</span>
                <BranchSelector>
                  {['sasa', 'matina', 'both'].map(branch => (
                    <BranchOption
                      key={branch}
                      type="button"
                      $active={editBranch === branch}
                      onClick={() => setEditBranch(branch)}
                    >
                      <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {branch.charAt(0).toUpperCase() + branch.slice(1)}
                    </BranchOption>
                  ))}
                </BranchSelector>
              </div>

              {/* Services */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#4a3728', display: 'block', marginBottom: '0.5rem' }}>Designated Services</span>
                <ServicesSelectionGrid>
                  {Array.from(new Set(services.map(s => s.name))).map((serviceName, index) => {
                    const isSelected = editServices.includes(serviceName);
                    return (
                      <ServiceCheckbox key={index} onClick={() => toggleEditService(serviceName)}>
                        {isSelected ? <CheckSquare size={18} color="#4a3728" /> : <Square size={18} color="#bcaaa4" />}
                        <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 600, color: isSelected ? '#4a3728' : '#6d5a4d' }}>
                          {serviceName}
                        </span>
                      </ServiceCheckbox>
                    );
                  })}
                </ServicesSelectionGrid>
              </div>

              <SubmitButton type="button" onClick={handleSaveEdit} whileTap={{ scale: 0.98 }}>
                <CheckCircle2 size={20} /> Save Changes
              </SubmitButton>
            </ModalCard>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </AdminContainer>
  );
};

export default AdminDentists;
