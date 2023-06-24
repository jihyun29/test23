import React, { useEffect, useState } from "react";

const ProgressBar = ({ timers }) => {
  const [totalTime, setTotalTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let total = 0;
    timers.forEach((item) => {
      total += item.timer;
    });
    setTotalTime(total);

    const timerId = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timers]);

  const progress = (elapsedTime / totalTime) * 100;

  return (
    <div className="container mx-auto my-10">
      <div className="relative left-10  bg-gray-500 w-full h-5 rounded-full">
        <div
          className="absolute top-[25%] bg-green-500 h-[50%] rounded-full"
          style={{ width: `${progress}%`, transition: "width 1s" }}
        >
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-green-500"
            style={{
              transition: "width 1s",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
