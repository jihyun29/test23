import React from "react";

function Footer() {
  return (
    <div className="w-[1440px] h-[13%] mx-auto border bg-[#464747]">
      <div className="flex flex-col ml-[180px]">
        <div className="flex items-center">
          <div className="w-[32px] h-[32px] bg-[#D9D9D9]"></div>
          <p className="ml-[20px] text-white text-[22px]font-bold">
            팀 SIMSIMHAE
          </p>
        </div>
        <p className="text-[#919191] font-light text-[19px]">
          팀 심심해는 사람들에게 재미를 전하는 것들을 만듭니다.
        </p>
        <div className="w-[545px] flex justify-between text-[#919191] text-[18px]">
          <p>이용약관</p>
          <p>운영정책</p>
          <p>개인정보처리방침</p>
          <p>Contact Us</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
