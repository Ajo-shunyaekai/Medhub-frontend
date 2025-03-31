import React from 'react';
import styles from './FileUploadModal.module.css';

import { FiUploadCloud } from 'react-icons/fi';

const FileUploadModal = ({ onClose, onSelectFile, onHandleUpload, modaltitle, title, selectedFile }) => {
  const handleInputChange = (e) => {
    onSelectFile(e.target.files[0]);
  };

  const handleUploadClick = () => {
    onHandleUpload();
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeadContainer}>
          <div className={styles.modalTitle}>{modaltitle}</div>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.fileInputWrapper}>
          <label className={styles.formLabel}>{title} File (PDF, CSV, Excel, DOC)</label>
          <div className={styles.modalInnerSection}>
            <FiUploadCloud size={20} className={styles.uploadIcon} />
            <input type="file" accept=".pdf,.csv,.xls,.xlsx,.doc,.docx" onChange={handleInputChange} className={styles.fileInput} />
            {!selectedFile && <p className={styles.placeholderText}>{title} file</p>}
            {selectedFile && (
                <p className={styles.fileModalName}>
                    {selectedFile.name}
                </p>
            )}
          </div>
        </div>
        <div className={styles.modalButtonContainer}>
          <button className={styles.buttonCancel} onClick={onClose}>Cancel</button>
          <button className={styles.buttonSubmit} onClick={handleUploadClick}>{title}</button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
