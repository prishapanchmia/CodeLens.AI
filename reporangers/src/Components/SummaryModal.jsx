import React from 'react';
import GaugeChart from './GaugeChart';

const SummaryModal = ({ file, isOpen, onClose, darkMode }) => {
  if (!isOpen || !file) return null;

  const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    overflow: 'auto',
    padding: '1rem',
  };

  const modalContentStyle = {
    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
    color: darkMode ? '#f0f0f0' : '#111111',
    borderRadius: '8px',
    padding: '1.5rem',
    maxWidth: '900px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: darkMode
      ? '0 2px 10px rgba(255,255,255,0.1)'
      : '0 2px 10px rgba(0,0,0,0.2)',
  };



  const buttonStyle = {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',

    backgroundColor: darkMode ? '#444' : '#ddd',
    color: darkMode ? '#fff' : '#000',
  };


  const style3 = {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: darkMode ? '#333c4d' : '#cbcbcb'
  }



  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <div style={style3}>
          <h3>
            {file.file.split('/').pop()}
          </h3>
        </div>
        <div style={style3}>
          <h4><u>Summary:</u></h4>
          <p>{file.summary || 'No summary available for this file.'}</p>
        </div>
        <div style={style3}>
          <h4>
            <u>
              Scope of Improvement:
            </u>
          </h4>
          {file.scope_of_improvement
            ? file.scope_of_improvement
              .split('- ')
              .filter(line => line.trim() !== '')
              .map((line, index) => (
                <p key={index}>{line.trim()}</p>
              ))
            : <p>No Scope of Improvement available for this file.</p>}
        </div>
        <div style={style3}>
          <h4>
            <u>
              Verdict:
            </u>
          </h4>
          <p>{file.verdict || 'No Verdict available for this file.'}</p>
        </div>

        <div>
          <GaugeChart metric={file.metric} />
        </div>
        <button style={buttonStyle} onClick={onClose}>
          Close
        </button>
      </div>
    </div>


  );
};

export default SummaryModal;
