import React from "react";

const TrackingTimeline = ({ trackingData }) => {
  return (
    <div className="container mt-4 mb-5 bg-white p-4 shadow rounded">
      <h5 className="mb-4">Tracking History</h5>
      <div className="position-relative border-start border-3 border-secondary ms-4">
        {trackingData.map((event, index) => (
          <div key={index} className="mb-4 d-flex align-items-start position-relative">
          <div className="position-absolute start-0 translate-middle d-flex align-items-center justify-content-center rounded-circle" style={{ width: "30px", height: "30px", left: "-15px", top: "15px", border: "2px solid #282F86", background: index === trackingData.length - 1 ? "#282F86" : "#fff", color: index === trackingData.length - 1 ? "#fff" : "#282F86" }}>
            {index + 1}
          </div>
          <div className="ms-5">
            <p className="fw-bold mb-1">{event.status}</p>
            <p className="text-muted mb-1">{event.location}</p>
            <p className="text-secondary small">{event.date} at {event.time}</p>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingTimeline;
