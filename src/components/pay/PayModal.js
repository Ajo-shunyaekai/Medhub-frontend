import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import UploadDocument from '../../components/pay/UploadDocument';
import '../../style/custommodal.css'
import { postRequestWithToken, postRequestWithTokenAndFile } from '../../api/Requests';
import { toast } from 'react-toastify';
import { InputMask } from '@react-input/mask';
import { useNavigate } from 'react-router-dom';

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

function PayModal({ showModal, handleClose, invoiceId, orderId, buyerId, supplierId, socket }) {
    const navigate = useNavigate()
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

    const handleBlur = (e) => {
        const { name, value } = e.target;
        let newErrors = { ...errors };
        let isValid = true;

        if (name === 'date') {
            // Validate the format dd/mm/yyyy
            if (value.trim() && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                const [day, month, year] = value.split('/').map(Number);
                const currentYear = new Date().getFullYear();

                // Helper function to check if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
                };

                // Days allowed per month
                const daysInMonth = {
                    1: 31, // January
                    2: isLeapYear(year) ? 29 : 28, // February (leap year check)
                    3: 31, // March
                    4: 30, // April
                    5: 31, // May
                    6: 30, // June
                    7: 31, // July
                    8: 31, // August
                    9: 30, // September
                    10: 31, // October
                    11: 30, // November
                    12: 31, // December
                };

                // Validate month (01 to 12)
                if (month < 1 || month > 12) {
                    newErrors[name] = 'Invalid Month';
                    isValid = false;
                }
                // Validate day based on the month and year
                else if (day < 1 || day > daysInMonth[month]) {
                    newErrors[name] = `Invalid Day`;
                    isValid = false;
                }
                // Validate year (less than or equal to current year)
                else if (year > currentYear) {
                    newErrors[name] = `Invalid Year.`;
                    isValid = false;
                } else {
                    delete newErrors[name]; // Clear the error if valid
                    isValid = true;
                }
            } else if (value.trim()) {
                // If the input doesn't match the dd/mm/yyyy format
                newErrors[name] = 'Invalid Date Format. Please Use dd/mm/yyyy';
                isValid = false;
            } else {
                delete newErrors[name]; // Clear the error if input is empty
                isValid = true;
            }

            setErrors(newErrors);
        }
    };

    const validateDate = (value) => {
        // Allows dates in dd/mm/yyyy format
        const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        return datePattern.test(value);
    };
    const validateAmount = (value) => {
        const amountPattern = /^\d{1,8}(\.\d{0,3})?$/;
        return amountPattern.test(value);
    };

    const validateTransactionId = (value) => {
        const transactionIdPattern = /^[a-zA-Z0-9]{1,20}$/;
        return transactionIdPattern.test(value);
    };

    // const handleChange = (fieldName, value) => {
    //     let isValid = false;

    //     switch (fieldName) {
    //         case 'modeOfPayment':
    //             isValid = value !== '';
    //             if (isValid) setModeOfPayment(value);
    //             break;
    //         case 'amount':
    //             isValid = validateAmount(value);
    //             if (isValid) setAmount(value);
    //             break;
    //         case 'transactionId':
    //             isValid = validateTransactionId(value);
    //             if (isValid) setTransactionId(value);
    //             break;
    //             case 'date':
    //                 // Ensure that the value is a valid date format before setting it
    //                 // isValid = validateDate(value);
    //                 // if (isValid)
    //                      setDate(value);
    //                 break;
    //         default:
    //             break;
    //     }

    //     setErrors(prevErrors => ({ ...prevErrors, [fieldName]: isValid ? '' : '' }));
    // };


    const handleChange = (fieldName, value) => {
        let isValid = false;
    
        switch (fieldName) {
            case 'modeOfPayment':
                isValid = value !== '';
                if (isValid) setModeOfPayment(value);
                break;
            case 'amount':
                // Allow up to 8 digits before the decimal and 3 after, and prevent more than that
                if (value === '' || validateAmount(value)) {
                    isValid = true; // Allow empty value or valid amount
                    setAmount(value);
                } else {
                    // Prevent entering more than the allowed limit
                    isValid = false; // Don't update state if invalid input
                }
                break;
            case 'transactionId':
                // Allow up to 20 characters and prevent more than that
                if (value.length <= 20 && /^[a-zA-Z0-9]*$/.test(value)) {
                    isValid = true; // Allow input up to 20 characters and valid alphanumeric input
                    setTransactionId(value);
                } else if (value.length <= 20) {
                    setTransactionId(value); // Allow input up to 20 characters, even if invalid
                    isValid = true; // Don't show error if within character limit
                } else {
                    isValid = false; // Don't update state if input is too long
                }
                break;
            case 'date':
                setDate(value); // Date field can be set directly
                break;
            default:
                break;
        }
    
        // Set errors only if invalid or empty
        setErrors(prevErrors => ({
            ...prevErrors,
            [fieldName]: value === '' && !isValid ? `${fieldName} is required` : '' // Only show error if empty
        }));
    };
    

    const handleImageUploadStatus = (status, image) => {
        setIsImageUploaded(status);
        setUploadedImage(image);
        setErrors(prevErrors => ({ ...prevErrors, image: status ? '' : 'Image is required' }));
    };

    const validateForm = () => {
        const errors = {};

        errors.modeOfPayment = modeOfPayment === '' ? 'Mode of Payment is required' : '';
        errors.amount = !validateAmount(amount) ? 'Amount Paid is Required' : '';
        errors.transactionId = !validateTransactionId(transactionId) ? 'Transaction ID is Required' : '';
        // errors.date = !validateDate(date) ? 'Date is Required' : '';
        errors.date =  date === '' ? 'Date is Required' : '';
        errors.image = !isImageUploaded ? 'Image is Required' : '';

        setErrors(errors);

        return Object.values(errors).every(error => error === '');
    };

    const handleSave = () => {
        if (validateForm()) {
            const formData = new FormData();
            formData.append('order_id', orderId);
            formData.append('invoice_id', invoiceId);
            formData.append('buyer_id', buyerId);
            formData.append('supplier_id', supplierId);
            formData.append('mode_of_payment', modeOfPayment);
            formData.append('amount_paid', amount);
            formData.append('transaction_id', transactionId);
            formData.append('payment_date', date);
            formData.append('transaction_image', uploadedImage);

            postRequestWithTokenAndFile('buyer/invoice/update-payment-status', formData, async (response) => {
                if (response.code === 200) {
                    toast(response.message, { type: 'success' });
                    socket.emit('invoicePaymentDone', {
                        supplierId: supplierId, 
                        orderId : orderId,
                        invoiceId : invoiceId,
                        message: `Payment completed for Invoice ${invoiceId} on Order ${orderId}.`,
                        link : process.env.REACT_APP_PUBLIC_URL

                    });
                    setTimeout(() => {
                        navigate('/buyer/invoice/paid')
                    })
                    handleClose();
                } else {
                    toast(response.message, { type: 'error' });
                    console.log('Error in proforma invoice list API:', response);
                }
            });
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
                            >
                            <option value="">Select</option>
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
                            placeholder='Enter the Transaction ID' 
                            autoComplete='off' />
                             {errors.transactionId && <span className="error">{errors.transactionId}</span>}
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Date</label>
                        <InputMask
                            className='modal-class-input-invoice-cont' 
                            type='text' 
                            name='date'
                            value={date}
                            onChange={e => handleChange('date', e.target.value)}
                            onBlur={handleBlur}
                             mask="dd/mm/yyyy" 
                             placeholder='dd/mm/yyyy'
                            autoComplete='off'
                            replacement={{ d: /\d/, m: /\d/, y: /\d/ }} showMask separate 
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


// function PayModal({ showModal, handleClose, invoiceId, orderId }) {
//     console.log(invoiceId, orderId);
//     const [selectedDate, setSelectedDate] = useState(new Date()); 
//     const [chequeImage, setChequeImage] = useState(null);

//     const [modeOfPayment, setModeOfPayment] = useState('');
//     const [amount, setAmount] = useState('');
//     const [transactionId, setTransactionId] = useState('');
//     const [date, setDate] = useState('');
//     const [isImageUploaded, setIsImageUploaded] = useState(false);
//     const [uploadedImage, setUploadedImage] = useState(null);
//     const [errors, setErrors] = useState({});

//     useEffect(() => {
//         if (!showModal) {
//             setModeOfPayment('');
//             setAmount('');
//             setTransactionId('');
//             setDate('');
//             setIsImageUploaded(false);
//             setUploadedImage(null);
//             setErrors({});
//         }
//     }, [showModal]);

//     const validateDate = (value) => {
//         // Validate the format dd/mm/yyyy
//         const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
//         if (!datePattern.test(value)) return false;

//         const [day, month, year] = value.split('/').map(Number);
//         const currentYear = new Date().getFullYear();

//         // Helper function to check if a year is a leap year
//         const isLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);

//         // Days allowed per month
//         const daysInMonth = {
//             1: 31, // January
//             2: isLeapYear(year) ? 29 : 28, // February (leap year check)
//             3: 31, // March
//             4: 30, // April
//             5: 31, // May
//             6: 30, // June
//             7: 31, // July
//             8: 31, // August
//             9: 30, // September
//             10: 31, // October
//             11: 30, // November
//             12: 31, // December
//         };

//         // Validate month (01 to 12)
//         if (month < 1 || month > 12) return false;
//         // Validate day based on the month and year
//         if (day < 1 || day > daysInMonth[month]) return false;
//         // Validate year (less than or equal to current year)
//         if (year > currentYear) return false;

//         return true;
//     };

//     const handleChange = (fieldName, value) => {
//         let isValid = false;

//         switch (fieldName) {
//             case 'modeOfPayment':
//                 isValid = value !== '';
//                 if (isValid) setModeOfPayment(value);
//                 break;
//             case 'amount':
//                 isValid = validateAmount(value);
//                 if (isValid) setAmount(value);
//                 break;
//             case 'transactionId':
//                 isValid = validateTransactionId(value);
//                 if (isValid) setTransactionId(value);
//                 break;
//             case 'date':
//                 isValid = validateDate(value);
//                 if (isValid) setDate(value);
//                 break;
//             default:
//                 break;
//         }

//         setErrors(prevErrors => ({ ...prevErrors, [fieldName]: isValid ? '' : 'Invalid value' }));
//     };

//     const handleBlur = (e) => {
//         const { name, value } = e.target;
//         let newErrors = { ...errors };

//         if (name === 'date') {
//             // Validate the format dd/mm/yyyy
//             const isValid = validateDate(value);
//             newErrors[name] = isValid ? '' : 'Invalid Date Format. Please Use dd/mm/yyyy';
//             setErrors(newErrors);
//         }
//     };

//     const validateAmount = (value) => {
//         const amountPattern = /^\d{1,8}(\.\d{0,3})?$/;
//         return amountPattern.test(value);
//     };

//     const validateTransactionId = (value) => {
//         const transactionIdPattern = /^[a-zA-Z0-9]{1,20}$/;
//         return transactionIdPattern.test(value);
//     };

//     const handleFileChange = event => {
//         const file = event.target.files[0];
//         setChequeImage(file);
//     };

//     const handleImageUploadStatus = (status, image) => {
//         setIsImageUploaded(status);
//         setUploadedImage(image);
//         setErrors(prevErrors => ({ ...prevErrors, image: status ? '' : 'Image is required' }));
//     };

//     const validateForm = () => {
//         const errors = {};

//         errors.modeOfPayment = modeOfPayment === '' ? 'Mode of Payment is required' : '';
//         errors.amount = !validateAmount(amount) ? 'Amount Paid is Required' : '';
//         errors.transactionId = !validateTransactionId(transactionId) ? 'Transaction ID is Required' : '';
//         errors.date = !validateDate(date) ? 'Date is Required' : '';
//         errors.image = !isImageUploaded ? 'Image is Required' : '';

//         setErrors(errors);

//         return Object.values(errors).every(error => error === '');
//     };

//     const handleSave = () => {
//         if (validateForm()) {
//             const formData = new FormData();
//             formData.append('order_id', orderId);
//             formData.append('invoice_id', invoiceId);
//             formData.append('payment_mode', modeOfPayment);
//             formData.append('amount_paid', amount);
//             formData.append('transaction_id', transactionId);
//             formData.append('payment_date', date);
//             formData.append('transaction_image', uploadedImage);

//             postRequestWithTokenAndFile('buyer/invoice/update-payment-status', formData, async (response) => {
//                 if (response.code === 200) {
//                     toast(response.message, { type: 'success' });
//                     handleClose();
//                 } else {
//                     toast(response.message, { type: 'error' });
//                     console.log('Error in proforma invoice list API:', response);
//                 }
//             });
//         }
//     };

//     return (
//         <Modal
//             show={showModal}
//             onHide={handleClose}
//             backdrop="static"
//             keyboard={false}
//             size="lg"
//         >
//             <Modal.Header closeButton>
//                 <Modal.Title>Add Payment Status</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div className='modal-payment-section-invoice-cont'>
//                     <div className='modal-payment-form-invoice-cont'>
//                         <label className='modal-class-head-invoice-cont'>Mode of Payment</label>
//                         <select 
//                             className='modal-pay-dropdown-invoice-cont' 
//                             defaultValue="Select" 
//                             value={modeOfPayment}
//                             onChange={e => handleChange('modeOfPayment', e.target.value)}
//                         >
//                             <option value="">Select</option>
//                             <option value="Cheque">Cheque</option>
//                             <option value="Online">Net Banking</option>
//                         </select>
//                         {errors.modeOfPayment && <span className="error">{errors.modeOfPayment}</span>}
//                     </div>
//                     <div className='modal-payment-form-invoice-cont'>
//                         <label className='modal-class-head-invoice-cont'>Amount</label>
//                         <input 
//                             className='modal-class-input-invoice-cont' 
//                             type='text' 
//                             name='amount' 
//                             placeholder='Enter the Amount' 
//                             value={amount}
//                             onChange={e => handleChange('amount', e.target.value)}
//                             onBlur={handleBlur}
//                             autoComplete='off' 
//                         />
//                         {errors.amount && <span className="error">{errors.amount}</span>}
//                     </div>
//                     <div className='modal-payment-form-invoice-cont'>
//                         <label className='modal-class-head-invoice-cont'>Transaction ID</label>
//                         <input 
//                             className='modal-class-input-invoice-cont' 
//                             type='text' 
//                             name='transactionId' 
//                             value={transactionId}
//                             onChange={e => handleChange('transactionId', e.target.value)}
//                             onBlur={handleBlur}
//                             placeholder='Enter the Transaction ID' 
//                             autoComplete='off' 
//                         />
//                         {errors.transactionId && <span className="error">{errors.transactionId}</span>}
//                     </div>
//                     <div className='modal-payment-form-invoice-cont'>
//                         <label className='modal-class-head-invoice-cont'>Date</label>
//                         {/* <input 
//                             className='modal-class-input-invoice-cont' 
//                             type='text' 
//                             name='date'
//                             value={date}
//                             onChange={e => handleChange('date', e.target.value)}
//                             onBlur={handleBlur}
//                             placeholder='DD/MM/YYYY' 
//                             autoComplete='off'
//                         /> */}

//                         <InputMask
//                             className='modal-class-input-invoice-cont' 
//                             type='text' 
//                             name='date'
//                             value={date}
//                             onChange={e => handleChange('date', e.target.value)}
//                             // onBlur={handleBlur}
//                              mask="dd-mm-yyyy" 
//                              placeholder='dd-mm-yyyy'
//                             autoComplete='off'
//                             replacement={{ d: /\d/, m: /\d/, y: /\d/ }} showMask separate 
//                         />
//                         {errors.date && <span className="error">{errors.date}</span>}
//                     </div>
//                     <div className='modal-payment-form-invoice-cont'>
//                         <label className='modal-class-head-invoice-cont'>Upload Image</label>
//                         <input 
//                             type='file' 
//                             accept='image/*' 
//                             onChange={handleFileChange} 
//                             className='modal-file-upload'
//                         />
//                         {errors.image && <span className="error">{errors.image}</span>}
//                     </div>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={handleClose}>Close</Button>
//                 <Button variant="primary" onClick={handleSave}>Save</Button>
//             </Modal.Footer>
//         </Modal>
//     );
// }


export default PayModal;
