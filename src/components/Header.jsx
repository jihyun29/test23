import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../icons";

function Header() {
  const [isClick, setIsClick] = useState(false);
  const navigate = useNavigate();
  const userIconClickHandler = () => {
    setIsClick(!isClick);
    console.log(isClick);
  };
  const logoutClickHandler = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("kakaoId");
    navigate("/");
  };
  const userIcon =
    localStorage.getItem("kakaoId") === "1" ? (
      <div
        onClick={userIconClickHandler}
        className="w-[5vh] h-[5vh] mr-[9vw] rounded-full active:border-[3px]"
      >
        <icon.Profile width="100%" height="100%" />
        {isClick ? (
          <div className="absolute flex flex-col w-[14vw] h-[5vh] top-[7vh] right-[4.5vw] rounded-[1vw] p-[1vh] bg-[#F2F2F2] z-[5]">
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
        className="mr-[9vw] w-fit border border-white text-white py-[0.1vmin] px-[1.5vmin] rounded-[0.8vmin] text-[1.5vmin]"
      >
        로그인
      </Link>
    );
  return (
    <div className="relative flex justify-between items-center w-full h-[5vh] border-b border-[#464747]">
      <div className="flex items-center h-[4.68vh] ml-[9vw]">
        <icon.DebatoryLogo width="100%" height="100%" />
      </div>
      {userIcon}
    </div>
  );
}

export default Header;
