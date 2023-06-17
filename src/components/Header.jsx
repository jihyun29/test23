import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="flex justify-between items-center w-full h-[72px] border-b border-[#DEE5ED]">
      <div className="flex items-center ml-[98px] gap-[9px]">
        <div className="text-[38px]">🍔</div>
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
