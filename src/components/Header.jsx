import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Profile } from "../icons";
import lottie from "../lottie";
import Lottie from "lottie-react";

function Header() {
  const [isClick, setIsClick] = useState(false);
  const navigate = useNavigate();
  const userIconClickHandler = () => {
    setIsClick(!isClick);
    console.log(isClick);
  };
  const logoutClickHandler = () => {
    localStorage.removeItem("authorization");
    navigate("/");
  };
  const userIcon = localStorage.getItem("authorization") ? (
    <div
      onClick={userIconClickHandler}
      className="w-[5vh] h-[5vh] mr-[9vw] border rounded-full active:border-[3px]"
    >
      <Profile width="100%" height="100%" />
      {isClick ? (
        <div className="absolute flex flex-col w-[14vw] h-[5vh] top-[7vh] right-[4.5vw] rounded-[1vw] p-[1vh] bg-[#F2F2F2] z-[2]">
          <div
            onClick={logoutClickHandler}
            className="flex bg-white h-[3vh] rounded-[1vw] text-[1.5vh] justify-center items-center hover:bg-blue-100"
          >
            로그아웃
          </div>
        </div>
      ) : null}
    </div>
  ) : (
    <Link
      to="/SocialKakao"
      className="mr-[9vw] bg-[#2F3131] text-white py-[1vh] px-[1.5vw] rounded-[5rem] text-[2vh]"
    >
      로그인
    </Link>
  );
  return (
    <div className="relative flex justify-between items-center w-full h-[8vh] border-b border-[#DEE5ED]">
      <div className="flex items-center ml-[9vw] gap-[1.5rem]">
        <div className="w-[5vh] h-[5vh] border rounded-[100%]">
          <Lottie animationData={lottie.title} className="w-full h-full" />
        </div>
        <div className="text-[3vh] text-[#ABABAB] font-bold">AHGARI 파이터</div>
      </div>
      {userIcon}
    </div>
  );
}

export default Header;
