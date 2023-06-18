import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as icons from "../icons";
import Header from "../components/Header";

function Category() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const id = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const categoryList = [
    "프로게이머",
    "연예/이슈",
    "스포츠/운동",
    "병맛",
    "연애/결혼/육아",
    "교양",
    "회사생활",
    "음식/요리/맛집",
    "세상에 이런 일이",
  ];
  const iconList = [
    <icons.Game />,
    <icons.Idol />,
    <icons.Sports />,
    <icons.Strange />,
    <icons.Couple />,
    <icons.Learning />,
    <icons.Work />,
    <icons.Food />,
    <icons.Surprise />,
  ];
  const example = "회사생활";
  const navigate = useNavigate();
  const enterRoomList = () => {
    if (selectedCategory === null) {
      return alert("카테고리를 선택해주세요.");
    }
    navigate("/roomlist", { state: selectedCategory });
  };
  const goHomeHandler = () => {
    navigate(`/`);
  };
  const categoryBtnClickHandler = (category) => {
    setSelectedCategory(category);
    console.log(selectedCategory);
  };
  return (
    <>
      <Header />
      <div className="flex w-full h-[80%]">
        <div className="w-[25%] h-full overflow-hidden">
          <button
            onClick={goHomeHandler}
            className="text-[#777777] text-[18px] font-bold mt-[10%] ml-[108px]"
          >
            ← 메인으로
          </button>
          <div className="flex flex-col justify-between w-[320px] h-[160px] ml-[40px] px-[20px] border mt-[30%] bg-[#F1F1F1] rounded-[24px]">
            <p className="mt-[26px] text-[#777777] text-[23px]">
              지금 가장 많은 사람들이 선택한 토론방은{" "}
              <span className="bg-black text-white w-fit px-[8px] rounded-[8px] mt-[5px] mr-[0px]">
                {example}
              </span>{" "}
              ?
            </p>
            <button className="text-[#35C585] text-[16px] font-bold ml-[151px] mb-[18px]">
              바로 선택하기 <span className="text-[20px]">➤</span>
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-evenly items-center w-[50%] h-full">
          <p className="font-semibold text-[32px] text-[#2F3131] font-mono">
            입장하고픈 토론방의 분야를 선택해주세요
          </p>
          <div className="grid grid-cols-3 w-[664px] h-[664px] gap-3">
            {categoryList.map((category, index) => {
              return (
                <CategoryCard
                  key={id[index]}
                  category={category}
                  selectedCategory={selectedCategory}
                  icon={iconList[index]}
                  onClickHandler={categoryBtnClickHandler}
                />
              );
            })}
          </div>
          <div className="flex justify-center items-center w-full">
            <button
              // disabled
              onClick={enterRoomList}
              className="bg-black text-white px-[173px] py-[40px] rounded-[60px] text-[24px] font-bold"
            >
              입장하기
            </button>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
}

export default Category;

//components로 빼야될 것
const CategoryCard = ({
  selectedCategory,
  category,
  icon = null,
  onClickHandler,
}) => {
  const bgStyle =
    selectedCategory === category
      ? "flex flex-col items-center border rounded-[24px] bg-[#2F3131]"
      : "flex flex-col items-center border rounded-[24px] bg-[#F1F1F1]";
  const ftStyle =
    selectedCategory === category
      ? "mt-[13.3px] text-[18px] font-bold text-[#33F39E]"
      : "mt-[13.3px] text-[18px] font-bold text-[#777777]";
  return (
    <div
      onClick={() => {
        console.log(category);
        onClickHandler(category);
      }}
      className={bgStyle}
    >
      <div className="w-[80px] h-[80px] mt-[41.6px] rounded-[20px]">{icon}</div>

      <p className={ftStyle}>{category}</p>
    </div>
  );
};
