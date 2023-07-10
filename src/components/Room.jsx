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
    debater === 2 ? ["text-[#505050]", true] : [null, false];
  const [panelStyle, panelBtn] =
    panel === 5 ? ["text-[#505050]", true] : [null, false];
  const [style, disabled] =
    debater + panel === 7
      ? ["text-[#505050]", true]
      : ["text-[#EFFE37]", false];
  //px-[6.87%] pt-[6.87%]

  return (
    <div className="flex flex-col w-[30.3vw] h-full rounded-3xl bg-[#2F3131] text-white">
      <div className="flex flex-col w-full h-[74.1%] p-[6.87%]">
        <div className="h-[18.7%] text-[1.76vh] font-medium">{roomName}</div>
        <div className="flex flex-col text-[1.1vmin] mt-[15.28%]">
          <p className="flex text-[1.51vh] font-bold">
            <span className="text-[#919191] text-[1.34vh]">토론 &nbsp;</span>
            대기 중
          </p>
          <p className="mt-[0.83vh]">
            <span className="text-[#919191] text-[1.34vh]">인원 &nbsp;</span>
            <span className={debaterStyle + " text-[1.51vh] font-bold"}>
              발표자 ({debater}/2)
            </span>
            &nbsp; &nbsp;{" "}
            <span className={panelStyle + " text-[1.51vh] font-bold"}>
              참가자 ({panel}/5)
            </span>
          </p>
        </div>
      </div>

      {/* 입장하기 버튼 */}
      {isClick ? (
        // <div className="flex justify-center w-[12vw] ml-auto mr-[3vw] gap-[1vw] text-[1.1vh]">
        <div className="flex justify-evenly w-full h-[25.9%] border-t border-[#777777] mt-auto">
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
        <div className="w-full h-[25.9%] border-t border-[#777777] mt-auto">
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
