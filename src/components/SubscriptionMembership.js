import React from 'react'
import '../style/subscriptionmember.css'
import TableMembership from './membership/TableMembership'

const SubscriptionMembership = () => {
    return (
        <div className='membership-main-section'>
            <div className='membership-main-head'>Billing Details</div>
            <div className='membership-main-container'>
                <div className='membership-container-head'>Your Subscription</div>
                <div className='membership-main-plan-section'>
                    <div className='membership-base-plan-section' >
                        <div className='membership-plan-heading'>Plan</div>
                        <div className='membership-basic-heading'>Basic</div>
                        <div className='membership-month-heading'>USD 123/Month</div>
                    </div>
                    <div className='membership-base-plan-section'>
                        <div className='membership-plan-heading'>Next billing date</div>
                        <div className='membership-month-heading'>30 July 2024</div>
                    </div>
                </div>
            </div>
            <div className='membership-table-main-section'>
                <TableMembership />
            </div>
        </div>
    )
}

export default SubscriptionMembership