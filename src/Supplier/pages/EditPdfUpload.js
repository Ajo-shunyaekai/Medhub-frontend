import React, { useState, useRef, useEffect } from 'react';
import UploadIcon from '../assest/uplaod.svg';
import styles from '../style/pdfadd.module.css';
import CloseIcon from '@mui/icons-material/Close';


const EditPdfUpload = ({ invoiceImage, setInvoiceImage }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const maxFiles = 5;

    useEffect(() => {
        if (invoiceImage) {
            // Initialize with existing PDFs and keep newly uploaded files as File objects
            const existingFiles = invoiceImage.filter(file => typeof file === 'string');
            const newFiles = invoiceImage.filter(file => file instanceof File);
            setPdfFiles([...existingFiles, ...newFiles]);
        } else {
            setErrorMessage('Please Upload at Least One Invoice.');
        }
    }, [invoiceImage]);

    const handlePdfUpload = (event) => {
        const files = event.target.files;
        const newPdfFiles = [];
        let count = pdfFiles.length;

        for (let i = 0; i < files.length && count < maxFiles; i++) {
            const file = files[i];

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

                setErrorMessage(''); // Clear any previous error message
                newPdfFiles.push(file);
                count++;
            }
        }

        if (count + newPdfFiles.length > maxFiles) {
            setErrorMessage(`You can upload a maximum of ${maxFiles} files.`);
        } else {
            const updatedPdfFiles = [...pdfFiles, ...newPdfFiles];
            setPdfFiles(updatedPdfFiles);
            setInvoiceImage(updatedPdfFiles);
        }
    };

    const handlePdfRemove = (index) => {
        const updatedPdfFiles = [...pdfFiles];
        updatedPdfFiles.splice(index, 1);
        setPdfFiles(updatedPdfFiles);
        setInvoiceImage(updatedPdfFiles);

        if (updatedPdfFiles.length === 0) {
            setErrorMessage('Please upload at least one invoice.');
        }
    };

    const handlePdfClick = () => {
        fileInputRef.current.click();
    };

    const handlePdfClick2 = (pdf) => {
        if (pdf instanceof File) {
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedPdf(reader.result);
                setShowModal(true);
            };
            reader.readAsDataURL(pdf);
        } else {
            // Handle existing PDF file (e.g., as a link or a message)
            console.log('Existing PDF:', pdf);
        }
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
                        multiple
                    />
                </div>
                <div className={styles['pdf-image-previews']}>
                    {pdfFiles.length > 0 ? (
                        pdfFiles.map((pdf, index) => (
                            <div
                                className={styles['pdf-image-preview']}
                                key={index}
                                onClick={() => handlePdfClick2(pdf)}
                            >
                                <div className={styles['pdf-file-name']}>
                                    {pdf instanceof File ? pdf.name : pdf}
                                </div>
                                <CloseIcon
                                    className={styles['pdf-close-icon']}
                                    onClick={(e) => { e.stopPropagation(); handlePdfRemove(index); }}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No PDF files uploaded.</p>
                    )}
                </div>

                {/* PDF viewer in popup modal */}
                {showModal && (
                    <div className={styles.modal} onClick={() => setShowModal(false)}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalBody}>
                                <embed src={selectedPdf} type="application/pdf" width="100%" height="500px" />
                                <button onClick={() => setShowModal(false)} className={styles.modalCloseBtn}>
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className={styles['pdf-error-message']} style={{ color: 'red', fontSize: '12px' }}>
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
        </>
    );
};





export default EditPdfUpload;
