import React, { useState, useRef } from 'react';
import UploadImage from '../assest/uplaod.svg';
import styles from '../style/createpoimageupload.module.css';
import CloseIcon from '@mui/icons-material/Close';

const CreatePOImageUpload = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const isValidType = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
            const isValidSize = file.size <= 2 * 1024 * 1024;

            if (!isValidType) {
                setErrorMessage('Invalid file type. Only PNG, JPEG, and JPG are allowed.');
                return;
            }

            if (!isValidSize) {
                setErrorMessage('File size exceeds the limit of 2MB.');
                return;
            }

            setErrorMessage('');
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setSelectedImage(null);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className={styles['createpo-image-uploader']}>
            <div className={styles['createpo-upload-area']} onClick={handleImageClick}>
                {selectedImage ? (
                    <img
                        src={selectedImage}
                        alt="Uploaded"
                        className={styles['createpo-uploaded-image']}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowModal(true);
                        }}
                    />
                ) : (
                    <>
                        <img src={UploadImage} alt="Upload" className={styles['createpo-upload-icon']} />
                        <p className={styles['createpo-upload-text']}>Click here to upload</p>
                    </>
                )}
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                {selectedImage && (
                    <CloseIcon
                        className={styles['createpo-close-icon']}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleImageRemove();
                        }}
                    />
                )}
            </div>
            {showModal && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalBody}>
                            <img src={selectedImage} alt="Selected" className={styles.selectedImage} />
                            <button onClick={toggleModal} className={styles.modalCloseBtn}>
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {errorMessage && (
                <div className={styles['error-message']}>
                    <span>{errorMessage}</span>
                </div>
            )}
        </div>
    );
};

export default CreatePOImageUpload;
