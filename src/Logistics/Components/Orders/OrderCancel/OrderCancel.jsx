import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import './OrderCancel.css';
import { useNavigate } from 'react-router-dom';

const OrderCancel = ({ setModal, orderId,  activeLink }) => {
    const navigate = useNavigate()

    const [open, setOpen]     = useState(true);
    const [reason, setReason] = useState('');
    const [error, setError]   = useState('');

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
        setModal(false)
    };
    const handleReasonChange = (e) => {
        setReason(e.target.value);
    };

    const handleClose = () => {
        setOpen(false);
        setModal(false);
    };

    const handleCancel = () => {
   
        if (reason.trim() === '') {
            setError('Reason is required');
            return;
        }
        setError('');


        setModal(false)
    }

    const DrawerList = (
        <Box sx={{ width: 350 }} role="presentation">
            <div className="order-cancel-container">
                <div className="order-cancel-header">
                    <div className="order-cancel-heading">Order ID : {orderId}</div>
                    <CloseIcon onClick={handleClose} style={{ fontSize: '20px', color: '#212121' }} />
                </div>

                <div className="order-cancel-content">
                    This order is allotted to you. If you cancel this order, this order will no longer be allotted to you. Still want to cancel this, proceed further.
                </div>

                <div className="order-textarea-heading">
                    <span>Reason</span>
                    <textarea name="" id="" rows="4" className="order-textarea" />
                </div>

                <div className="order-btn-container">
                    <div className="order-close-btn" onClick={handleClose}>Close</div>
                    <div className="order-submit-btn" onClick={handleClose}>Delete</div>
                </div>
            </div>
        </Box>
    );

    return (
        <div>
            <Drawer anchor="right" open={open}>
                {DrawerList}
            </Drawer>
        </div>
    );
}

export default OrderCancel;
