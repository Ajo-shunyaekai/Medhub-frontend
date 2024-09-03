import React, { useState, useRef, useEffect } from 'react';
import UploadImage from '../assest/uplaod.svg';
import CrossIcon from '../assest/Icon.svg';
import PDFIcon from '../assest/pdf-icon.svg';
import styles from '../style/imageuploader.module.css';

const ImageUploader = ({ onUploadStatusChange, imageType, reset, allowMultiple }) => {
    const fileInputRef = useRef(null);
    const [filePreviews, setFilePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (reset) {
            setFilePreviews([]);
            setUploading(false);
            setErrorMessage('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [reset]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        let validFiles;

        if (imageType === 'logo') {
            // For logo, only allow JPEG and only one file
            validFiles = files.filter(file => file.type === 'image/jpeg').slice(0, 1);

            if (files.length > 1 || validFiles.length === 0) {
                setErrorMessage('Only one JPEG image is allowed for the logo.');
                return;
            }
        } else {
            // For other types, allow multiple files with valid types and sizes
            validFiles = files.filter(file => {
                const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'].includes(file.type);
                const isValidSize = file.size <= 5 * 1024 * 1024;
                return isValidType && isValidSize;
            });

            if (validFiles.length !== files.length) {
                setErrorMessage('Some files were invalid. Only PNG, JPEG, JPG, and PDF are allowed, and file size must not exceed 5MB.');
                return;
            }
        }

        setErrorMessage('');

        // Process valid files
        const newPreviews = validFiles.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve({ name: file.name, preview: reader.result, type: file.type, file });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        setUploading(true);
        Promise.all(newPreviews)
            .then(results => {
                setFilePreviews(prev => {
                    const updatedPreviews = imageType === 'logo' ? results.slice(0, 1) : [...prev, ...results];
                    onUploadStatusChange(true, updatedPreviews.map(file => file.file), imageType);
                    return updatedPreviews;
                });
            })
            .catch(err => {
                setErrorMessage('Error reading files.');
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const handleFileRemove = (fileName, event) => {
        event.stopPropagation();

        setFilePreviews(prev => {
            const updatedPreviews = prev.filter(file => file.name !== fileName);

            onUploadStatusChange(updatedPreviews.length > 0, updatedPreviews.map(file => file.file), imageType);

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
                        <p className={styles['upload-text']}>Click here to Upload Files</p>
                    </>
                )}
                <input
                    type="file"
                    accept={imageType === 'logo' ? 'image/jpeg' : 'image/png, image/jpeg, image/jpg, application/pdf'}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    multiple={imageType === 'logo' ? false : allowMultiple}
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
                            {file.type.startsWith('image') ? (
                                <img src={file.preview} alt={file.name} className={styles['uploaded-image']} />
                            ) : (
                                <img src={PDFIcon} alt="PDF" className={styles['pdf-icon']} />
                            )}
                            <div className={styles['file-info']}>
                                <span className={styles['image-file-name']}>{file.name}</span>
                            </div>
                            <img src={CrossIcon} alt="Remove" className={styles['remove-icon']} onClick={(event) => handleFileRemove(file.name, event)} />
                        </div>
                    </div>
                ))}
            </div>
            {modalOpen && modalContent && modalContent.type.startsWith('image') && (
                <div className={styles['modal']} onClick={closeModal}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <span className={styles['close']} onClick={closeModal}>&times;</span>
                        <img src={modalContent.preview} alt="Enlarged view" className={styles['modal-image']} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;






