import React from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";

function TestProgressComp({ endGameSignalHandler }) {
  // gameTime : 게임시간 (초 단위)
  const gameTime = 7;
  const [runningTime, setRunningTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(gameTime);

  const progressBarPercent = (runningTime / gameTime) * 100;

  const minutes = Math.floor(remainingTime / 60); // 분 계산
  const seconds = remainingTime % 60; // 초 계산

  const gameEnd = useCallback(
    () =>
      setTimeout(() => {
        endGameSignalHandler();
      }, 1000),
    [endGameSignalHandler]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRunningTime((prevTime) => {
        setRemainingTime(gameTime - (prevTime + 1));
        return prevTime + 1;
      });
    }, 1000);
    console.log(gameTime, runningTime, progressBarPercent);
    if (runningTime === gameTime) {
      gameEnd();
    }
    return () => {
      clearInterval(timer);
    };
  }, [runningTime]);

  return (
    <>
      <div className="mx-auto w-full px-[2.97vw]">
        <div className="relative bg-[#2F3131] w-full h-[3px] translate-y-[50%] rounded-full">
          <div
            className="absolute top-[25%] bg-[#EFFE37] h-[50%] w-full rounded-full z-[2]"
            style={{
              width: `${progressBarPercent}%`,
              transition: "width 0.5s",
            }}
          >
            <div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-[#EFFE37] z-[3]"
              style={{
                transition: "width 1s",
              }}
            ></div>
          </div>
        </div>
      </div>
      {/* <div className="text-[#C6C6C6] font-bold rounded-2xl text-[2vh] right-10 mx-auto">
        <p>
          {minutes}:{seconds}
        </p>
      </div> */}
    </>
  );
}

export default TestProgressComp;
