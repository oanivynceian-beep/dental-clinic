import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from "framer-motion";
import { Loader2, Lock, LogIn, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { db } from './firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

import AdminSidebar from '../components/Sidebar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const CustomSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelectedValue = styled.div`
  padding: 1.2rem 1.75rem;
  border-radius: 20px;
  border: 2px solid #f0ebe6;
  background: white;
  font-size: 1.1rem;
  font-weight: 800;
  color: #4a3728;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(74, 55, 40, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;

  &:hover {
    border-color: #4a3728;
    box-shadow: 0 15px 30px rgba(74, 55, 40, 0.08);
    transform: translateY(-2px);
  }
`;

const CustomOptionsList = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 10;
  margin-top: 0.5rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(74, 55, 40, 0.15);
  border: 2px solid #f0ebe6;
  overflow: hidden;
`;

const CustomOption = styled.div`
  padding: 1.25rem 1.75rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: ${props => props.$selected ? '#fff' : '#4a3728'};
  background: ${props => props.$selected ? '#4a3728' : 'white'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$selected ? '#4a3728' : '#fcfaf9'};
    padding-left: 2.25rem;
  }
`;

const CustomDropdown = ({ value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <CustomSelectContainer ref={dropdownRef}>
      <CustomSelectedValue onClick={() => setIsOpen(!isOpen)}>
        {selectedOption ? selectedOption.label : value}
        <ChevronDown
          size={20}
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </CustomSelectedValue>
      {isOpen && (
        <CustomOptionsList
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {options.map((opt) => (
            <CustomOption
              key={opt.value}
              $selected={value === opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              {opt.label}
            </CustomOption>
          ))}
        </CustomOptionsList>
      )}
    </CustomSelectContainer>
  );
};


const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 10px;
  }
`;

const InnerChart = styled.div`
  min-width: ${props => props.$needScroll ? '600px' : '100%'};
  height: 100%;
  padding-bottom: 10px;
`;

const ChartContainer = styled(motion.div)`
  background: white;
  border-radius: 30px;
  padding: 2rem;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
  height: 500px;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.25rem;
    height: 450px;
  }
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

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const AdminStats = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [chartType, setChartType] = useState('bar');

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
      collection(db, 'bookings'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBookings(bookingsData);
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
              Enter the clinic access key to view statistics.
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
              <LogIn size={20} /> Access Statistics
            </LoginButton>
          </form>
        </LoginCard>
      </LoginContainer>
    );
  }

  // Calculate statistics
  const getChartData = () => {
    const defaultData = Array(12).fill(0);

    bookings.forEach(booking => {
      if (!booking.date) return;
      const parts = booking.date.split('-');
      if (parts.length !== 3) return;
      const bookingYear = parts[0];
      const bookingMonth = parseInt(parts[1], 10) - 1; // 0-indexed

      if (bookingYear === selectedYear) {
        if (selectedBranch === 'all') {
          defaultData[bookingMonth]++;
        } else if (booking.branch?.toLowerCase() === selectedBranch) {
          defaultData[bookingMonth]++;
        }
      }
    });

    const palette = [
      '#4a3728', '#6b4226', '#8d6e63', '#a1887f', '#bcaaa4', '#d7ccc8',
      '#e2b3a8', '#c98a7a', '#a65e4e', '#7a4231', '#5d3322', '#3e2316'
    ];

    return {
      labels: MONTHS,
      datasets: [
        {
          label: selectedBranch === 'all' ? 'Total Bookings (All Branches)' : `Total Bookings (${selectedBranch.toUpperCase()})`,
          data: defaultData,
          backgroundColor: chartType === 'doughnut' ? palette : 'rgba(74, 55, 40, 0.7)',
          borderColor: chartType === 'doughnut' ? '#ffffff' : 'rgba(74, 55, 40, 1)',
          borderWidth: chartType === 'doughnut' ? 3 : 2,
          borderRadius: 8,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#4a3728',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 8,
          fill: true,
          tension: 0.4
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Inter',
            weight: 'bold',
            size: 13
          },
          color: '#4a3728',
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      title: {
        display: true,
        text: 'Monthly Bookings Overview',
        font: {
          size: 24,
          family: 'Inter',
          weight: '900'
        },
        color: '#4a3728',
        padding: { top: 10, bottom: 30 }
      },
      tooltip: {
        backgroundColor: 'rgba(74, 55, 40, 0.9)',
        titleFont: { family: 'Inter', size: 14, weight: 'bold' },
        bodyFont: { family: 'Inter', size: 14 },
        padding: 15,
        cornerRadius: 10,
        displayColors: false
      }
    },
    ...(chartType !== 'doughnut' && {
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, font: { family: 'Inter', weight: '600' } },
          grid: { color: '#f0ebe6', drawBorder: false }
        },
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { font: { family: 'Inter', weight: '600' }, color: '#bcaaa4' }
        }
      }
    }),
    animation: {
      y: {
        duration: 2000,
        delay: 500
      }
    }
  };

  // Generate an array of years from the current year down to maybe 5 years ago
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(new Array(5), (val, index) => (currentYear - index).toString());

  return (
    <AdminContainer>
      <AdminSidebar activeIndex={4} />
      <MainContent>
        <Header>
          <div>
            <DashboardTitle>Statistics</DashboardTitle>
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
            Loading statistics...
          </EmptyState>
        ) : (
          <>
            <FilterGrid>
              <CustomDropdown
                value={selectedBranch}
                options={[
                  { value: 'all', label: 'All Branches' },
                  { value: 'matina', label: 'Matina Branch' },
                  { value: 'sasa', label: 'Sasa Branch' }
                ]}
                onChange={setSelectedBranch}
              />
              <CustomDropdown
                value={selectedYear}
                options={availableYears.map(year => ({ value: year, label: `Year ${year}` }))}
                onChange={setSelectedYear}
              />
              <CustomDropdown
                value={chartType}
                options={[
                  { value: 'bar', label: 'Bar Graph' },
                  { value: 'line', label: 'Line Graph' },
                  { value: 'doughnut', label: 'Doughnut Chart' }
                ]}
                onChange={setChartType}
              />
            </FilterGrid>
            <ChartContainer
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ChartWrapper>
                <InnerChart $needScroll={chartType !== 'doughnut'}>
                  {chartType === 'bar' && <Bar options={chartOptions} data={getChartData()} />}
                  {chartType === 'line' && <Line options={chartOptions} data={getChartData()} />}
                  {chartType === 'doughnut' && <Doughnut options={chartOptions} data={getChartData()} />}
                </InnerChart>
              </ChartWrapper>
            </ChartContainer>
          </>
        )}
      </MainContent>
    </AdminContainer>
  );
};

export default AdminStats;
