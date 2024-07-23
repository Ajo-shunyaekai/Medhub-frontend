
import React, { useState, useRef, useEffect } from 'react';
import UploadImage from '../assest/uplaod.svg';
import CloseIcon from '@mui/icons-material/Close';
import styles from '../style/imageadd.module.css';

const ImageUploaders = ({ image, setImage}) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState(image || []); 
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadAreaHeight, setUploadAreaHeight] = useState('100px');
    const fileInputRef = useRef(null);
    const minImages = 4;
    const maxImages = 5;

    useEffect(() => {
        if (!image || image.length < 4) {
            setErrorMessage('Please upload at least four image.');
        } else {
            setErrorMessage('');
        }
    }, [image]);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        const newImages = [];
        let count = images.length;

        for (let i = 0; i < files.length && count < maxImages; i++) {
            const file = files[i];

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

                newImages.push(file);
                count++;

                if (count >= minImages && count <= maxImages) {
                    setImages([...images, ...newImages]);
                    setUploadAreaHeight('80px'); // Adjusting upload area height
                } else if (count > maxImages) {
                    setErrorMessage(`You can upload a maximum of ${maxImages} images.`);
                }
            }
        }

        setImage([...images, ...newImages]); 
    };

    const handleImageRemove = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
        setImage(updatedImages); // Update parent state with updated images

        if (updatedImages.length === 0) {
            setErrorMessage('Please upload at least one image.');
        } else {
            setErrorMessage('');
        }

        if (images.length <= 1) {
            setUploadAreaHeight('100px');
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageClick2 = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    return (
        <>
            <div className={styles['add-image-uploader']}>
                <div className={styles['add-upload-area']} onClick={handleImageClick} style={{ height: uploadAreaHeight }}>
                    <img src={UploadImage} alt="Upload" className={styles['add-upload-icon']} />
                    <p className={styles['add-upload-text']}>Click here to upload</p>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        multiple
                    />
                </div>

                <div className={styles['add-image-previews']}>
                    {images.map((image, index) => (
                        <div className={styles['add-image-preview']} key={index} onClick={() => handleImageClick2(image)}>
                            <img src={URL.createObjectURL(image)} alt="Uploaded" className={styles['add-uploaded-image']} />
                            <CloseIcon
                                className={styles['add-close-icon']}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleImageRemove(index);
                                }}
                            />
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className={styles.modal} onClick={toggleModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalBody}>
                                <img src={URL.createObjectURL(selectedImage)} alt="Selected" className={styles.selectedImage} />
                                <button onClick={toggleModal} className={styles.modalCloseBtn}>
                                    <CloseIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className={styles['error-message']} style={{color: 'red'}}>
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default ImageUploaders;
