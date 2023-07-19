import React, { useEffect, useState, useMemo } from "react";

const Prompt = ({ title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const Ment = useMemo(
    () => [
      { timer: 3, message: "먼저, 찬성 측 첫번째 발언해주시겠습니까?" },
      { timer: 1, message: "반대 측 반론 있으시면 발언해주세요" },
      { timer: 3, message: "네, 이번에는 반대 측 의견을 말씀해 주세요" },
      { timer: 1, message: "찬성 측 반론 있으시면 발언해주세요" },
      { timer: 3, message: "먼저, 찬성 측 첫번째 발언해주시겠습니까?" },
      { timer: 1, message: "반대 측 반론 있으시면 발언해주세요" },
      { timer: 3, message: "네, 이번에는 반대 측 의견을 말씀해 주세요" },
      { timer: 1, message: "찬성 측 반론 있으시면 발언해주세요" },
      { timer: 4, message: "추가로 의견을 제시하실 분은 말씀해주세요" },
    ],
    []
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
