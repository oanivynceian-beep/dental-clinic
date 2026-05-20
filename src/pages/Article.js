import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #fdfaf7;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.main`
  flex: 1;
  padding: 8rem 5% 6rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #6d4c41;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #4a3728;
  }
`;

const ArticleImage = styled(motion.img)`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 24px;
  margin-bottom: 3rem;
  box-shadow: 0 20px 40px rgba(74, 55, 40, 0.1);
`;

const ArticleTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #4a3728;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -1px;
`;

const ArticleContent = styled(motion.div)`
  color: #5d4037;
  font-size: 1.15rem;
  line-height: 1.8;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const NotFoundText = styled.h2`
  text-align: center;
  color: #4a3728;
  margin-top: 5rem;
`;

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, 'articles', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setArticle({ id: docSnap.id, ...docSnap.data() });
        } else {
          setArticle(null);
        }
      } catch (err) {
        console.error("Error fetching article:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <Header />
        <ContentWrapper style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader2 size={40} color="#4a3728" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </ContentWrapper>
        <Footer />
      </PageContainer>
    );
  }

  if (!article) {
    return (
      <PageContainer>
        <Header />
        <ContentWrapper>
          <BackButton onClick={() => navigate('/home')}>
            <ArrowLeft size={20} /> Back to Home
          </BackButton>
          <NotFoundText>Article not found.</NotFoundText>
        </ContentWrapper>
        <Footer />
      </PageContainer>
    );
  }

  // Split content by newline to create paragraphs
  const paragraphs = article.content ? article.content.trim().split('\n\n') : [];

  return (
    <PageContainer>
      <Header />
      <ContentWrapper>
        <BackButton onClick={() => navigate('/home')}>
          <ArrowLeft size={20} /> Back to Home
        </BackButton>

        <ArticleImage 
          src={article.image} 
          alt={article.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        />

        <ArticleTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {article.title}
        </ArticleTitle>

        <ArticleContent
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </ArticleContent>
      </ContentWrapper>
      <Footer />
    </PageContainer>
  );
};

export default Article;
