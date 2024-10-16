// // RangeDatePicker.js
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const RangeDatePicker = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        // Automatically set end date if it's before the new start date
        if (endDate && date > endDate) {
            setEndDate(null);
        }
    };

    const handleEndDateChange = (date) => {
        if (startDate && date < startDate) {
            alert("End date can't be before start date.");
        } else {
            setEndDate(date);
        }
    };

    return (
        <div className='admin-date-container'>
            <div className='admin-picker'>
                <DatePicker 
                className='admin-date-picker'
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Select start date"
                />
            </div>
            --  
            <div className='admin-picker'>
                <DatePicker
                className='admin-date-picker'
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Select end date"
                    minDate={startDate}
                />
            </div>
            {/* <div className='date-time-section'>
                {startDate && endDate && (
                    <p>
                        Selected Range: {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                    </p>
                )}
            </div> */}
        </div>
    );
};

export default RangeDatePicker;

