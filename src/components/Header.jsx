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
        className="w-[28px] h-[28px] mr-[18.7vw] rounded-full active:outline active:outline-[2px] active:outline-white"
      >
        <icon.Profile className="w-[100%] h-[100%]" />
        {isClick ? (
          <div className="absolute flex flex-col justify-center w-[8vmax] h-[4vh] top-[72px] right-[18.7vw] translate-x-[40%] rounded-[20px] px-[0.5vw] py-[0.2vh] bg-[#F2F2F2] z-[5]">
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
        className="flex mr-[18.7vw] w-fit h-[28px] items-center border border-white text-white py-[1vh] px-[2.17vh] rounded-[0.8vmin] text-[1.5vh]"
      >
        로그인
      </Link>
    );
  return (
    <div className="relative flex justify-between items-center w-full h-[72px] border-b border-[#464747]">
      <div className="flex items-center h-[28px] ml-[18.7vw]">
        <icon.DebatoryLogo className="w-[100%] h-[100%]" />
      </div>
      {userIcon}
    </div>
  );
}

export default Header;
