import React, { useState, useEffect } from 'react';
import Sidemenu from './Sidemenu';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ChatConversationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [analysisData, setAnalysisData] = useState(location.state?.analysisData);
  const [selectedFile, setSelectedFile] = useState(location.state?.selectedFile);
  const [fileName, setFileName] = useState(location.state?.fileName || 'File');
  const [initialQuestion, setInitialQuestion] = useState(location.state?.question || '');

  const [darkMode, setDarkMode] = useState(true);
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState('');

  const cleanFileName = fileName.split('/').pop() || 'Unknown';

  const bgColor = darkMode ? '#121212' : '#f7f7f7';
  const textColor = darkMode ? '#ffffff' : '#000000';

  useEffect(() => {
    const onFileSelect = (e) => {
      const file = e.detail;
      setSelectedFile(file.id);
      setFileName(file.file);
      setInitialQuestion('');
      setChatMessages([]);
    };
    window.addEventListener('fileSelected', onFileSelect);
    return () => window.removeEventListener('fileSelected', onFileSelect);
  }, []);

  useEffect(() => {
    const fetchInitialResponse = async () => {
      if (initialQuestion && selectedFile) {
        setChatMessages([
          { sender: 'user', message: initialQuestion },
          { sender: 'bot', message: 'Thinking...' }
        ]);

        try {
          const res = await axios.get(
            `http://127.0.0.1:8000/chat-file?doc_id=${selectedFile}&query=${encodeURIComponent(initialQuestion)}`
          );
          const botReply = res.data.response || 'No response from API.';
          setChatMessages([
            { sender: 'user', message: initialQuestion },
            { sender: 'bot', message: botReply }
          ]);
        } catch (error) {
          setChatMessages([
            { sender: 'user', message: initialQuestion },
            { sender: 'bot', message: 'Error contacting API.' }
          ]);
        }
      }
    };

    fetchInitialResponse();
  }, [initialQuestion, selectedFile]);

  const handleToggle = () => setDarkMode(prev => !prev);
  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleSend = async () => {
    if (!question || !selectedFile) return;

    const newMessages = [...chatMessages, { sender: 'user', message: question }];
    setChatMessages([...newMessages, { sender: 'bot', message: 'Loading...' }]);
    setQuestion('');

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/chat-file?doc_id=${selectedFile}&query=${encodeURIComponent(question)}`
      );
      const botReply = res.data.response || 'No response from API.';
      setChatMessages([...newMessages, { sender: 'bot', message: botReply }]);
    } catch (error) {
      setChatMessages([...newMessages, { sender: 'bot', message: 'Error contacting API.' }]);
    }
  };

  const inputBg = darkMode ? '#2c2c2c' : '#f1f1f1';
  const panelBg = darkMode ? '#1e1e1e' : '#ffffff';
  const borderColor = darkMode ? '#333' : '#ccc';

  const handleReportButtonClick = () => {
    console.log(
      "analysisData", analysisData,
    )

    navigate('/statistics', {
      state: {
        analysisData,
        githubRepo: location.state?.githubRepo || '',
        contractAddress: location.state?.contractAddress || '',
      }
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', backgroundColor: bgColor, color: textColor }}>
      {/* Sidebar */}
      <div style={{ width: '250px', borderRight: `2px solid ${borderColor}`, backgroundColor: panelBg }}>
        <Sidemenu darkMode={darkMode} analysisData={analysisData} showModal={false} />
      </div>

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${darkMode ? '#333' : '#ccc'}` }}>
          <h2 style={{ margin: 0 }}>Chat ({cleanFileName})</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={handleReportButtonClick} style={{ padding: '0.5rem 1.25rem', fontWeight: 'bold', backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Report
            </button>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <div onClick={handleToggle} style={{ position: 'relative', width: '45px', height: '24px', backgroundColor: darkMode ? '#444' : '#ccc', borderRadius: '12px', padding: '2px' }}>
                <div style={{ position: 'absolute', top: '2px', left: darkMode ? '22px' : '2px', width: '20px', height: '20px', backgroundColor: '#fff', borderRadius: '50%' }} />
              </div>
              <span style={{ marginLeft: '0.5rem' }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </label>
          </div>
        </div>

        {/* Chat Section */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem 2rem', backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9' }}>
          {chatMessages.map((msg, index) => (
            <div key={index} style={{ display: 'flex', flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem 2rem', borderRadius: '8px', backgroundColor: msg.sender === 'user' ? (darkMode ? '#00d084' : '#58d68d') : (darkMode ? '#3399ff' : '#a2d9ff'), color: '#fff', maxWidth: '70%', margin: '0.5rem', wordWrap: 'break-word' }}>
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '1rem 2rem', borderTop: `1px solid ${darkMode ? '#333' : '#ccc'}`, backgroundColor: darkMode ? '#1e1e1e' : '#ffffff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            value={question}
            onChange={handleQuestionChange}
            placeholder="Type your question here"
            style={{ flexGrow: 1, padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: darkMode ? '#444' : '#f1f1f1', color: darkMode ? '#fff' : '#000', border: '1px solid #ccc' }}
          />
          <button onClick={handleSend} style={{ padding: '0.75rem 1.5rem', fontWeight: 'bold', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatConversationPage;
