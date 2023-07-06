import React from "react";
import icon from "../icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="w-full h-[20vh] flex items-center bg-[#464747]">
      <div className="w-[50vmin] h-fit ml-[35vw] ">
        <div className="flex items-center">
          <icon.teamlogo />
        </div>
        <p className="text-[#C6C6C6] font-regular whitespace-nowrap text-[1.4vmin] mt-[1.2vh]">
          심심함, 그 속에서 가치있는 원석을 찾아내 사람들의 공감을 얻을 수 있게
          다듬고 빛냅니다.
        </p>
        <div className="w-[50%] flex justify-between text-[#C6C6C6] text-[1.5vmin] mt-[1.2vh]">
          <a href="https://github.com/4simsimhae">
            <icon.githublogo className="w-[24px] h-[24px]" />
          </a>
          <Link to="/tos">
            <p className="text-[#C6C6C6] font-bold">이용약관</p>
          </Link>
          <p className="text-[#C6C6C6] font-bold ">Contact Us</p>
        </div>
        <div>
          <p className="text-[#777777] font-light text-[1.4vmin]">
            ©2023. TEAM SIMSIMHAE. All Rights reserved,
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
