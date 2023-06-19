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
        <div className="relative mt-[129px] flex flex-col items-center w-full h-[288px] whitespace-nowrap overflow-hidden">
          <div className="absoulte flex text-[48px] text-[#1B1B1B] font-[900] animate-flowText">
            <div>말 많고 입이 멈추질 않는 프로펠러 돌아가는 소리가 들리는</div>
            &nbsp;
            <div>말 많고 입이 멈추질 않는 프로펠러 돌아가는 소리가 들리는</div>
            &nbsp;
            <div>말 많고 입이 멈추질 않는 프로펠러 돌아가는 소리가 들리는</div>
            &nbsp;
            <div>말 많고 입이 멈추질 않는 프로펠러 돌아가는 소리가 들리는</div>
          </div>
          <div
            style={{ textShadow: "2px 2px black" }}
            className="absolute flex top-[25%] text-[48px] text-white font-[900] animate-flowText"
          >
            <div>
              할 거 없는데 잠 자기 보단 말하는 걸 선택하고픈 그런 날인 당신에게
            </div>
            &nbsp;
            <div>
              할 거 없는데 잠 자기 보단 말하는 걸 선택하고픈 그런 날인 당신에게
            </div>
            &nbsp;
            <div>
              할 거 없는데 잠 자기 보단 말하는 걸 선택하고픈 그런 날인 당신에게
            </div>
            &nbsp;
            <div>
              할 거 없는데 잠 자기 보단 말하는 걸 선택하고픈 그런 날인 당신에게
            </div>
          </div>
          <div className="absolute top-[50%] flex text-[48px] text-[#1B1B1B] font-[900] animate-flowText">
            <div>토론을 좋아하고 자신의 주장을 내세워 이야기하길 좋아하는</div>
            &nbsp;
            <div>토론을 좋아하고 자신의 주장을 내세워 이야기하길 좋아하는</div>
            &nbsp;
            <div>토론을 좋아하고 자신의 주장을 내세워 이야기하길 좋아하는</div>
            &nbsp;
            <div>토론을 좋아하고 자신의 주장을 내세워 이야기하길 좋아하는</div>
          </div>
          <div
            style={{ textShadow: "2px 2px black" }}
            className="absolute flex top-[75%] text-[48px] text-white font-[900] animate-flowText"
          >
            <div>
              말하는 건 몰라도 말 잘하는 이에게 따봉을 들어주고픈 그런
              분들에게도
            </div>
            &nbsp;
            <div>
              말하는 건 몰라도 말 잘하는 이에게 따봉을 들어주고픈 그런
              분들에게도
            </div>
            &nbsp;
            <div>
              말하는 건 몰라도 말 잘하는 이에게 따봉을 들어주고픈 그런
              분들에게도
            </div>
            &nbsp;
            <div>
              말하는 건 몰라도 말 잘하는 이에게 따봉을 들어주고픈 그런
              분들에게도
            </div>
          </div>
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
