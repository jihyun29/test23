import React from "react";
import { Link } from "react-router-dom";
import { Debate } from "../icons";
import { Profile } from "../icons";

function Header() {
  const userIcon = localStorage.getItem("authorization") ? (
    <div className="mr-[9.8rem]">
      <Profile />
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
        <div className="w-[5vh] h-[5vh] border">
          <Debate width="5vh" height="5vh" />
        </div>
        <div className="text-[3vh] text-[#ABABAB] font-bold">AHGARI 파이터</div>
      </div>
      {userIcon}
    </div>
  );
}

export default Header;
