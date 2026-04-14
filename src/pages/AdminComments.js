import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from "framer-motion";
import { Loader2, Lock, LogIn, Eye, EyeOff, UserCircle2 } from 'lucide-react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import AdminSidebar from '../components/Sidebar';

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
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

const CommentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const CommentCard = styled(motion.div)`
  background: white;
  border-radius: 25px;
  padding: 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProfilePic = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f0ebe6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #bcaaa4;
  flex-shrink: 0;
`;

const CommenterName = styled.h3`
  font-size: 1.5rem;
  font-weight: 900;
  color: #4a3728;
`;


const CommentDate = styled.div`
  font-size: 0.8rem;
  color: #bcaaa4;
  font-weight: 700;
`;

const CommentText = styled.p`
  font-size: 1.05rem;
  color: #4a3728;
  line-height: 1.6;
  font-weight: 500;
  background-color: #fdfaf7;
  padding: 1.5rem;
  border-radius: 15px;
  margin-top: 0.5rem;
  white-space: pre-wrap;
`;

const EmptyState = styled.div`
  padding: 4rem;
  text-align: center;
  background: white;
  border-radius: 30px;
  width: 100%;
  color: #bcaaa4;
  font-weight: 600;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #fdfaf7;
  padding: 2rem;
  text-align: center;
`;

const LoginCard = styled(motion.div)`
  background: white;
  padding: 3rem;
  border-radius: 40px;
  box-shadow: 0 20px 50px rgba(74, 55, 40, 0.1);
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

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(74, 55, 40, 0.2);
  }
`;

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth === 'admin123') {
      setIsAuthorized(true);
      setPassword('admin123');
    }
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;

    const q = query(
      collection(db, 'comments'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      if (error.code === 'permission-denied') {
        setLoginError("Invalid access key or permissions.");
        setIsAuthorized(false);
        sessionStorage.removeItem('admin_auth');
      }
    });

    return () => unsubscribe();
  }, [isAuthorized, password]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthorized(true);
      setLoginError('');
      sessionStorage.setItem('admin_auth', 'admin123');
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

  if (!isAuthorized) {
    return (
      <LoginContainer>
        <LoginCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '50%' }}>
            <Lock size={48} color="#4a3728" />
          </div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#4a3728', marginBottom: '0.5rem' }}>
              Admin Access
            </h1>
            <p style={{ color: '#bcaaa4', fontWeight: 600 }}>
              Enter the clinic access key to view comments.
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Access Key"
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  paddingRight: '3.5rem',
                  borderRadius: '15px',
                  border: '2px solid #f0f0f0',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
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
              <p style={{ color: '#f44336', fontSize: '0.9rem', fontWeight: 600 }}>
                {loginError}
              </p>
            )}

            <LoginButton type="submit">
              <LogIn size={20} /> Access Comments
            </LoginButton>
          </form>
        </LoginCard>
      </LoginContainer>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    // Firestore timestamp
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <AdminContainer>
      <AdminSidebar activeIndex={3} />
      <MainContent>
        <Header>
          <div>
            <DashboardTitle>Patient Comments</DashboardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
              <ClinicName>Dr. A Dental Clinic</ClinicName>
              <span style={{ color: '#e0e0e0' }}>|</span>
              <span style={{ fontSize: '0.8rem', color: '#bcaaa4', fontWeight: 600 }}>
                Clinic Access Mode
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f44336',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </Header>

        {loading ? (
          <EmptyState>
            <Loader2 className="animate-spin mx-auto mb-2" size={32} />
            Loading comments...
          </EmptyState>
        ) : comments.length === 0 ? (
          <EmptyState>No comments found yet.</EmptyState>
        ) : (
          <CommentsGrid>
            {comments.map((comment, index) => (
              <CommentCard
                key={comment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <CommentHeader>
                  <ProfilePic>
                    <UserCircle2 size={32} />
                  </ProfilePic>
                  <div>
                    <CommenterName>Anonymous Patient</CommenterName>
                    <CommentDate>{formatDate(comment.timestamp)}</CommentDate>
                  </div>
                </CommentHeader>
                <CommentText>{comment.comment}</CommentText>
              </CommentCard>
            ))}
          </CommentsGrid>
        )}
      </MainContent>
    </AdminContainer>
  );
};

export default AdminComments;
