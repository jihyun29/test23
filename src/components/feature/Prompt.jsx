import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function Prompt() {
  const arr = [
    "토론을 시작하겟습니다",
    "찬성 발언해주세요",
    "반대 발언해주세요",
    "토론이 종료되었습니다",
  ];

  const durations = [5000, 150000, 150000, 30000];

  const [index, setIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(durations[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % arr.length);
    }, durations[index]);

    setRemainingTime(durations[index]);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1000);
    });
  }, 1000);
  // const [counter, setCounter] = useState(0);

  // useEffect(() => {
  //   const index = setInterval(() => {
  //     setCounter((value) => value + 1);
  //   }, 1000);
  // }, []);

  const formatTime = (time) => {
    const minutes = +Math.floor(time / 60000);

    const seconds = Math.floor((time % 60000) / 1000);

    return `${minutes}분 ${seconds}초`;
  };

  return (
    <div>
      {arr[index]}
      <div>남은 시간: {formatTime(remainingTime)}</div>
    </div>
  );

  // return (
  //   <div>
  //     <div>
  //       {Mention.map((item) => (
  //         <div key={item.id}>{item.ment}</div>
  //       ))}
  //     </div>
  //     <h1>{counter}</h1>
  //   </div>
  // );
}

export default Prompt;
