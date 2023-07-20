import React from "react";
import { useEffect, useState, useRef } from "react";

function TestProgressbar({ endGameSignalHandler }) {
  const [progress, setProgress] = useState("first");
  const totalGameTime = 20;
  const [progressbarPercent, setProgressbarPercent] = useState(0);
  const [progressName, setProgressName] = useState("찬성 발언");
  const progressStyle = useRef("text-white bg-[#14B5FF]");
  useEffect(() => {
    let counter = 0;
    const test = setInterval(() => {
      counter += 1;
      console.log(counter);
      setProgressbarPercent((counter / totalGameTime) * 100);
      switch (counter) {
        case 3:
          setProgress("second");
          setProgressName("반대 반론");
          progressStyle.current = "text-white bg-[#FA3C3C]";
          break;
        case 4:
          setProgress("third");
          setProgressName("반대 발언");
          break;
        case 7:
          setProgress("fourth");
          setProgressName("찬성 반론");
          progressStyle.current = "text-white bg-[#14B5FF]";
          break;
        case 8:
          setProgress("fifth");
          setProgressName("찬성 발언");
          break;
        case 11:
          setProgress("sixth");
          setProgressName("반대 반론");
          progressStyle.current = "text-white bg-[#FA3C3C]";
          break;
        case 12:
          setProgress("seventh");
          setProgressName("반대 발언");
          break;
        case 15:
          setProgress("eigth");
          setProgressName("찬성 반론");
          progressStyle.current = "text-white bg-[#14B5FF]";
          break;
        case 16:
          setProgress("nine");
          setProgressName("최종 발언");
          progressStyle.current = "text-black bg-[#EFFE37]";
          break;
        case 20:
          clearInterval(test);
          setProgress("");
          endGameSignalHandler();
          break;
        default:
          break;
      }
    }, 1000);
  }, []);
  return (
    <>
      <div className="mx-auto w-full px-[2.97vw]">
        <div className="relative flex w-full h-[3px] whitespace-nowrap">
          <div
            className="absolute top-[-20px] h-[50%] w-full rounded-full z-[4]"
            style={{
              width: `${progressbarPercent}%`,
              transition: "width 0.5s",
            }}
          >
            <div
              className={
                progressStyle.current +
                " absolute right-0 transform translate-y-[-50%] translate-x-[50%] w-fit h-fit px-[0.625vw] py-[0.42vh] rounded-[0.67vh] font-bold text-[1.17vh] z-[5]"
              }
              style={{
                transition: "width 1s",
              }}
            >
              {progressName}
            </div>
          </div>
          {progress === "first" ? (
            <>
              <div className="absolute left-[0%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#14B5FF]" />
              <div className="w-[15%] border-[1.5px] border-[#14B5FF] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[0%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[15%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "second" ? (
            <>
              <div className="absolute left-[15%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#FA3C3C]" />
              <div className="w-[5%] border-[1.5px] border-[#FA3C3C] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[15%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[5%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "third" ? (
            <>
              <div className="absolute left-[20%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#FA3C3C]" />
              <div className="w-[15%] border-[1.5px] border-[#FA3C3C] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[20%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[15%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "fourth" ? (
            <>
              <div className="absolute left-[35%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#14B5FF]" />
              <div className="w-[5%] border-[1.5px] border-[#14B5FF] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[35%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[5%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "fifth" ? (
            <>
              <div className="absolute left-[40%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#14B5FF]" />
              <div className="w-[15%] border-[1.5px] border-[#14B5FF] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[40%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[15%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "sixth" ? (
            <>
              <div className="absolute left-[55%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#FA3C3C]" />
              <div className="w-[5%] border-[1.5px] border-[#FA3C3C] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[55%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[5%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "seventh" ? (
            <>
              <div className="absolute left-[60%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#FA3C3C]" />
              <div className="w-[15%] border-[1.5px] border-[#FA3C3C] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[60%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[15%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "eigth" ? (
            <>
              <div className="absolute left-[75%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#14B5FF]" />
              <div className="w-[5%] border-[1.5px] border-[#14B5FF] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[75%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[5%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "nine" ? (
            <>
              <div className="absolute left-[80%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#EFFE37]" />
              <div className="w-[20%] border-[1.5px] border-[#EFFE37] border-dashed animate-blink" />
              <div className="absolute left-[100%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#EFFE37]" />
            </>
          ) : (
            <>
              <div className="absolute left-[80%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[20%] border-[1.5px] border-[#505050]" />
              <div className="absolute left-[100%] translate-x-[-50%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TestProgressbar;
