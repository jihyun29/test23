import React from "react";
import { useState } from "react";
import { useEffect } from "react";

function Prompt() {
  const promptTextList = [
    "토론을 시작하겟습니다",
    "찬성 발언해주세요",
    "반대 발언해주세요",
    "토론이 종료되었습니다",
  ];

  const durations = [5000, 10000, 10000, 3000];

  const [index, setIndex] = useState(0);
  let remainTime = durations[index];

  const time = () => {
    if (remainTime === 0) {
      setIndex(index + 1);
      remainTime = durations[index];
    }
    remainTime -= 1000;
    console.log(index);
    console.log(remainTime);
  };

  if (index > 3) {
    clearInterval(time);
  }
  useEffect(() => {
    setInterval(time, 1000);
    return clearInterval(time);
  }, []);

  return <div>{promptTextList[index]}</div>;
}

export default Prompt;
