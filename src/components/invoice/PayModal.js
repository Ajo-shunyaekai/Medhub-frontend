import React, { useEffect } from 'react';
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

const PayModal = ({ showModal, handleClose }) => {
    useEffect(() => {
        injectStyles();
    }, []);
    return (
        <Modal
        className="custom-modal-style"
        show={showModal}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        >
            <Modal.Header closeButton>
                <Modal.Title>Add Payment Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='modal-payment-section-invoice-cont'>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Mode of Payment</label>
                        <select className='modal-pay-dropdown-invoice-cont' defaultValue="">
                            <option value="">Select</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Online">Net Banking</option>
                        </select>
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Amount</label>
                        <input className='modal-class-input-invoice-cont' type='text' name='amount' placeholder='Enter the Amount' autoComplete='off' />
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Transaction ID</label>
                        <input className='modal-class-input-invoice-cont' type='text' name='transactionId' placeholder='Enter the Transaction ID' autoComplete='off' />
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Date</label>
                        <input className='modal-class-input-invoice-cont' type='text' name='date' placeholder='DD/MM/YY' autoComplete='off' />
                    </div>
                    <div className='modal-payment-form-invoice-cont'>
                        <label className='modal-class-head-invoice-cont'>Upload Image</label>
                        <UploadDocument />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>           
                <Button className='modal-handle-close-invoice-cont' onClick={handleClose}>
                    Cancel
                </Button>
                <Button className='modal-handle-save-invoice-cont'>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}
export default PayModal;
