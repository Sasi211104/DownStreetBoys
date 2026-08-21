import { useEffect, useState } from "react";

function Countdown() {
  const festivalDate = new Date("2026-09-14T00:00:00");

  const calculateTimeLeft = () => {
    const difference = festivalDate - new Date();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),
      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),
      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  };

  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown">
      <p className="countdown-title">
        FESTIVAL BEGINS IN
      </p>

      <div className="countdown-boxes">

        <div className="countdown-box">
          <span>{timeLeft.days}</span>
          <small>DAYS</small>
        </div>

        <div className="countdown-box">
          <span>{timeLeft.hours}</span>
          <small>HOURS</small>
        </div>

        <div className="countdown-box">
          <span>{timeLeft.minutes}</span>
          <small>MINUTES</small>
        </div>

        <div className="countdown-box">
          <span>{timeLeft.seconds}</span>
          <small>SECONDS</small>
        </div>

      </div>
    </div>
  );
}

export default Countdown;