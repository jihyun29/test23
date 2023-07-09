import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { encrypt } from "../util/cryptoJs";

// 방 리스트 1개 컴포넌트
function Room({
  number,
  roomName,
  debater,
  panel,
  roomId,
  categoryName,
  categoryCode,
}) {
  const navigate = useNavigate();

  const [isClick, setIsClick] = useState(false);
  // 방 입장 시 방 넘버 넘겨줌
  const goGameRoomHandler = () => {
    setIsClick(true);
  };

  const goGameRoombyTellerHandler = () => {
    const userData = encrypt({
      roomNumber: roomId,
      defaultTitle: roomName,
      categoryName,
      categoryCode,
      isTeller: true,
    });
    console.log(userData);
    sessionStorage.setItem("userData", userData);
    navigate(`/room/${roomId}`);
  };

  const goGameRoombyListenerHandler = () => {
    const userData = encrypt({
      roomNumber: roomId,
      defaultTitle: roomName,
      categoryName,
      categoryCode,
      isTeller: false,
    });
    console.log(userData);
    sessionStorage.setItem("userData", userData);
    navigate(`/room/${roomId}`);
  };

  const closeBtnClick = () => {
    setIsClick(false);
  };

  // 방이 꽉 찰 경우 접속 불가하도록 설정
  const [debaterStyle, debaterBtn] =
    debater === 2 ? ["text-red-600", true] : [null, false];
  const [panelStyle, panelBtn] =
    panel === 5 ? ["text-red-600", true] : [null, false];
  const [style, disabled] =
    debater + panel === 7
      ? ["text-[#C6C6C6]", true]
      : ["text-[#EFFE37]", false];

  return (
    // <div className="flex items-center w-full h-full border border-[#919191] text-[#919191]">
    <div className="flex flex-col w-full h-full px-[2vmin] pt-[2vmin] rounded-3xl bg-[#2F3131] text-white">
      {/* <div className="flex justify-center itmes-center w-[51px] ml-[3vw] text-[1.5vh]">
        {number + 1}
      </div>

      <div className="ml-[7.5vw] w-[45vw] text-[1.5vh] text-[#919191]">
        <p onClick={goGameRoomHandler} className="w-fit hover:cursor-pointer">
          {roomName}
        </p>
      </div>

      <div className="flex justify-between gap-4 text-[1.5vh] text-[#919191]">
        <p className={debaterStyle}>발표자 : {debater}/2</p>
        <p className={panelStyle}>참여자 : {panel}/5</p>
      </div> */}
      <div className="h-[30%] text-[1.5vmin]">{roomName}</div>
      <div className="flex flex-col text-[1.1vmin] mt-[1.2vmin]">
        <p>
          <span className="text-[#919191]">토론 &nbsp;</span>
          {"시작 전"}
        </p>
        <p>
          <span className="text-[#919191]">인원 &nbsp;</span>
          <span className={debaterStyle}>발표자 ({debater}/2)</span>
          &nbsp; &nbsp; <span className={panelStyle}>참가자 ({panel}/5)</span>
        </p>
      </div>
      {/* 입장하기 버튼 */}
      {isClick ? (
        // <div className="flex justify-center w-[12vw] ml-auto mr-[3vw] gap-[1vw] text-[1.1vh]">
        <div className="flex justify-evenly w-full h-[28%] border-t border-[#777777] mt-auto">
          {localStorage.getItem("kakaoId") === "1" && (
            <button
              onClick={goGameRoombyTellerHandler}
              disabled={debaterBtn}
              className="rounded-[0.5vh] p-[0.2vh] text-[#EFFE37] text-[1.3vh] font-semibold"
            >
              발언자로 참여
            </button>
          )}
          <button
            onClick={goGameRoombyListenerHandler}
            disabled={panelBtn}
            className="rounded-[0.5vh] p-[0.2vh] text-[#EFFE37] text-[1.3vh] font-semibold"
          >
            배심원으로 참여
          </button>
          <button
            onClick={closeBtnClick}
            className="rounded-[0.5vh] p-[0.2vh] text-red-200 text-[1.3vh] font-semibold"
          >
            닫기
          </button>
        </div>
      ) : (
        // <div className="ml-[6vw] border">
        <div className="w-full h-[28%] border-t border-[#777777] mt-auto">
          <button
            disabled={disabled}
            onClick={goGameRoomHandler}
            className={
              style +
              " w-full h-full rounded-3xl p-[0.2vh] font-semibold text-[1.5vmin]"
            }
          >
            입장하기
          </button>
        </div>
      )}
      {/* 입장하기 버튼 */}
    </div>
  );
}

export default Room;
