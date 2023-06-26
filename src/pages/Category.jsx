import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Lottie from "lottie-react";
// import lottie from "../lottie";
import icon from "../icons";
import Header from "../components/Header";
import Footer from "../components/Footer";
import instance from "../api/api";

function Category() {
  const navigate = useNavigate();

  // 선택된 카테고리 저장을 위한 State
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 카테고리
  const categoryList = [
    { name: "게임/프로게이머", code: 1 },
    { name: "연예/이슈", code: 2 },
    { name: "스포츠/운동", code: 3 },
    { name: "연애", code: 4 },
    { name: "랜덤", code: 0 },
    { name: "결혼/육아", code: 5 },
    { name: "회사생활", code: 6 },
    { name: "학교생활", code: 7 },
    { name: "밸런스게임", code: 8 },
  ];

  const lottieList = [
    <icon.Game width="100%" height="100%" />,
    <icon.Entertainment width="100%" height="100%" />,
    <icon.Sports width="100%" height="100%" />,
    <icon.Love width="100%" height="100%" />,
    <icon.Random width="100%" height="100%" />,
    <icon.Marriage width="100%" height="100%" />,
    <icon.Company width="100%" height="100%" />,
    <icon.School width="100%" height="100%" />,
    <icon.BalanceGame width="100%" height="100%" />,
  ];

  // 가장 많이 선택된 카테고리
  const example = "게임/프로게이머";

  // 입장하기 버튼 클릭 시 실행되는 함수
  // 1. 방 리스트 페이지로 이동
  // 2. 카테고리 선택 안될 시 알람 발생
  // 3. 랜덤 선택 시 임의의 주제 넘겨줌
  const enterRoomList = async () => {
    if (selectedCategory === null) {
      return alert("카테고리를 선택해주세요.");
    } else if (selectedCategory === "랜덤") {
      const randomNumber = Math.round(Math.random() * 7);
      const randomSubject = categoryList.filter((item) => item.name !== "랜덤")[
        randomNumber
      ].name;
      const data = await instance.put("/api/user", {
        Authorization: localStorage.getItem("authorization"),
      });
      console.log(data);
      return navigate("/roomlist", {
        state: [randomSubject, randomNumber + 1],
      });
    } else {
      const selectedCategoryCode = categoryList.filter(
        (category) => category.name === selectedCategory
      )[0].code;
      const data = await instance.put("/api/user", {
        Authorization: localStorage.getItem("authorization"),
      });
      console.log(data);
      navigate("/roomlist", {
        state: [selectedCategory, selectedCategoryCode],
      });
    }
  };

  // 메인으로 클릭 시 실행되는 함수
  const goHomeHandler = () => {
    navigate(`/`);
  };

  // 카테고리 클릭 시 실행되는 함수
  // 선택된 카테고리 state에 저장
  const categoryBtnClickHandler = (categoryName) => {
    console.log(categoryName);
    setSelectedCategory(categoryName);
  };

  return (
    <>
      <Header />
      <div className="flex w-full h-[80vh]">
        {/* Left Side bar */}
        <div className="w-[30vw] h-full overflow-hidden">
          <button
            onClick={goHomeHandler}
            className="text-[#C6C6C6] text-[1.8vmin] font-bold mt-[5vmin] ml-[10%]"
          >
            ← 메인으로
          </button>
          <div className="flex flex-col justify-between w-[23vmin] h-[16vmin] ml-[5vmin] px-[2.5vmin] mt-[25%] bg-[#464747] rounded-[24px]">
            <div className="mt-[2.6vmin] text-[#C6C6C6] text-[1.8vmin] font-sans">
              <p>지금 가장 많은 사람들이 선택한 토론방은?</p>
              {/* <p>선택한 토론방은?</p> */}
              <span className="bg-black text-white w-fit px-[0.3vmin] rounded-[8px] mt-[5px] mr-[0px]">
                {example}
              </span>
            </div>
            <button className="text-[#EFFE37] text-[2vmin] font-bold ml-auto mb-[1.5vmin]">
              바로 선택하기 ➤
            </button>
          </div>
        </div>
        {/* Left Side bar */}

        {/* Center */}
        <div className="w-[70vw] h-full">
          <div className="w-[60vmin] h-full flex flex-col items-center justify-between">
            <p className="font-semibold text-[3vmin] text-[#C6C6C6] mt-[8vmin]">
              입장하고픈 토론방의 분야를 선택해주세요
            </p>

            {/* 카테고리 카드들 표시되는 부분 */}
            <div className="grid grid-cols-3 gird-rows-3 w-[45vmin] h-[45vmin] gap-3">
              {categoryList.map((category, index) => {
                return (
                  <CategoryCard
                    key={category.name}
                    categoryName={category.name}
                    selectedCategory={selectedCategory}
                    icon={lottieList[index]}
                    onClickHandler={categoryBtnClickHandler}
                  />
                );
              })}
            </div>
            {/* 카테고리 카드들 표시되는 부분 */}

            <div className="flex justify-center w-full mb-[8vmin]">
              <button
                // disabled
                onClick={enterRoomList}
                className="bg-[#EFFE37] px-[12vmin] py-[2vmin] rounded-[60px] text-[2.5vmin] font-bold"
              >
                입장하기
              </button>
            </div>
          </div>
        </div>
        {/* Center */}
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
  categoryName,
  icon = null,
  onClickHandler,
}) => {
  // 카테고리 선택 시 디자인 변경을 위한 변수들

  const bgStyle =
    selectedCategory === categoryName
      ? "flex flex-col items-center rounded-[24px] border border-[#EFFE37] bg-[#464747] cursor-pointer"
      : "flex flex-col items-center rounded-[24px] bg-[#464747] cursor-pointer";
  const ftStyle =
    selectedCategory === categoryName
      ? "mt-[8%] text-[1.5vmin] font-bold text-[#EFFE37]"
      : "mt-[8%] text-[1.5vmin] font-bold text-[#C6C6C6]";

  return (
    <div
      onClick={() => {
        onClickHandler(categoryName);
      }}
      className={bgStyle}
    >
      <div className="w-[55%] h-[55%] mt-[12%] overflow-hidden">
        {icon}
        {/* <Lottie animationData={icon} className="w-full h-full" /> */}
      </div>
      <p className={ftStyle}>{categoryName}</p>
    </div>
  );
};
