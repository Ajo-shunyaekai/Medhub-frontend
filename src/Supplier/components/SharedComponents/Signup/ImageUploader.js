import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import Information from '../../../assets/images/infomation.svg';
import UploadImage from '../../../assets/images/uplaod.svg';
import CrossIcon from '../../../assets/images/Icon.svg';
import PDFIcon from '../../../assets/images/pdf-icon.svg';
import styles from './imageuploader.module.css';

const ImageUploader = ({
    onUploadStatusChange,
    imageType,
    reset,
    allowMultiple,
    filePreviews,
    setFilePreviews,
    showTooltip = false,
    tooltipMessage = "Upload your trade license documents (PDF/DOCX, max 5MB)"
}) => {
    const fileInputRef = useRef(null);
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
    }, [reset, setFilePreviews, setUploading, setErrorMessage, fileInputRef]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        let validFiles;

        if (imageType === 'logo') {
            validFiles = files.filter(file => file?.type === 'image/jpeg' || file?.type === 'image/png').slice(0, 1);
            if (files.length > 1 || validFiles.length === 0) {
                setErrorMessage('Only JPEG/PNG format is allowed');
                return;
            }
        } else {
            validFiles = files.filter(file => {
                const isValidType = ['application/pdf', ].includes(file?.type);
                const isValidSize = file.size <= 5 * 1024 * 1024;
                return isValidType && isValidSize;
            });
            if (validFiles.length !== files.length) {
                setErrorMessage('Invalid file. Only PDF allowed, max 5MB.');
                return;
            }
        }

        setErrorMessage('');

        const newPreviews = validFiles.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const newFileName = file?.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                        ? file?.name?.endsWith('.docx') ? file?.name : `${file?.name?.split('.')[0]}.docx`
                        : file?.name;

                    resolve({
                        name: newFileName,
                        preview: reader?.result,
                        type: file?.type,
                        file: new File([file], newFileName, { type: file?.type })
                    });
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
            .catch(() => {
                setErrorMessage('Error reading files.');
            })
            .finally(() => {
                setUploading(false);
            });
    };

    const handleFileRemove = (fileName, event) => {
        event.stopPropagation();
        setFilePreviews(prev => {
            const updatedPreviews = prev.filter(file => file?.name !== fileName);
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
                <div className={styles['upload-content-wrapper']}>
                    {uploading ? (
                        <p>Uploading...</p>
                    ) : (
                       <>
                            <img src={UploadImage} alt="Upload" className={styles['upload-icon']} />
                            <p className={styles['upload-text']}>Click here to Upload Files</p>
                            </>
                    )}
                    {showTooltip && (
                        <div className={styles['tooltip-container']}>
                            <span
                                className={styles.emailInfoIcon}
                                data-tooltip-id={`upload-tooltip-${imageType}`}
                                data-tooltip-content={tooltipMessage}
                                data-tooltip-place="top"
                            >
                                <img src={Information} className={styles.tooltipIcons} alt='information' />
                            </span>
                            <Tooltip id={`upload-tooltip-${imageType}`} />
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    accept={imageType === 'logo' ? 'image/png, image/jpeg' : 'application/pdf'}
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
                    <div key={file?.name} className={styles['file-container']}>
                        <div className={styles['file-wrapper']} onClick={() => openModal(file?.preview, file?.type)}>
                            {file?.type?.startsWith('image') ? (
                                <img src={file?.preview} alt={file?.name} className={styles['uploaded-image']} />
                            ) : (
                                <img src={PDFIcon} alt="PDF" className={styles['pdf-icon']} />
                            )}
                            <div className={styles['file-info']}>
                                <span className={styles['image-file-name']}>{file?.name}</span>
                            </div>
                            <img
                                src={CrossIcon}
                                alt="Remove"
                                className={styles['remove-icon']}
                                onClick={(event) => handleFileRemove(file?.name, event)}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {modalOpen && modalContent && modalContent?.type?.startsWith('image') && (
                <div className={styles['modal']} onClick={closeModal}>
                    <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                        <span className={styles['close']} onClick={closeModal}>×</span>
                        <img src={modalContent.preview} alt="Enlarged view" className={styles['modal-image']} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;