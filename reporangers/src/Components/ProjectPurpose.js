import React from 'react';

const ProjectPurpose = ({ darkMode = false, projectData }) => {
  const fileInfo = projectData?.status?.files?.[0];

  const containerStyle = {
    width: '525px',
    height: '365px',
    border: `2px solid ${darkMode ? '#fff' : 'black'}`,
    padding: '1rem',
    overflowY: 'scroll',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: darkMode ? '#1e1e1e' : 'white',
    color: darkMode ? '#f0f0f0' : 'black'
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginTop: 0 }}>PROJECT PURPOSE</h3>
      <p>{fileInfo?.summary || 'No summary available.'}</p>

      <h4>VERDICT</h4>
      <p>{fileInfo?.verdict || 'No verdict provided.'}</p>

      <h4>AREAS OF IMPROVEMENT</h4>
      <div>
      {fileInfo?.scope_of_improvement
        ? fileInfo.scope_of_improvement
            .split('- ')
            .filter(line => line.trim() !== '')
            .map((line, index) => (
              <p key={index}>{line.trim()}</p>
            ))
        : <p>No Scope of Improvement available for this file.</p>}
    </div>
    </div>
  );
};

export default ProjectPurpose;

