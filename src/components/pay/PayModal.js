import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UploadDocument from '../../components/pay/UploadDocument';
import '../../style/custommodal.css'

const injectStyles = () => {
    const style = document.createElement('style');
    style.innerHTML = `
        .custom-modal-style {
           display:flex  !important;
            padding: 0px !important;
        }
    `;
    document.head.appendChild(style);
};

function PayModal({ showModal, handleClose }) {
    const [selectedDate, setSelectedDate] = useState(new Date()); 
    const [chequeImage, setChequeImage] = useState(null);

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const handleFileChange = event => {
        const file = event.target.files[0];
        setChequeImage(file);
    };

    const [modeOfPayment, setModeOfPayment]     = useState('');
    const [amount, setAmount]                   = useState('');
    const [transactionId, setTransactionId]     = useState('');
    const [date, setDate]                       = useState('');
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [uploadedImage, setUploadedImage]     = useState(null);
    const [errors, setErrors]                   = useState({});

    useEffect(() => {
        if (!showModal) {
            setModeOfPayment('');
            setAmount('');
            setTransactionId('');
            setDate('');
            setIsImageUploaded(false);
            setUploadedImage(null);
            setErrors({});
        }
    }, [showModal]);

    const validateDate = (value) => {
        console.log('value',value);
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{2})$/;
        return datePattern.test(value);
    };

    const validateField = (fieldName, value) => {
        switch (fieldName) {
            case 'modeOfPayment':
                if (!value) {
                    return 'Mode of Payment is Required';
                }
                break;
            case 'amount':
                if (!value) {
                    return 'Amount is Required';
                }
                break;
            case 'transactionId':
                if (!value) {
                    return 'Transaction ID is Required';
                }
                break;
            case 'date':
                if (!value) {
                    return 'Date is Required';
                }
                break;
            // case 'date':
            // if (!value) {
            //     return 'Date is required';
            // } else if (!validateDate(value)) {
            //     return 'Date must be in DD/MM/YY format';
            // }
            // break;
                case 'image':
            if (!isImageUploaded) {
                return 'Image is required';
            }
            break;
            default:
                break;
        }
        return '';
    };


    const validateForm = () => {
        const errors = {};

        errors.modeOfPayment = validateField('modeOfPayment', modeOfPayment);
        errors.amount        = validateField('amount', amount);
        errors.transactionId = validateField('transactionId', transactionId);
        errors.date          = validateField('date', date);
        errors.image         = validateField('image', isImageUploaded);

        setErrors(errors);

        return Object.values(errors).every(error => error === '');
    };

    const handleBlur = (fieldName, value) => {
        const error = validateField(fieldName, value);
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: error }));
    };

    const handleFocus = (fieldName) => {
    const error = validateField(fieldName, eval(fieldName));
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: error }));
   };

   const handleChange = (fieldName, value) => {
        switch (fieldName) {
            case 'modeOfPayment':
                setModeOfPayment(value);
                break;
            case 'amount':
                setAmount(value);
                break;
            case 'transactionId':
                setTransactionId(value);
                break;
            case 'date':
                setDate(value);
                // if (validateDate(value)) {
                //     console.log('validateDate(value)',value);
                //     setDate(value);
                // }
                break;
            default:
                break;
        }
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    };

        const handleImageUploadStatus = (status, image) => {
            setIsImageUploaded(status);
            setUploadedImage(image);
            setErrors(prevErrors => ({ ...prevErrors, image: '' }));
        };

        const handleSave = () => {
            if (validateForm()) {
                // validateDate(date)
                // const payment_obj = {
                //     payment_mode   : modeOfPayment,
                //     amount         : amount,
                //     transaction_id : transactionId,
                //     payment_date   : date,
                //     image          : uploadedImage
                // }
                if (!validateDate(date)) {
                    setErrors(prevErrors => ({ ...prevErrors, date: 'Date must be in DD/MM/YY format' }));
                } else {
                    const payment_obj = {
                        payment_mode: modeOfPayment,
                        amount: amount,
                        transaction_id: transactionId,
                        payment_date: date,
                        image: uploadedImage
                    };
                    console.log('payment_obj', payment_obj);
                    handleClose();
                console.log('payment_obj',payment_obj);
                handleClose();
            }
        }
        };


    return (
        <Modal
            show={showModal}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            size="lg"
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Payment Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='modal-payment-section-invoice-cont'>
                <div className='modal-payment-form-invoice-cont'>
                <label className='modal-class-head-invoice-cont'>Mode of Payment</label>
                        <select className='modal-pay-dropdown-invoice-cont' 
                            defaultValue="Select" 
                            value={modeOfPayment}
                            onChange={e => handleChange('modeOfPayment', e.target.value)}
                            onBlur={() => handleBlur('modeOfPayment', modeOfPayment)}
                            >
                            <option value="">Select</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Online">Net Banking</option>
                        </select>
                        {errors.modeOfPayment && <span className="error">{errors.modeOfPayment}</span>}
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Amount</label>
                        <input 
                            className='modal-class-input-invoice-cont' 
                            type='text' 
                            name='amount' 
                            placeholder='Enter the Amount' 
                            value={amount}
                            onChange={e => handleChange('amount', e.target.value)}
                            onBlur={() => handleBlur('amount', amount)}
                            autoComplete='off' />
                             {errors.amount && <span className="error">{errors.amount}</span>}
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Transaction ID</label>
                        <input className='modal-class-input-invoice-cont' 
                            type='text' 
                            name='amount' 
                            value={transactionId}
                            onChange={e => handleChange('transactionId', e.target.value)}
                            onBlur={() => handleBlur('transactionId', transactionId)}
                            placeholder='Enter the Transaction ID' 
                            autoComplete='off' />
                             {errors.transactionId && <span className="error">{errors.transactionId}</span>}
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Date</label>
                        <input 
                            className='modal-class-input-invoice-cont' 
                            type='text' 
                            // type='date' 
                            name='amount' 
                            value={date}
                            onChange={e => handleChange('date', e.target.value)}
                            onBlur={() => handleBlur('date', date)}
                            placeholder='DD/MM/YY' 
                            autoComplete='off'
                             />
                             {errors.date && <span className="error">{errors.date}</span>}
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Upload Image</label>
                        <UploadDocument onUploadStatusChange={handleImageUploadStatus}/>
                        {errors.image && <span className="error">{errors.image}</span>}
                    </div>
                    {chequeImage && (
                        <div className='modal-payment-form-invoice-cont'>
                            <img src={URL.createObjectURL(chequeImage)} alt="Cheque" />
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
               
                <Button className='modal-handle-close-invoice-cont' onClick={handleClose}>
                    Cancel
                </Button>
                <Button className='modal-handle-save-invoice-cont' onClick={handleSave}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default PayModal;
