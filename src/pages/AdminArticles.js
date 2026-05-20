import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, ShieldOff, Lock, LogIn, Eye, EyeOff, FileText, Search, ExternalLink, Image as ImageIcon
} from 'lucide-react';

import { db } from './firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp, writeBatch } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/Sidebar';
import { highlightsData } from '../data/mockArticles';

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
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 700;
  color: #4a3728;
`;

const Input = styled.input`
  width: 100%;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem 1.25rem;
  border: 2px solid #f0f0f0;
  border-radius: 14px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #4a3728;
  outline: none;
  transition: all 0.2s;
  min-height: 150px;
  resize: vertical;

  &:focus {
    border-color: #4a3728;
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
  margin-top: 1rem;
  
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
  max-height: 800px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }
`;

const ListItem = styled(motion.div)`
  display: flex;
  padding: 1.25rem;
  background: white;
  border: 1px solid #f0ebe6;
  border-radius: 20px;
  transition: all 0.2s;
  gap: 1.5rem;
  align-items: center;

  &:hover {
    border-color: #d7ccc8;
    box-shadow: 0 4px 15px rgba(74, 55, 40, 0.08);
  }

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ItemImage = styled.div`
  width: 120px;
  height: 80px;
  border-radius: 12px;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  background-color: #f0f0f0;
  flex-shrink: 0;

  @media (max-width: 600px) {
    width: 100%;
    height: 150px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

const ItemName = styled.span`
  font-weight: 800;
  color: #4a3728;
  font-size: 1.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemDesc = styled.span`
  font-size: 0.85rem;
  color: #6d4c41;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

const OutlineButton = styled(motion.button)`
  background: transparent;
  color: #4a3728;
  border: 2px solid #e0d6cf;
  border-radius: 14px;
  padding: 0.75rem 1.5rem;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #4a3728;
    color: white;
    border-color: #4a3728;
  }
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

