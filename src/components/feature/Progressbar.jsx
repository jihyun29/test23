import React, { useEffect, useState, useMemo } from "react";

const ProgressBar = ({ timers, setButtonClick }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  const testFunc = () => {
    let test = 0;
    timers.forEach((ment) => {
      test += ment.timer;
    });
    return test;
  };

  const totalTime = useMemo(testFunc, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      setElapsedTime((prevTime) => {
        if (prevTime === totalTime) {
          alert("다음 게임 준비를 시작합니다!");
          setButtonClick(false);
        }
        return prevTime + 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [totalTime, setButtonClick]);

  const progress = (elapsedTime / totalTime) * 100;

  return (
    <div className="container mx-auto w-[80%] my-10">
      <div className="relative left-10  bg-gray-500 w-full h-5 rounded-full">
        <div
          className="absolute top-[25%] bg-green-500 h-[50%] w-full rounded-full"
          style={{ width: `${progress}%`, transition: "width 1s" }}
        >
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-green-500"
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
