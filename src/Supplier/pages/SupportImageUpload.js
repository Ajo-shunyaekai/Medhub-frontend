import React, { useState, useRef } from 'react';
import Resizer from 'react-image-file-resizer';
import UploadImage from '../assest/uplaod.svg';
import CrossIcon from '../assest/Icon.svg';
import styles from '../style/supportimageupload.module.css';
import CloseIcon from '@mui/icons-material/Close';


const ImageUploaders = ({ images, setImages, ErrorMessage, clearImageError }) => {
    

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);
    const maxImages = 5;
    const maxSingleFileSize = 1 * 1024 * 1024; // 1 MB

    const handleImageUpload = (event) => {
        clearImageError();
        const files = Array.from(event.target.files);
        let newImages = [...images];

        if (newImages.length + files.length > maxImages) {
            setErrorMessage(`You can upload up to ${maxImages} images in total.`);
            return;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file) {
                const isValidType = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);

                if (!isValidType) {
                    setErrorMessage('Invalid file type. Only PNG, JPEG, and JPG are allowed.');
                    return;
                }

                if (file.size > maxSingleFileSize) {
                    setErrorMessage('File size exceeds the limit of 1MB.');
                    return;
                }

                newImages.push(file);
            }
        }

        setErrorMessage('');
        setImages(newImages);
    };

    const handleImageRemove = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageClick2 = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    return (
        <div className={styles['image-uploader']}>
            <div className={styles['upload-area']} onClick={handleImageClick}>
                <img src={UploadImage} alt="Upload" className={styles['upload-icon']} />
                <p className={styles['upload-text']}>Click here to Upload</p>
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    multiple
                />
            </div>
            {errorMessage && (
                <div className={styles['error-message']}>
                    <span>{errorMessage}</span>
                </div>
            )}
            <div className={styles['image-previews']}>
                {images.map((image, index) => (
                    <div className={styles['image-preview']} key={index} onClick={() => handleImageClick2(image)}>
                        <img src={URL.createObjectURL(image)} alt="Uploaded" className={styles['uploaded-image']} />
                        <CloseIcon className={styles['close-icon']} onClick={(e) => { e.stopPropagation(); handleImageRemove(index); }} />
                    </div>
                ))}
            </div>

            {showModal && (
                <div className={styles.modal} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalBody}>
                            <img src={URL.createObjectURL(selectedImage)} alt="Selected" className={styles.selectedImage} />
                            <button onClick={() => setShowModal(false)} className={styles.modalCloseBtn}>
                                <CloseIcon className={styles['modal-close-icons']} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};



export default ImageUploaders;





