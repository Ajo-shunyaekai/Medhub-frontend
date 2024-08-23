import React, { useEffect, useState } from 'react';
import styles from '../style/createInvoice.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { PhoneInput } from 'react-international-phone';


const EditCreatePO = () => {
    const { purchaseOrderId } = useParams()
    const navigate            = useNavigate();

    const [poDetails, setPoDetails] = useState();

    const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
    const buyerIdLocalStorage   = localStorage.getItem("buyer_id");

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            poDate: '',
            poNumber: '',
            supplierName: '',
            supplierAddress: '',
            supplierEmail: '',
            supplierMobile: '',
            supplierRegNo: '',
            buyerName: '',
            buyerAddress: '',
            buyerEmail: '',
            buyerMobile: '',
            buyerRegNo: '',
            orderItems: [],
            description: ''
        }
    });

    useEffect(() => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const obj = {
            buyer_id         : buyerIdSessionStorage || buyerIdLocalStorage,
            purchaseOrder_id : purchaseOrderId,
        };
        postRequestWithToken('buyer/purchaseorder/get-po-details', obj, async (response) => {
            if (response.code === 200) {
                setPoDetails(response?.result);
                setValue('poId', response?.result?.purchaseOrder_id);
                setValue('poDate', response?.result?.po_date);
                setValue('poNumber', response?.result?.po_number);
                setValue('description', response?.result?.additional_instructions);
                setValue('poStatus', response?.result?.po_status);
                setValue('buyerName', response?.result?.buyer_name);
                setValue('buyerEmail', response?.result?.buyer_email);
                setValue('buyerMobile', response?.result?.buyer_mobile);
                setValue('buyerAddress', response?.result?.buyer_address);
                setValue('buyerRegNo', response?.result?.buyer_regNo);
                setValue('supplierName', response?.result?.supplier_name);
                setValue('supplierEmail', response?.result?.supplier_email);
                setValue('supplierMobile', response?.result?.supplier_mobile);
                setValue('supplierAddress', response?.result?.supplier_address);
                setValue('supplierRegNo', response?.result?.supplier_regNo);
                setValue('orderItems', response?.result?.order_items);
            } else {
                console.log('error in order list api', response);
            }
        });
    }, [navigate, buyerIdSessionStorage, buyerIdLocalStorage, purchaseOrderId, setValue]);

    const onSubmit = (data) => {
        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }
        const supplierId = poDetails?.supplier_details[0]?.supplier_id;  
        const enquiryId  = poDetails?.enquiry_id;    

        const obj = {
            buyer_id         : buyerIdSessionStorage || buyerIdLocalStorage,
            purchaseOrder_id : purchaseOrderId,
            supplier_id      : supplierId,
            enquiry_id       : enquiryId,
            data
        };
        postRequestWithToken('buyer/purchaseorder/edit-po', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, {type: 'success'})
                setTimeout(() => {
                    navigate('/buyer/inquiry-purchase-orders/purchased')
                },1000)
            } else {
                console.log('error in order list api', response);
                toast(response.message, {type: 'error'})
            }
        });
    };

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Edit Purchase Order</div>
            <form className={styles['create-po-main-form-container']} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Buyer</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='buyerName'
                                placeholder='Enter Name'
                                {...register('buyerName', { validate: value => value.trim() !== '' || 'Buyer name is required' })}
                            />
                            {errors.buyerName && <p>{errors.buyerName.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='buyerAddress'
                                placeholder='Enter Address'
                                {...register('buyerAddress', { validate: value => value.trim() !== '' || 'Buyer address is required' })}
                            />
                            {errors.buyerAddress && <p>{errors.buyerAddress.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='email'
                                name='buyerEmail'
                                placeholder='Enter Email ID'
                                {...register('buyerEmail', { validate: value => value.trim() !== '' || 'Buyer email is required' })}
                            />
                            {errors.buyerEmail && <p>{errors.buyerEmail.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name='buyerMobile'
                                placeholder='Enter Mobile No.'
                                {...register('buyerMobile', { validate: value => value.trim() !== '' || 'Buyer mobile number is required' })}
                            />
                            {errors.buyerMobile && <p>{errors.buyerMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Company Registration Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='buyerRegNo'
                                placeholder='Enter Company Registration Number'
                                {...register('buyerRegNo', { validate: value => value.trim() !== '' || 'Buyer registration number is required' })}
                            />
                            {errors.buyerRegNo && <p>{errors.buyerRegNo.message}</p>}
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Supplier</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Date</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='poDate'
                                // value={currentDate}
                                readOnly
                                {...register('poDate')}
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>PO Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='poNumber'
                                // value={poNumber}
                                readOnly
                                {...register('poNumber')}
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='supplierName'
                                placeholder='Enter Name'
                                {...register('supplierName', { validate: value => value.trim() !== '' || 'Supplier name is required' })}
                            />
                            {errors.supplierName && <p>{errors.supplierName.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='supplierAddress'
                                placeholder='Enter Address'
                                {...register('supplierAddress', { validate: value => value.trim() !== '' || 'Supplier address is required' })}
                            />
                            {errors.supplierAddress && <p>{errors.supplierAddress.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='email'
                                name='supplierEmail'
                                placeholder='Enter Email ID'
                                {...register('supplierEmail', { validate: value => value.trim() !== '' || 'Supplier email is required' })}
                            />
                            {errors.supplierEmail && <p>{errors.supplierEmail.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile Number</label>
                            <PhoneInput
                                className='signup-form-section-phone-input'
                                defaultCountry="ae"
                                name='supplierMobile'
                                placeholder='Enter Mobile No.'
                                {...register('supplierMobile', { validate: value => value.trim() !== '' || 'Supplier mobile number is required' })}
                            />
                            {errors.supplierMobile && <p>{errors.supplierMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Company Registration Number</label>
                            <input
                                className={styles['create-invoice-div-input']}
                                type='text'
                                name='supplierRegNo'
                                placeholder='Enter Company Registration Number'
                                {...register('supplierRegNo', { validate: value => value.trim() !== '' || 'Supplier registration number is required' })}
                            />
                            {errors.supplierRegNo && <p>{errors.supplierRegNo.message}</p>}
                        </div>
                    </div>
                </div>
               
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-add-item-cont']}>
                        <div className={styles['create-invoice-form-heading']}>Order Details</div>
                    </div>
                    {poDetails?.order_items?.map((item, index) => (
                        <div className={styles['form-item-container']} key={item._id}>
                            <div className={styles['craete-invoice-form']}>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Item Name</label>
                                    <input
                                        className={styles['create-invoice-div-input']}
                                        type='text'
                                        name={`orderItems[${index}].productName`}
                                        placeholder='Item Name'
                                        value = {item?.medicine_details?.medicine_name}
                                        readOnly
                                    />
                                    {errors.orderItems?.[index]?.productName && <p>{errors.orderItems[index].productName.message}</p>}
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Quantity</label>
                                    <input
                                        className={styles['create-invoice-div-input']}
                                        type='text'
                                        name={`orderItems[${index}].quantity`}
                                        placeholder='Enter Quantity'
                                        value = {item?.quantity_required}
                                        readOnly
                                    />
                                    {errors.orderItems?.[index]?.quantity && <p>{errors.orderItems[index].quantity.message}</p>}
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Unit Price</label>
                                    <input
                                        className={styles['create-invoice-div-input']}
                                        type='text'
                                        name={`orderItems[${index}].unitPrice`}
                                        placeholder='Enter Unit Price'
                                        value = {item?.unit_price}
                                        readOnly
                                    />
                                    {errors.orderItems?.[index]?.unitPrice && <p>{errors.orderItems[index].unitPrice.message}</p>}
                                </div>
                                <div className={styles['create-invoice-div-container']}>
                                    <label className={styles['create-invoice-div-label']}>Total Amount</label>
                                    <input
                                        className={styles['create-invoice-div-input']}
                                        type='text'
                                        name={`orderItems[${index}].totalAmount`}
                                        placeholder='Enter Total Amount'
                                        value = {item?.total_amount || item?.counter_price} 
                                        readOnly
                                    />
                                    {errors.orderItems?.[index]?.totalAmount && <p>{errors.orderItems[index].totalAmount.message}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Additional Instructions</div>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-textarea']}>
                            <label className={styles['create-invoice-div-label']}>Description</label>
                            <textarea
                                className={styles['create-invoice-div-input']}
                                name="description"
                                rows="4"
                                cols="10"
                                placeholder='Enter Description'
                                {...register('description')}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['craete-invoices-button']}>
                <button type='submit' className={styles['create-invoices-submit']}>Edit</button>
                    <div className={styles['create-invoices-cancel']}>Cancel</div>
                   
                </div>
            </form>
        </div>
    );
};

export default EditCreatePO;