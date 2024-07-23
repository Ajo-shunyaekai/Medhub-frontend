import React, { useState, useRef, useEffect } from 'react';
import UploadIcon from '../assest/uplaod.svg';
import styles from '../style/pdfadd.module.css';
import CloseIcon from '@mui/icons-material/Close';

const AddPdfUpload = ({invoiceImage, setInvoiceImage}) => {
    // PDF popup modal
    const [showModal, setShowModal] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
  
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const [pdfFiles, setPdfFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const maxFiles = 5;

    useEffect(() => {
        if (!invoiceImage || invoiceImage.length === 0) {
            setErrorMessage('Please upload at least one purchase invoice.');
        } else {
            setErrorMessage('');
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
        setInvoiceImage([...pdfFiles, ...newPdfFiles]); 

        if (count <= maxFiles) {
            setPdfFiles([...pdfFiles, ...newPdfFiles]);
        } else {
            setErrorMessage(`You can upload a maximum of ${maxFiles} files.`);
        }
    };

    const handlePdfRemove = (index) => {
        const updatedPdfFiles = [...pdfFiles];
        updatedPdfFiles.splice(index, 1);
        setPdfFiles(updatedPdfFiles);
        setInvoiceImage(updatedPdfFiles)
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
                <p className={styles['pdf-upload-text']}>Click here to upload</p>
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
                {pdfFiles.map((pdf, index) => (
                    <div className={styles['pdf-image-preview']} key={index} onClick={() => handlePdfClick2(pdf)}>
                        <div className={styles['pdf-file-name']}>{pdf.name}</div>
                        <CloseIcon className={styles['pdf-close-icon']} onClick={(e) => { e.stopPropagation(); handlePdfRemove(index); }} />
                    </div>
                ))}
            </div>

            {/* PDF viewer in popup modal */}
            {showModal && (
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
            )}

            {errorMessage && (
                <div className={styles['pdf-error-message']} style={{color: 'red'}}>
                    <span>{errorMessage}</span>
                </div>
            )}
        </div>
       </>
    );
};

export default AddPdfUpload;
