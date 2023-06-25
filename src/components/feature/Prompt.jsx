import React, { useEffect, useState } from "react";

const Prompt = ({ timers }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < timers.length - 1) {
      const timerId = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, timers[currentIndex].timer * 1000);

      return () => clearTimeout(timerId);
    }
  }, [currentIndex, timers]);

  return <p>{timers[currentIndex].message}</p>;
};

export default Prompt;
