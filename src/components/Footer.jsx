import React from "react";

function Footer() {
  return (
    <div className="w-full h-[12vh] mx-auto bg-[#464747]">
      <div className="w-[30vw] h-[8vh] ml-[9vw] mt-[2vh]">
        <div className="flex items-center">
          <div className="w-[2vh] h-[2vh] bg-[#D9D9D9]"></div>
          <p className="ml-[2rem] text-white text-[2vh] font-bold">
            팀 SIMSIMHAE
          </p>
        </div>
        <p className="text-[#F2F2F2] font-light text-[1.4vh]">
          팀 심심해는 사람들에게 재미를 전하는 것들을 만듭니다.
        </p>
        <div className="w-full flex justify-between text-[#919191] text-[1.5vh] mt-[1.2vh]">
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
