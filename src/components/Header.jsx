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
        className="w-[3.5vmin] h-[3.5vmin] mr-[9vw] rounded-full active:outline active:outline-[2px] active:outline-white"
      >
        <icon.Profile width="100%" height="100%" />
        {isClick ? (
          <div className="absolute flex flex-col w-[8vmax] h-[5vh] top-[5vh] right-[9vw] rounded-[20px] px-[1vmax] py-[1vh] bg-[#F2F2F2] z-[5]">
            <div
              onClick={logoutClickHandler}
              className="flex bg-white h-[3vh] rounded-[20px] text-[1.5vh] justify-center items-center hover:bg-blue-100"
            >
              Logout
            </div>
          </div>
        ) : null}
      </div>
    ) : (
      <Link
        to="/SocialKakao"
        className="mr-[9vw] w-fit h-[3vh] border border-white text-white py-[0.275vh] px-[1.5vw] rounded-[0.8vmin] text-[1.5vh]"
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
