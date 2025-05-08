import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProjectPurpose from './ProjectPurpose';
import Sidemenu from './Sidemenu';
import PieChart from './PieChart';
import ColumnChart from './ColumnChart';
import BarChart from './BarChart';

const Statistics = ({ data }) => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const { githubRepo, analysisData } = data;

  const handleToggle = () => setDarkMode(prev => !prev);

  const handleAIButtonClick = () => {
    navigate('/chat-generate', { state: { analysisData } });
  };

  const handleCheckNewRepo = () => {
    navigate('/');
  };

  const bgColor = darkMode ? '#121212' : '#f7f7f7';
  const textColor = darkMode ? '#ffffff' : '#000000';

  return (
    <div style={{ display: 'flex', overflowX: 'hidden', backgroundColor: bgColor, color: textColor, minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', borderRight: `2px solid ${darkMode ? '#333' : '#ccc'}`, backgroundColor: darkMode ? '#1e1e1e' : '#ffffff' }}>
        <Sidemenu darkMode={darkMode} analysisData={analysisData} />
      </div>

      {/* Main content */}
      <div style={{ flexGrow: 1, minWidth: 0, padding: '2rem', position: 'relative' }}>
        {/* Top Right Buttons */}
          <button style={{
            padding: '0.5rem 1.25rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: darkMode ? '#ffffff' : '#000000',
            color: darkMode ? '#000000' : '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }} onClick={handleCheckNewRepo}>
            Add New Repository
          </button>
        <div style={{ position: 'absolute', top: '2rem', right: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Check New Repo Button */}

          {/* AI Bot Button */}
          <button style={{
            padding: '0.5rem 1.25rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: darkMode ? '#ffffff' : '#000000',
            color: darkMode ? '#000000' : '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }} onClick={handleAIButtonClick}>
            AI Bot
          </button>

          {/* Toggle Switch */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <div style={{
              position: 'relative',
              width: '45px',
              height: '24px',
              backgroundColor: darkMode ? '#444' : '#ccc',
              borderRadius: '12px',
              transition: '0.3s',
              padding: '2px'
            }} onClick={handleToggle}>
              <div style={{
                position: 'absolute',
                top: '2px',
                left: darkMode ? '22px' : '2px',
                width: '20px',
                height: '20px',
                backgroundColor: '#fff',
                borderRadius: '50%',
                transition: 'left 0.3s'
              }} />
            </div>
            <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </label>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontWeight: 'bold', color: textColor }}>Statistics Page</h2>
          <p><strong>GitHub Repo:</strong> {githubRepo}</p>
        </div>

        {/* Charts and Project Details */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <ProjectPurpose darkMode={darkMode} projectData={analysisData} />
            <div style={{ marginTop: '2rem', maxWidth: '100%', overflowX: 'auto' }}>
              <ColumnChart analysisData={analysisData} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
              <PieChart analysisData={analysisData} />
            </div>
            <div style={{ marginTop: '2rem', maxWidth: '100%', overflowX: 'auto' }}>
              <BarChart analysisData={analysisData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
