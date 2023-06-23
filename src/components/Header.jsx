import React from "react";
import { Link } from "react-router-dom";
// import { Debate } from "../icons";
import { Profile } from "../icons";
import lottie from "../lottie";
import Lottie from "lottie-react";

function Header() {
  const userIcon = localStorage.getItem("authorization") ? (
    <div className="w-[5vh] h-[5vh] mr-[9vw]">
      <Profile width="100%" height="100%" />
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
    <div className="flex justify-between items-center w-full h-[8vh] border-b border-[#DEE5ED]">
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
