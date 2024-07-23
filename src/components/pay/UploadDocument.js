import React, { useState, useRef } from 'react';
import CustomModal from '../../components/pay/CustomModal';
import UploadImage from '../../assest/uplaod.svg';
import CrossIcon from '../../assest/Icon.svg';
import styles from '../../style/imageuploader.module.css';

const ImageUploader = ({onUploadStatusChange}) => {
    const [imagePreview, setImagePreview] = useState('');
    const [imageName, setImageName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
                setUploading(false);
                setIsLoading(false);
            };
            setUploading(true);
            setIsLoading(true);
            setImageName(file.name);
            onUploadStatusChange(true, file);
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = (event) => {
        event.stopPropagation();
        setImagePreview('');
        setImageName('');
        fileInputRef.current.value = '';
        onUploadStatusChange(true, null);
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const openModal = (event) => {
        event.stopPropagation();
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    return (
        <div className={styles['image-uploader']}>
            <div className={styles['upload-area']} onClick={handleImageClick}>
                {uploading ? (
                    <p>Uploading...</p>
                ) : (
                    <>
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Uploaded" className={styles['uploaded-image']} onClick={openModal} />
                                <img src={CrossIcon} alt="Remove" className={styles['remove-icon']} onClick={handleImageRemove} />
                            </>
                        ) : (
                            <>
                                <img src={UploadImage} alt="Upload" className={styles['upload-icon']} />
                                <p className={styles['upload-text']}>Click here to upload image</p>
                            </>
                        )}
                    </>
                )}
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
            </div>
            {
                imageName && !uploading && (
                    <div className={styles['image-name']}>
                        <span>{imageName}</span>
                    </div>
                )
            }
            <CustomModal isOpen={modalOpen} onClose={closeModal}>
                <img src={imagePreview} alt="Uploaded" className={styles['modal-image']} />
            </CustomModal>
        </div >
    );
};

export default ImageUploader;
