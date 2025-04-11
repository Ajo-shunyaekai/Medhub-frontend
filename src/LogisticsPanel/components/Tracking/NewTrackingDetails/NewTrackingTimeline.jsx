import React from "react";
import styles from '../NewTrackingForm/NewTrackingForm.module.css';
import Card from "../../UI/FormCard/FormCard";

const NewTrackingTimeline = ({ trackingData }) => {
  return (
    <Card>
      <h5 className={`mb-4 ${styles.formHead}`}>Tracking History</h5>
      <div className="position-relative border-start border-3 border-secondary ms-4">
        {trackingData.map((event, index) => (
          <div key={index} className="mb-4 d-flex align-items-start position-relative">
          <div className="position-absolute start-0 translate-middle d-flex align-items-center justify-content-center rounded-circle" style={{ width: "30px", height: "30px", left: "-15px", top: "15px", border: "2px solid #282F86", background: index === trackingData.length - 1 ? "#282F86" : "#fff", color: index === trackingData.length - 1 ? "#fff" : "#282F86" }}>
            {index + 1}
          </div>
          <div className="ms-5">
            <p className={`fw-bold mb-1 ${styles.formLabel}`}>{event.status}</p>
            <p className="text-muted mb-1">{event.location}</p>
            <p className="text-secondary small">{event.date} at {event.time}</p>
          </div>
        </div>
        ))}
      </div>
    </Card>
  );
};

export default NewTrackingTimeline;
