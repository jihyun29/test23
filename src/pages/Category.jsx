import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as icons from "../icons";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Category() {
  const navigate = useNavigate();

  // 선택된 카테고리 저장을 위한 State
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 카테고리
  const categoryList = [
    "게임/프로게이머",
    "연예/이슈",
    "스포츠/운동",
    "연애",
    "랜덤",
    "결혼/육아",
    "회사생활",
    "학교생활",
    "밸런스게임",
  ];

  // 카테고리 별 아이콘
  const iconList = [
    <icons.Game width="100%" height="100%" />,
    <icons.Idol width="100%" height="100%" />,
    <icons.Health width="100%" height="100%" />,
    <icons.Love width="100%" height="100%" />,
    <icons.Random width="100%" height="100%" />,
    <icons.Marriage width="100%" height="100%" />,
    <icons.Business width="100%" height="100%" />,
    <icons.School width="100%" height="100%" />,
    <icons.Balance width="100%" height="100%" />,
  ];

  // 가장 많이 선택된 카테고리
  const example = "게임/프로게이머";

  // 입장하기 버튼 클릭 시 실행되는 함수
  // 1. 방 리스트 페이지로 이동
  // 2. 카테고리 선택 안될 시 알람 발생
  // 3. 랜덤 선택 시 임의의 주제 넘겨줌
  const enterRoomList = () => {
    if (selectedCategory === null) {
      return alert("카테고리를 선택해주세요.");
    } else if (selectedCategory === "랜덤") {
      const randomNumber = Math.round(Math.random() * 7);
      const randomSubject = categoryList.filter((item) => item !== "랜덤")[
        randomNumber
      ];
      return navigate("/roomlist", { state: randomSubject });
    }
    navigate("/roomlist", { state: selectedCategory });
  };

  // 메인으로 클릭 시 실행되는 함수
  const goHomeHandler = () => {
    navigate(`/`);
  };

  // 카테고리 클릭 시 실행되는 함수
  // 선택된 카테고리 state에 저장
  const categoryBtnClickHandler = (category) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <Header />
      <div className="flex w-full h-[80vh]">
        {/* Left Side bar */}
        <div className="w-[25vw] h-full overflow-hidden">
          <button
            onClick={goHomeHandler}
            className="text-[#777777] text-[2.5vh] font-bold mt-[10%] ml-[10%]"
          >
            ← 메인으로
          </button>
          <div className="flex flex-col justify-between w-[26vh] h-[20%] ml-[10%] px-[2.5vh] border mt-[25%] bg-[#F1F1F1] rounded-[24px]">
            <div className="mt-[26px] text-[#777777] text-[1.8vh] font-sans">
              <p>지금 가장 많은 사람들이</p>
              <p>선택한 토론방은?</p>
              <span className="bg-black text-white w-fit px-[0.3vw] rounded-[8px] mt-[5px] mr-[0px]">
                {example}
              </span>
            </div>
            <button className="text-[#35C585] text-[2vh] font-bold ml-auto mb-[1.5vh]">
              바로 선택하기 ➤
            </button>
          </div>
        </div>
        {/* Left Side bar */}

        {/* Center */}
        <div className="flex flex-col justify-evenly items-center w-[50vw] h-full">
          <p className="font-semibold text-[3vh] text-[#2F3131] font-sans">
            입장하고픈 토론방의 분야를 선택해주세요
          </p>

          {/* 카테고리 카드들 표시되는 부분 */}
          <div className="grid grid-cols-3 w-[45vh] h-[45vh] gap-3">
            {categoryList.map((category, index) => {
              return (
                <CategoryCard
                  key={category}
                  category={category}
                  selectedCategory={selectedCategory}
                  icon={iconList[index]}
                  onClickHandler={categoryBtnClickHandler}
                />
              );
            })}
          </div>
          {/* 카테고리 카드들 표시되는 부분 */}

          <div className="flex justify-center items-center w-full">
            <button
              // disabled
              onClick={enterRoomList}
              className="bg-black text-white px-[20vh] py-[4vh] rounded-[60px] text-[2.5vh] font-bold"
            >
              입장하기
            </button>
          </div>
        </div>
        {/* Center */}

        {/* Right Side bar */}
        <div></div>
        {/* Right Side bar */}
      </div>
      <Footer />
    </>
  );
}

export default Category;

// 카테고리 카드 Component
// 카테고리 페이지에서만 사용됨
const CategoryCard = ({
  selectedCategory,
  category,
  icon = null,
  onClickHandler,
}) => {
  // 카테고리 선택 시 디자인 변경을 위한 변수들

  const bgStyle =
    selectedCategory === category
      ? "flex flex-col items-center border rounded-[24px] bg-[#2F3131]"
      : "flex flex-col items-center border rounded-[24px] bg-[#F1F1F1]";
  const ftStyle =
    selectedCategory === category
      ? "mt-[5%] text-[1.5vh] font-bold text-[#33F39E]"
      : "mt-[5%] text-[1.5vh] font-bold text-[#777777]";

  return (
    <div
      onClick={() => {
        onClickHandler(category);
      }}
      className={bgStyle}
    >
      <div className="w-[40%] h-[40%] mt-[25%] rounded-[100%] bg-black">
        {icon}
      </div>
      <p className={ftStyle}>{category}</p>
    </div>
  );
};
