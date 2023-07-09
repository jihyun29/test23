import React from "react";
import icon from "../icons";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="flex items-center w-full h-[21vh] bg-[#2F3131]">
      <div className="w-fit flex flex-col justify-center h-fit ml-[9vw] ">
        <icon.teamlogo className="w-fit h-[3.5vmin]" />
        <p className="text-[#C6C6C6] font-regular whitespace-nowrap text-[1.8vmin] mt-[1vmin]">
          심심함, 그 속에서 가치있는 원석을 찾아내 사람들의 공감을 얻을 수 있게
          다듬고 빛냅니다.
        </p>
        <div className="flex w-[50%] justify-between items-center text-[#C6C6C6] text-[1.6vmin] font-bold mt-[2vmin]">
          <a
            href="https://github.com/4simsimhae"
            target="_blank"
            rel="noreferrer"
          >
            <icon.githublogo className="w-[2.5vmin] h-[2.5vmin]" />
          </a>
          <Link to="/tos">
            <p>이용약관</p>
          </Link>
          <p>Contact Us</p>
        </div>
        <div>
          <p className="text-[#777777] text-[1.5vmin] font-light  mt-[1vmin]">
            ©2023. TEAM SIMSIMHAE. All Rights reserved,
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
