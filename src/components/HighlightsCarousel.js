import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { db } from '../pages/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const CarouselContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  position: relative;
  margin-bottom: 4rem;
  padding: 2rem 0;
  
  /* Fade edges */
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100px;
    z-index: 2;
    pointer-events: none;
  }
  
  &::before {
    left: 0;
    background: linear-gradient(to right, #fdfaf7, transparent);
  }
  
  &::after {
    right: 0;
    background: linear-gradient(to left, #fdfaf7, transparent);
  }
`;

const scrollAnimation = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(calc(-350px * 5 - 2rem * 5)); } /* adjust width * num items */
`;

const CarouselTrack = styled.div`
  display: flex;
  gap: 2rem;
  width: max-content;
  animation: ${scrollAnimation} 40s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const HighlightCard = styled(motion.div)`
  width: 350px;
  height: 420px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(74, 55, 40, 0.08);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  border: 1px solid rgba(74, 55, 40, 0.05);
  position: relative;
  group: card;
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  transition: transform 0.5s ease;
  
  ${HighlightCard}:hover & {
    transform: scale(1.05);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: white;
  z-index: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 800;
  color: #4a3728;
  margin-bottom: 0.75rem;
  line-height: 1.3;
`;

const CardDesc = styled.p`
  font-size: 0.95rem;
  color: #6d4c41;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMore = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a1887f;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.2s;

  ${HighlightCard}:hover & {
    color: #4a3728;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const SkeletonCard = styled.div`
  width: 350px;
  height: 420px;
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(74, 55, 40, 0.08);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(74, 55, 40, 0.05);
  flex-shrink: 0;
`;

const SkeletonImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #f0e0d8 25%, #e8d4c8 50%, #f0e0d8 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
`;

const SkeletonContentPlaceholder = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SkeletonTitle = styled.div`
  height: 1.25rem;
  background: linear-gradient(90deg, #f0e0d8 25%, #e8d4c8 50%, #f0e0d8 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
`;

const SkeletonText = styled.div`
  height: 0.95rem;
  background: linear-gradient(90deg, #f0e0d8 25%, #e8d4c8 50%, #f0e0d8 75%);
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 4px;
  
  &:last-child {
    width: 80%;
  }
`;

const HighlightsCarousel = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const qArticles = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubArticles = onSnapshot(qArticles, snap => {
      setArticles(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    });

    return () => unsubArticles();
  }, []);

  if (isLoading) {
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ color: '#4a3728', fontWeight: 900, fontSize: '2.2rem', marginBottom: '1rem' }}>
          What's New
        </h2>
        <p style={{ color: '#6d4c41', marginBottom: '1rem', textAlign: 'center', maxWidth: '600px' }}>
          Discover our latest updates, advanced treatments, and clinic highlights.
        </p>
        <div style={{ width: '100%', padding: '2rem 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: '2rem', padding: '2rem 5%' }}>
            {[1, 2, 3].map((index) => (
              <SkeletonCard key={index}>
                <SkeletonImagePlaceholder />
                <SkeletonContentPlaceholder>
                  <SkeletonTitle />
                  <SkeletonText />
                  <SkeletonText />
                  <SkeletonText />
                </SkeletonContentPlaceholder>
              </SkeletonCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null; // Don't show carousel if there are no articles
  }

  // Duplicate items for infinite scroll effect (if less than 5 items, duplicate more to fill the screen)
  let repeatedData = [...articles, ...articles];
  if (articles.length < 3) {
    repeatedData = [...repeatedData, ...repeatedData, ...repeatedData];
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ color: '#4a3728', fontWeight: 900, fontSize: '2.2rem', marginBottom: '1rem' }}>
        What's New
      </h2>
      <p style={{ color: '#6d4c41', marginBottom: '1rem', textAlign: 'center', maxWidth: '600px' }}>
        Discover our latest updates, advanced treatments, and clinic highlights.
      </p>
      
      <CarouselContainer>
        <CarouselTrack>
          {repeatedData.map((item, index) => (
            <HighlightCard 
              key={`${item.id}-${index}`}
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/article/${item.id}`)}
            >
              <CardImage $src={
            item.image && typeof item.image.toUint8Array === 'function'
              ? URL.createObjectURL(new Blob([item.image.toUint8Array()]))
              : item.image
          } />
              <CardContent>
                <CardTitle>{item.title}</CardTitle>
                <CardDesc>{item.description}</CardDesc>
                <ReadMore>
                  Read Article <ArrowRight size={16} />
                </ReadMore>
              </CardContent>
            </HighlightCard>
          ))}
        </CarouselTrack>
      </CarouselContainer>
    </div>
  );
};

export default HighlightsCarousel;
