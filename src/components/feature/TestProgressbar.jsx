import React from "react";
import { useEffect, useState } from "react";

function TestProgressbar({ endGameSignalHandler }) {
  const [progress, setProgress] = useState("first");

  useEffect(() => {
    let counter = 0;
    const test = setInterval(() => {
      counter += 1;
      console.log(counter);
      switch (counter) {
        case 3:
          setProgress("second");
          break;
        case 4:
          setProgress("third");
          break;
        case 7:
          setProgress("fourth");
          break;
        case 8:
          setProgress("fifth");
          break;
        case 11:
          setProgress("sixth");
          break;
        case 12:
          setProgress("seventh");
          break;
        case 15:
          setProgress("eigth");
          break;
        case 16:
          setProgress("nine");
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
        <div className="relative flex w-full h-[3px]">
          <div className="absolute left-[15%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          <div className="absolute left-[20%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          <div className="absolute left-[35%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          <div className="absolute left-[40%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          <div className="absolute left-[55%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          <div className="absolute left-[60%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          <div className="absolute left-[75%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          <div className="absolute left-[80%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          <div className="absolute left-[100%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
          {progress === "first" ? (
            <>
              <div className="absolute left-[0%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#14B5FF]" />
              <div className="w-[15%] border-[1.5px] border-[#14B5FF] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[0%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[15%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "second" ? (
            <>
              <div className="absolute left-[15%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#FA3C3C]" />
              <div className="w-[5%] border-[1.5px] border-[#FA3C3C] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[15%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[5%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "third" ? (
            <>
              <div className="absolute left-[20%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#FA3C3C]" />
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
              <div className="absolute left-[35%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#14B5FF]" />
              <div className="w-[5%] border-[1.5px] border-[#14B5FF] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[35%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[5%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "fifth" ? (
            <>
              <div className="absolute left-[40%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#14B5FF]" />
              <div className="w-[15%] border-[1.5px] border-[#14B5FF] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[40%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[15%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "sixth" ? (
            <>
              <div className="absolute left-[55%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#FA3C3C]" />
              <div className="w-[5%] border-[1.5px] border-[#FA3C3C] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[55%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[5%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "seventh" ? (
            <>
              <div className="absolute left-[60%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#FA3C3C]" />
              <div className="w-[15%] border-[1.5px] border-[#FA3C3C] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[60%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[15%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "eigth" ? (
            <>
              <div className="absolute left-[75%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#14B5FF]" />
              <div className="w-[5%] border-[1.5px] border-[#14B5FF] border-dashed animate-blink" />
            </>
          ) : (
            <>
              <div className="absolute left-[75%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[5%] border-[1.5px] border-[#505050]" />
            </>
          )}
          {progress === "nine" ? (
            <>
              <div className="absolute left-[80%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#EFFE37]" />
              <div className="w-[20%] border-[1.5px] border-[#EFFE37] border-dashed animate-blink" />
              <div className="absolute left-[100%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#EFFE37]" />
            </>
          ) : (
            <>
              <div className="absolute left-[80%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
              <div className="w-[20%] border-[1.5px] border-[#505050]" />
              <div className="absolute left-[100%] translate-y-[-35%] w-[10px] h-[10px] rounded-full bg-[#505050]" />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default TestProgressbar;
