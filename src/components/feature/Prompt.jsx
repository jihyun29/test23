import React, { useEffect, useState, useMemo } from "react";

const Prompt = ({ title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const Ment = useMemo(
    () => [
      {
        timer: 1,
        message: ` ${title}에 대해 토론을 진행하도록 하겠습니다.`,
      },
      { timer: 1, message: "먼저, 찬성 측 첫번째 발언해주시겠습니까?" },
      { timer: 1, message: "반대 측 반론 있으시면 발언해주세요" },
      { timer: 1, message: "네, 이번에는 반대 측 의견을 말씀해 주세요" },
      { timer: 1, message: "찬성 측 반론 있으시면 발언해주세요" },
      { timer: 1, message: "추가로 의견을 제시하실 분은 말씀해주세요" },
      {
        timer: 1,

        message: "시간이 얼마 남지 않았습니다. 마지막 결론 말씀해주세요",
      },
    ],
    [title]
  );

  useEffect(() => {
    if (currentIndex < Ment.length - 1) {
      const timerId = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, Ment[currentIndex].timer * 1000);

      return () => clearTimeout(timerId);
    }
  }, [currentIndex, Ment]);

  return <p>{Ment[currentIndex].message}</p>;
};

export default Prompt;
