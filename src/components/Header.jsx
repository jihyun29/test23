import React from "react";
import { Link } from "react-router-dom";
import { Debate } from "../icons";

function Header() {
  return (
    <div className="flex justify-between items-center w-full h-[7%] border-b border-[#DEE5ED]">
      <div className="flex items-center ml-[98px] gap-[15px]">
        <div className="w-[38px] h-[38px]">
          <Debate />
        </div>
        <div className="text-[20px] text-[#ABABAB] font-[700] leading-[24px]">
          Title
        </div>
      </div>
      <Link
        to="/SocialKakao"
        className="mr-[98px] bg-[#2F3131] text-white py-[12px] px-[20px] rounded-[50px] text-[16px]"
      >
        로그인
      </Link>
    </div>
  );
}

export default Header;
