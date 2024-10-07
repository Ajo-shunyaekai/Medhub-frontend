import React, { useState, useRef, useEffect } from 'react';
import UploadIcon from '../assest/uplaod.svg';
import styles from '../style/pdfadd.module.css';
import CloseIcon from '@mui/icons-material/Close';

const AddPdfUpload = ({ invoiceImage, setInvoiceImage }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfFile, setPdfFile] = useState(null); // Single PDF file
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

  useEffect(() => {
        if (!invoiceImage || invoiceImage.length === 0) {
            setErrorMessage('Please Upload at Least One Purchase Invoice.');
        } else {
            setErrorMessage('');
        }
    }, [invoiceImage]);

    const handlePdfUpload = (event) => {
        const file = event.target.files[0];

        if (pdfFile) {
            setErrorMessage('Only one PDF can be uploaded at a time.');
            return;
        }

        if (file) {
            const isValidType = file.type === 'application/pdf';
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

            if (!isValidType) {
                setErrorMessage('Invalid file type. Only PDF is allowed.');
                return;
            }

            if (!isValidSize) {
                setErrorMessage('File size exceeds the limit of 5MB.');
                return;
            }

            setErrorMessage('');
            setPdfFile(file);
            setInvoiceImage([file]);
        }
    };

    const handlePdfRemove = () => {
        setPdfFile(null);
        setInvoiceImage([]);
    };

    const handlePdfClick = () => {
        fileInputRef.current.click();
    };

    const handlePdfClick2 = (pdf) => {
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedPdf(reader.result);
            setShowModal(true);
        };
        reader.readAsDataURL(pdf);
    };

    return (
        <>
            <div className={styles['pdf-image-uploader']}>
                <div className={styles['pdf-upload-area']} onClick={handlePdfClick}>
                    <img src={UploadIcon} alt="Upload" className={styles['pdf-upload-icon']} />
                    <p className={styles['pdf-upload-text']}>Click here to Upload</p>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfUpload}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                </div>
                {pdfFile && (
                    <div className={styles['pdf-image-previews']}>
                        <div className={styles['pdf-image-preview']} onClick={() => handlePdfClick2(pdfFile)}>
                            <div className={styles['pdf-file-name']}>
                                <span>{pdfFile.name}</span>
                            </div>
                            <CloseIcon
                                className={styles['pdf-close-icon']}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePdfRemove();
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* PDF viewer in popup modal */}
                {/* {showModal && (
                    <div className={styles.modal} onClick={toggleModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalBody}>
                                <embed src={selectedPdf} type="application/pdf" width="100%" height="500px" />
                                <button onClick={toggleModal} className={styles.modalCloseBtn}>
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                )} */}

                {errorMessage && (
                    <div className={styles['pdf-error-message']} style={{ color: 'red', fontSize: '12px',paddingTop:"10px" }}>
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default AddPdfUpload;
