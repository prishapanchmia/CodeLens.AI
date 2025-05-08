import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidemenu from './Sidemenu';

const ChatGeneratePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const analysisData = location.state?.analysisData;
  const files = analysisData?.status?.files || [];

  const [selectedFileObj, setSelectedFileObj] = useState(null);
  const [question, setQuestion] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const handleToggle = () => setDarkMode(prev => !prev);
  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleGenerate = () => {
    if (question && selectedFileObj) {
      const cleanFileName = selectedFileObj.file?.split('/').pop() || 'Unknown';
  
      navigate('/chat-conversation', {
        state: {
          selectedFile: selectedFileObj.id,
          fileName: cleanFileName,
          question,
          analysisData
        }
      });
    }
  };
  

  const handleReportButtonClick = () => {
    navigate('/statistics', {
      state: {
        analysisData,
        githubRepo: location.state?.githubRepo || '',
        contractAddress: location.state?.contractAddress || '',
      }
    });
  };

  // Listen for file selection from Explorer
  useEffect(() => {
    const handleFileSelect = (e) => {
      setSelectedFileObj(e.detail);
    };

    window.addEventListener('fileSelected', handleFileSelect);
    return () => {
      window.removeEventListener('fileSelected', handleFileSelect);
    };
  }, []);

  const bgColor = darkMode ? '#121212' : '#f7f7f7';
  const textColor = darkMode ? '#ffffff' : '#000000';
  const inputBg = darkMode ? '#2c2c2c' : '#f1f1f1';
  const panelBg = darkMode ? '#1e1e1e' : '#ffffff';
  const borderColor = darkMode ? '#333' : '#ccc';

  if (!analysisData || !files.length) {
    return <div style={{ padding: '2rem', color: 'red' }}>No analysis data available. Please go back and upload a GitHub URL.</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: bgColor, color: textColor }}>
      {/* Sidebar */}
      <div style={{ width: '250px', borderRight: `2px solid ${borderColor}`, backgroundColor: panelBg }}>
        <Sidemenu darkMode={darkMode} analysisData={analysisData} showModal={false} />
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Controls */}
        <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}` }}>
          <h2 style={{ margin: 0 }}>Generate Chat</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={handleReportButtonClick}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: darkMode ? '#ffffff' : '#000000',
                color: darkMode ? '#000000' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Report
            </button>

            {/* Theme Toggle */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
              <div
                style={{
                  position: 'relative',
                  width: '45px',
                  height: '24px',
                  backgroundColor: darkMode ? '#444' : '#ccc',
                  borderRadius: '12px',
                  transition: '0.3s',
                  padding: '2px',
                }}
                onClick={handleToggle}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: darkMode ? '22px' : '2px',
                    width: '20px',
                    height: '20px',
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    transition: 'left 0.3s',
                  }}
                />
              </div>
              <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </label>
          </div>
        </div>

        {/* Main Panel */}
        <div style={{ flexGrow: 1, padding: '2rem', backgroundColor: panelBg }}>
          <div style={{ padding: '2rem', borderRadius: '10px', backgroundColor: panelBg, boxShadow: darkMode ? '0 0 10px #000' : '0 0 5px #ccc' }}>
            <h1 style={{ marginBottom: '1rem' }}>Chat Here</h1>
            <h2 style={{ marginBottom: '1.5rem' }}>
  {selectedFileObj 
    ? `Selected File: ${selectedFileObj.file?.split('/').pop() || 'Unknown'}` 
    : 'Please select a file from the sidebar to start'}
</h2>


            {/* Question Textarea */}
            <textarea
              value={question}
              onChange={handleQuestionChange}
              placeholder="Type your question here"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '1rem',
                borderRadius: '8px',
                backgroundColor: inputBg,
                color: textColor,
                border: `1px solid ${borderColor}`,
                fontSize: '1rem',
                resize: 'none',
                marginBottom: '1.5rem',
              }}
            />

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!selectedFileObj || !question}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 'bold',
                backgroundColor: (!selectedFileObj || !question) ? '#999' : (darkMode ? '#00d084' : '#000000'),
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: (!selectedFileObj || !question) ? 'not-allowed' : 'pointer',
              }}
            >
              Generate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGeneratePage;
