import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

function Home() {
  const navigate = useNavigate();
  const moveToCategoryPage = () => {
    navigate("/category");
  };

  return (
    <>
      <Header />
      <div className="flex flex-col w-full h-[80%] justify-between">
        <div className="flex flex-col items-center w-full h-[288px] mt-[129px]">
          <p className="text-[48px] text-[#1B1B1B] font-[900]">
            말 많고 입이 멈추질 않는 프로펠러 돌아가는 소리가 들리는 사람에게
          </p>
          <p
            style={{ textShadow: "2px 2px black" }}
            className="text-[48px] text-white font-[900]"
          >
            할 거 없는데 잠 자기 보단 말하는 걸 선택하고픈 그런 날인 당신에게
          </p>
          <p className="text-[48px] text-[#1B1B1B] font-[900]">
            토론을 좋아하고 자신의 주장을 내세워 이야기하길 좋아하는 여러분께
          </p>
          <p
            style={{ textShadow: "2px 2px black" }}
            className="text-[48px] text-white font-[900]"
          >
            말하는 건 몰라도 말 잘하는 이에게 따봉을 들어주고픈 그런 분들에게
          </p>
        </div>
        <div className="flex justify-center mb-[123px]">
          <button
            onClick={moveToCategoryPage}
            className="py-[40px] px-[179px] bg-black text-white font-[700] text-[27px] rounded-[60px]"
          >
            게임시작
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
