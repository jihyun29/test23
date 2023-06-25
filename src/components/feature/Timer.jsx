import React, { useState, useEffect } from "react";

const Timer = ({ timers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(timers[0].timer);

  useEffect(() => {
    const timerId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (remainingTime === 0 && currentIndex < timers.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setRemainingTime(timers[currentIndex + 1].timer);
    }
  }, [remainingTime, currentIndex, timers]);

  const totalSeconds = remainingTime;
  const minutes = Math.floor(remainingTime / 60); // 분 계산
  const seconds = remainingTime % 60; // 초 계산

  return (
    <div className="text-[#C6C6C6] font-bold rounded-2xl text-[2vh] right-10 mx-auto ">
      <p>
        {minutes}:{seconds}
      </p>
    </div>
  );
};

export default Timer;
