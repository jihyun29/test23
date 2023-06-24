import React from "react";
import { useNavigate } from "react-router-dom";

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
  // 방 입장 시 방 넘버 넘겨줌
  const btnClickHandler = () => {
    navigate(`/room/${roomId}`, {
      state: [roomId, roomName, categoryName, categoryCode],
    });
  };

  // 방이 꽉 찰 경우 접속 불가하도록 설정
  const debaterStyle = debater === 2 ? "text-red-600" : null;
  const panelStyle = panel === 8 ? "text-red-600" : null;
  const [style, disabled] =
    debater + panel === 10
      ? ["font-semibold text-[#C6C6C6] text-[1.5vh]", true]
      : ["font-semibold text-[#35C585] text-[1.5vh]", false];

  return (
    <div className="flex items-center w-full h-[10%] border-b">
      {/* 방 넘버 */}
      <div className="flex justify-center itmes-center w-[51px] ml-[3vw] text-[1.5vh]">
        {number + 1}
      </div>
      {/* 방 넘버 */}

      {/* 방제목 */}
      <div className="ml-[7.5vw] w-[50vw] text-[1.5vh]">
        <p onClick={btnClickHandler} className="w-fit hover:cursor-pointer">
          {roomName}
        </p>
      </div>
      {/* 방제목 */}

      {/* 인원 */}
      <div className="flex justify-between gap-4 text-[1.5vh]">
        <p className={debaterStyle}>발표자 : {debater}/2</p>
        <p className={panelStyle}>참여자 : {panel}/8</p>
      </div>
      {/* 인원 */}

      {/* 입장하기 버튼 */}
      <div className="ml-[4vw]">
        <button disabled={disabled} onClick={btnClickHandler} className={style}>
          입장하기
        </button>
      </div>
      {/* 입장하기 버튼 */}
    </div>
  );
}

export default Room;
