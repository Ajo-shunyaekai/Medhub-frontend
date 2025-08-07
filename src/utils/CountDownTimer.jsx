import React, { useEffect, useState } from "react";
import moment from "moment";

const CountdownTimer = ({ startDate, startTime = "00:00", endDate, endTime = "00:00" }) => {
  const calculateTimeLeft = () => {
    if (!startDate || !endDate) return "";

    const start = moment(`${moment(startDate).format("YYYY-MM-DD")}T${startTime}`, "YYYY-MM-DDTHH:mm");
    const end = moment(`${moment(endDate).format("YYYY-MM-DD")}T${endTime}`, "YYYY-MM-DDTHH:mm");
    const now = moment();

    if (now.isBefore(start)) return "Not Started";
    if (now.isAfter(end)) return "Ended";

    const duration = moment.duration(end.diff(now));
    const days = Math.floor(duration.asDays());
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    if (days > 0) return `${days}d : ${hours}h : ${minutes}m`;
    if (hours > 0) return `${hours}h : ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${minutes}m`;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, [startDate, startTime, endDate, endTime]);

  return <span>{timeLeft}</span>;
};

export default CountdownTimer;
