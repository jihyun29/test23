import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

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
    navigate(`/room/${roomId}`, {
      state: [roomId, roomName, categoryName, categoryCode, true],
    });
  };

  const goGameRoombyListenerHandler = () => {
    navigate(`/room/${roomId}`, {
      state: [roomId, roomName, categoryName, categoryCode, false],
    });
  };

  const closeBtnClick = () => {
    setIsClick(false);
  };

  // 방이 꽉 찰 경우 접속 불가하도록 설정
  const [debaterStyle, debaterBtn] =
    debater === 2 ? ["text-red-600", true] : [null, false];
  const [panelStyle, panelBtn] =
    panel === 8 ? ["text-red-600", true] : [null, false];
  const [style, disabled] =
    debater + panel === 10
      ? ["font-semibold text-[#C6C6C6] text-[1.5vh]", true]
      : ["font-semibold text-[#EFFE37] text-[1.5vh]", false];

  return (
    <div className="flex items-center w-full h-[10%] border-b border-[#919191] text-[#919191]">
      {/* 방 넘버 */}
      <div className="flex justify-center itmes-center w-[51px] ml-[3vw] text-[1.5vh]">
        {number + 1}
      </div>
      {/* 방 넘버 */}

      {/* 방제목 */}
      <div className="ml-[7.5vw] w-[45vw] text-[1.5vh] text-[#919191]">
        <p onClick={goGameRoomHandler} className="w-fit hover:cursor-pointer">
          {roomName}
        </p>
      </div>
      {/* 방제목 */}

      {/* 인원 */}
      <div className="flex justify-between gap-4 text-[1.5vh] text-[#919191]">
        <p className={debaterStyle}>발표자 : {debater}/2</p>
        <p className={panelStyle}>참여자 : {panel}/8</p>
      </div>
      {/* 인원 */}

      {/* 입장하기 버튼 */}
      {isClick ? (
        <div className="flex ml-[2vw] gap-[1vw] text-[1.1vh]">
          <button
            onClick={goGameRoombyTellerHandler}
            disabled={debaterBtn}
            className=" rounded-[0.5vh] p-[0.2vh] text-[#EFFE37] text-[1.5vh] font-semibold"
          >
            발언자
          </button>
          <button
            onClick={goGameRoombyListenerHandler}
            disabled={panelBtn}
            className="rounded-[0.5vh] p-[0.2vh] text-[#EFFE37] text-[1.5vh] font-semibold"
          >
            배심원
          </button>
          <button
            onClick={closeBtnClick}
            className="rounded-[0.5vh] p-[0.2vh] text-red-200 text-[1.5vh] font-semibold"
          >
            닫기
          </button>
        </div>
      ) : (
        <div className="ml-[6vw]">
          <button
            disabled={disabled}
            onClick={goGameRoomHandler}
            className={style}
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
