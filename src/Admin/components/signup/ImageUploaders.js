import React, { useState, useRef } from 'react';
import UploadImage from '../../assest/uplaod.svg';
import CrossIcon from '../../assest/Icon.svg';
import styles from '../../style/signupimage.module.css';
import PDFIcon from '../../assest/pdf-icon.svg';

const ImageUploaders = ({ onUploadStatusChange }) => {
    const [filePreviews, setFilePreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null); 
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = [];
        const errorMessages = [];

        files.forEach((file) => {
            const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024;

            if (!isValidType) {
                errorMessages.push(`${file.name}: Invalid file type. Only PNG, JPEG, JPG, and PDF are allowed.`);
            }

            if (!isValidSize) {
                errorMessages.push(`${file.name}: File size exceeds the limit of 5MB.`);
            }

            if (isValidType && isValidSize) {
                validFiles.push(file);
            }
        });

        if (errorMessages.length > 0) {
            setErrorMessage(errorMessages.join(' '));
        } else {
            setErrorMessage('');
        }

        if (validFiles.length > 0) {
            setUploading(true);
            setIsLoading(true);

            validFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = () => {
                    setFilePreviews((prevPreviews) => [
                        ...prevPreviews,
                        { name: file.name, type: file.type, preview: reader.result },
                    ]);
                    setUploading(false);
                    setIsLoading(false);
                    onUploadStatusChange(true, file);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const handleFileRemove = (fileName, event) => {
        // Prevent the click event from propagating to the parent div
        event.stopPropagation();

        setFilePreviews((prevPreviews) => prevPreviews.filter(file => file.name !== fileName));
        onUploadStatusChange(false, null);
    };

    const handleFileClick = () => {
        fileInputRef.current.click();
    };

    const openModal = (filePreview, fileType) => {
        setModalOpen(true);
        if (fileType === 'application/pdf') {
            setModalContent({ type: fileType, preview: filePreview });
        } else {
            setModalContent({ type: 'image', preview: filePreview });
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null); // Clear the modal content
    };

    return (
        <div className={styles['image-uploader']}>
            <div className={styles['upload-area']} onClick={handleFileClick}>
                <img src={UploadImage} alt="Upload" className={styles['upload-icon']} />
                <p className={styles['upload-text']}>Click here to upload files</p>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, application/pdf" // Accept both image and PDF files
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    multiple // Allow multiple files
                />
            </div>
            
            <div className={styles['file-previews']}>
                {filePreviews.map((file) => (
                    <div key={file.name} className={styles['file-container']}>
                        <div className={styles['file-wrapper']} onClick={() => openModal(file.preview, file.type)}>
                            {file.preview.startsWith('data:image') ? (
                                <img src={file.preview} alt={file.name} className={styles['uploaded-image']} />
                            ) : (
                                <img src={PDFIcon} alt="PDF" className={styles['pdf-icon']} />
                            )}
                            <div className={styles['file-info']}>
                                <span style={{marginRight:'10px', fontSize:'12px', cursor:'pointer'}}>{file.name}</span>
                            </div>
                            <img src={CrossIcon} alt="Remove" className={styles['remove-icon']} onClick={(event) => handleFileRemove(file.name, event)} />
                        </div>
                    </div>
                ))}
            </div>

            {errorMessage && (
                <div className={styles['error-message']}>
                    <span>{errorMessage}</span>
                </div>
            )}
            {modalOpen && (
                <div className={styles['modal']} onClick={closeModal}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <span className={styles['close']} onClick={closeModal}>&times;</span>
                        {modalContent && modalContent.type === 'image' ? (
                            <img src={modalContent.preview} alt="Enlarged view" className={styles['modal-image']} />
                        ) : modalContent && modalContent.type === 'application/pdf' ? (
                            <embed src={modalContent.preview} type="application/pdf" className={styles['modal-pdf']} />
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploaders;
