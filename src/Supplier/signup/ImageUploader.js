import React, { useState, useRef, useEffect } from 'react';
import UploadImage from '../assest/uplaod.svg';
import CrossIcon from '../assest/Icon.svg';
import PDFIcon from '../assest/pdf-icon.svg';
import styles from '../style/imageuploader.module.css';

const ImageUploader = ({ onUploadStatusChange, imageType, reset, allowMultiple }) => {
    const fileInputRef = useRef(null);
    const [filePreviews, setFilePreviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (reset) {
            setFilePreviews([]);
            setUploading(false);
            setIsLoading(false);
            setErrorMessage('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [reset]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        const validFiles = files.filter(file => {
            const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024;
            return isValidType && isValidSize;
        });

        if (validFiles.length !== files.length) {
            setErrorMessage('Some files were invalid. Only PNG, JPEG, JPG, and PDF are allowed, and file size must not exceed 5MB.');
            return;
        }

        setErrorMessage('');

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreviews(prev => [...prev, { name: file.name, preview: reader.result, type: file.type }]);
                setUploading(false);
                setIsLoading(false);
                onUploadStatusChange(true, event.target.files, imageType);
            };
            setUploading(true);
            setIsLoading(true);
            reader.readAsDataURL(file);
        });
    };

    const handleFileRemove = (fileName, event) => {
                event.stopPropagation();
                setFilePreviews(prev => {
                    const updatedPreviews = prev.filter(file => file.name !== fileName);
                    if (updatedPreviews.length === 0) {
                        // setErrorMessage('No files uploaded. Please upload at least one image.');
                        onUploadStatusChange(false, null, imageType);
                    } else {
                        setErrorMessage('');
                    }
                    return updatedPreviews;
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            };
            
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const openModal = (preview, type) => {
        setModalContent({ preview, type });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalContent(null);
    };

    return (
        <div className={styles['image-uploader']}>
            <div className={styles['upload-area']} onClick={handleImageClick}>
                {uploading ? (
                    <p>Uploading...</p>
                ) : (
                    <>
                        <img src={UploadImage} alt="Upload" className={styles['upload-icon']} />
                        <p className={styles['upload-text']}>Click here to upload files</p>
                    </>
                )}
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, application/pdf"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    multiple={allowMultiple}
                />
            </div>
            {errorMessage && (
                <div className={styles['error-message']}>
                    <span>{errorMessage}</span>
                </div>
            )}
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
                                <span style={{ marginRight: '10px', fontSize: '12px', cursor: 'pointer' }}>{file.name}</span>
                            </div>
                            <img src={CrossIcon} alt="Remove" className={styles['remove-icon']} onClick={(event) => handleFileRemove(file.name, event)} />
                        </div>
                    </div>
                ))}
            </div>
            {modalOpen && modalContent && (
                <div className={styles['modal']} onClick={closeModal}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <span className={styles['close']} onClick={closeModal}>&times;</span>
                        {modalContent.type.startsWith('image') ? (
                            <img src={modalContent.preview} alt="Enlarged view" className={styles['modal-image']} />
                        ) : (
                            <iframe src={modalContent.preview} className={styles['modal-pdf']} title="PDF Preview" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;