const AdminArticles = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [adminRole, setAdminRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageData, setImageData] = useState(''); // base64 string
  const [content, setContent] = useState('');
  
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

    // Fetch Articles
    const qArticles = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubArticles = onSnapshot(qArticles, snap => {
      setArticles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => {
      unsubArticles();
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

  const handleAddArticle = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !imageData.trim() || !content.trim()) {
      showMsg('All fields are required', true);
      return;
    }

    // Store all data including image (base64) directly in Firestore
    try {
      await addDoc(collection(db, 'articles'), {
        title: title.trim(),
        description: description.trim(),
        image: imageData, // base64 data URL stored directly in Firestore
        content: content.trim(),
        createdAt: serverTimestamp()
      });

      setTitle('');
      setDescription('');
      setImageData('');
      setContent('');
      showMsg('Article added successfully');
    } catch (err) {
      console.error('Add article error:', err);
      showMsg(`Failed to add article: ${err.message}`, true);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to remove this article?')) return;
    try {
      await deleteDoc(doc(db, 'articles', id));
      showMsg('Article removed');
    } catch (err) {
      showMsg('Failed to remove', true);
    }
  };

  const handleMigrateMockData = async () => {
    if (!window.confirm('This will add the 5 mock articles to the database. Continue?')) return;
    
    try {
      const batch = writeBatch(db);
      
      highlightsData.forEach((item) => {
        const newRef = doc(collection(db, 'articles'));
        batch.set(newRef, {
          title: item.title,
          description: item.description,
          image: item.image, // store mock image as 'image'
          content: item.content,
          createdAt: new Date() // Using new Date() because serverTimestamp can act weird in some batches
        });
      });
      
      await batch.commit();
      showMsg('Mock data migrated successfully!');
    } catch (err) {
      console.error(err);
      showMsg('Failed to migrate data', true);
    }
  };

  const filteredArticles = articles.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
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
              <LogIn size={20} /> Access Articles
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
        <AdminSidebar activeIndex={7} />
        <MainContent>
          <CenteredContainer style={{ minHeight: 'auto', paddingTop: '6rem' }}>
            <AuthCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ background: '#ffebee', padding: '1.5rem', borderRadius: '50%' }}>
                <ShieldOff size={48} color="#f44336" />
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#4a3728' }}>Access Restricted</h2>
              <p style={{ color: '#bcaaa4', fontWeight: 600 }}>Only superadmin can manage articles.</p>
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
      <AdminSidebar activeIndex={7} />
      <MainContent>
        <PageHeader>
          <div>
            <DashboardTitle>Articles</DashboardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <ClinicName>Dr. A Dental Clinic</ClinicName>
              <span style={{ color: '#e0e0e0' }}>|</span>
              <span style={{ fontSize: '0.8rem', color: '#bcaaa4', fontWeight: 600 }}>Content Management</span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#f44336', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                Logout
              </button>
            </div>
          </div>
        </PageHeader>

        <Panel style={{ marginBottom: '2rem' }}>
          <PanelTitle><Plus size={18} /> Publish New Article</PanelTitle>
          <PanelSubtitle>Add new highlights and articles to show on the Home page carousel.</PanelSubtitle>
          <AddForm onSubmit={handleAddArticle}>
            <InputGroup>
              <Label>Article Title</Label>
              <Input
                type="text"
                placeholder="e.g. New Laser Whitening Technology"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Short Description (Shown on card)</Label>
              <Input
                type="text"
                placeholder="A brief summary of the article..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <Label>Cover Image (Upload)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={e => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setImageData(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>Full Content</Label>
              <TextArea
                placeholder="Write the full article here. Double line breaks create new paragraphs."
                value={content}
                onChange={e => setContent(e.target.value)}
                required
              />
            </InputGroup>

            <SubmitButton type="submit" whileTap={{ scale: 0.98 }}>
              <Plus size={20} /> Publish Article
            </SubmitButton>
          </AddForm>

          {articles.length === 0 && !isLoading && (
             <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff8e1', borderRadius: '14px', border: '1px solid #ffe082', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div>
                 <h4 style={{ margin: '0 0 0.5rem 0', color: '#f57f17' }}>Database is empty</h4>
                 <p style={{ margin: 0, fontSize: '0.85rem', color: '#ffb300' }}>Would you like to import the initial mock articles?</p>
               </div>
               <OutlineButton onClick={handleMigrateMockData}>
                 Migrate Mock Data
               </OutlineButton>
             </div>
          )}

          <div style={{ position: 'relative', marginTop: '2rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#bcaaa4' }} />
            <Input
              placeholder="Search articles..."
              style={{ paddingLeft: '3rem', width: '100%', boxSizing: 'border-box' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </Panel>

        <MainGrid>
          <Panel initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <PanelTitle><FileText size={18} color="#4a3728" /> Published Articles ({articles.length})</PanelTitle>
            <PanelSubtitle>List of all live articles on the website.</PanelSubtitle>

            <ListContainer>
              {filteredArticles.length === 0 && !isLoading ? (
                <EmptyState>No articles found.</EmptyState>
              ) : (
                <AnimatePresence>
                  {filteredArticles.map(a => (
                    <ListItem key={a.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <ItemImage $src={a.image}>
                        {!a.image && <ImageIcon size={24} color="#bcaaa4" style={{ margin: 'auto', display: 'block', paddingTop: '28px' }} />}
                      </ItemImage>
                      <ItemInfo>
                        <ItemName>{a.title}</ItemName>
                        <ItemDesc>{a.description}</ItemDesc>
                      </ItemInfo>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <IconButton 
                          title="View live"
                          onClick={() => navigate(`/article/${a.id}`)}
                        >
                          <ExternalLink size={18} />
                        </IconButton>
                        <IconButton 
                          $variant="danger" 
                          onClick={() => handleDeleteArticle(a.id)}
                          title="Delete article"
                        >
                          <Trash2 size={18} />
                        </IconButton>
                      </div>
                    </ListItem>
                  ))}
                </AnimatePresence>
              )}
            </ListContainer>
          </Panel>
        </MainGrid>

        <AnimatePresence>
          {toast && (
            <Toast
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              $error={toast.error}
            >
              {toast.msg}
            </Toast>
          )}
        </AnimatePresence>
      </MainContent>
    </AdminContainer>
  );
};

export default AdminArticles;
