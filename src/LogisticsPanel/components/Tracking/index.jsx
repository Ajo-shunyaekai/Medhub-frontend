import React from 'react';
import styles from './TrackingForm/TrackingForm.module.css';
import Tracking from "./TrackingForm/TrackingForm";
import TrackingTimeline from './TrackingDetails/TrackingTimeline';

const trackingData = [
  { status: "Delivered", location: "Ahmedabad, GJ", date: "27th Aug 2021", time: "2:30 PM" },
  { status: "Out For Delivery", location: "Ahmedabad, GJ", date: "27th Aug 2021", time: "11:30 AM" },
  { status: "In transit", location: "From Mumbai, MH to Ahmedabad, GJ", date: "25th Aug 2021", time: "05:30 PM" },
  { status: "Order Picked up", location: "Mumbai, MH", date: "24th Aug 2021", time: "07:26 AM" },
  { status: "Order Received", location: "Mumbai, MH", date: "23rd Aug 2021", time: "12:46 PM" },
];

const index = () => {
  return (
    <div className={styles.mainContainer}>
      <Tracking/>
      <TrackingTimeline trackingData={trackingData} />
    </div>
  )
}

export default index;