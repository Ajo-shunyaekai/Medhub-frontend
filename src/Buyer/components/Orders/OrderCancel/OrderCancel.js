import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const OrderCancel = ({ setModal, orderId,  activeLink  }) => {
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

    const handleCancel = () => {
        const buyerIdSessionStorage = localStorage.tItem("buyer_id");
        const buyerIdLocalStorage   = localStorage?.getItem("buyer_id");

    if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
      localStorage?.clear();
      navigate("/buyer/login");
      return;
    }
        if (reason.trim() === '') {
            setError('Reason is required');
            return;
        }
        setError('');


        const obj = {
            buyer_id   : buyerIdLocalStorage || buyerIdSessionStorage,
            order_id   : orderId,
            order_type : activeLink,
            reason     : reason
        }

        setModal(false)
    }


    const DrawerList = (
        <Box sx={{ width: 350 }} role="presentation" >
            <div className="order-cancel-container">
                <div className="order-cancel-header">
                    <div className="order-cancel-heading">Order ID : {orderId}
                    </div>
                    <CloseIcon onClick={toggleDrawer(false)} style={{ fontSize: '20px', color: '#5e676f' }} />
                </div>

                <div className="order-cancel-content">
                    This order is allotted to you. If you cancel this order, this order will no longer be allotted to you. Still wants to cancel this, proceed further
                </div>

                <div className="order-textarea-heading">
                    <span>Reason</span>
                    <textarea 
                    name="" 
                    id="" rows="4" 
                    className=" order-textarea" 
                    value={reason}
                    onChange={handleReasonChange}
                    />
                    {error && <div className="error-message" style={{color:'red'}}>{error}</div>}
                </div>

                <div className="order-btn-container">
                    <div className="order-close-btn" onClick={toggleDrawer(false)}>   Close</div>
                    <div className="order-submit-btn" onClick={() => handleCancel()}>   Submit</div>
                </div>
            </div>
        </Box>
    );

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}

export default OrderCancel