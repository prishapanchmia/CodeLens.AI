import React, { useEffect, useState } from 'react';
import SummaryModal from './SummaryModal';

const Explorer = ({ darkMode, analysisData ,showModal = true}) => {
  const [modalFile, setModalFile] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (analysisData?.status?.files) {
      setFiles(analysisData.status.files);
    }
  }, [analysisData])

  const truncateFileName = (name, maxLength = 20) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };


  return (
    <>
      <div style={{ width: '250px', padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
        <h3>Explorer</h3>
        <ul style={{ listStyle: 'none', paddingLeft: '10px' }}>
          {files.map((file, index) => {
            const fileName = truncateFileName(file.file.split('/').pop());
            const key = file.id || file.file || index; // ensure fallback for key

            return (
              <li
              key={file.id}
              title={file.file}
              style={{ cursor: 'pointer', margin: '4px 0' }}
              onClick={() => {
                setModalFile(file);
                window.dispatchEvent(new CustomEvent("fileSelected", { detail: file }));
              }}
            > 📄 {fileName}
              </li>
            );
          })}
        </ul>
      </div>

      {showModal && (
        <SummaryModal
          file={modalFile}
          isOpen={!!modalFile}
          onClose={() => setModalFile(null)}
          darkMode={darkMode}
        />
      )}
    </>
  );
};

export default Explorer;
