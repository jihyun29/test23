import React from "react";
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

  // 방이 꽉 찰 경우 접속 불가하도록 설정
  const [debaterStyle, debaterBtn] =
    debater === 2 ? ["text-[#505050]", true] : [null, false];
  const [panelStyle, panelBtn] =
    panel === 5 ? ["text-[#505050]", true] : [null, false];

  const [tellerBtnStyle, isTeller] =
    localStorage.getItem("kakaoId") === "1"
      ? ["text-[#EFFE37] hover:hover:bg-[#EFFE37] hover:text-[#1B1B1B]", true]
      : ["text-[#505050]", false];

  return (
    <div className="flex flex-col w-[30.3vw] h-full rounded-3xl bg-[#2F3131] text-white">
      <div className="flex flex-col w-full h-[73.25%] px-[6.87%] pt-[6.87%] pb-[6.01%]">
        <div className="w-full h-[53px] text-[21px] font-medium">
          {roomName}
        </div>
        <div className="flex flex-col mt-[48px]">
          <p className="flex items-center text-[18px] font-bold">
            <span className="text-[#919191] text-[16px]">토론 &nbsp;</span>
            대기 중
          </p>

          <p className="flex items-center mt-[1.72%]">
            <span className="text-[#919191] text-[16px]">인원 &nbsp;</span>
            <span className={debaterStyle + " text-[18px] font-bold"}>
              발표자 ({debater}/2)
            </span>
            &nbsp; &nbsp;{" "}
            <span className={panelStyle + " text-[18px] font-bold"}>
              참가자 ({panel}/5)
            </span>
          </p>
        </div>
      </div>

      {/* 입장하기 버튼 */}
      <div className="flex justify-evenly w-full h-[26.75%] border-t border-[#777777] mt-auto">
        <button
          onClick={goGameRoombyTellerHandler}
          disabled={debaterBtn || !isTeller}
          className={
            tellerBtnStyle +
            " w-full rounded-bl-3xl p-[0.2vh] text-[18px] font-semibold"
          }
        >
          발언자로 참여
        </button>
        <button
          onClick={goGameRoombyListenerHandler}
          disabled={panelBtn}
          className="w-full rounded-br-3xl p-[0.2vh] text-[#EFFE37] text-[18px] font-semibold hover:bg-[#EFFE37] hover:text-[#1B1B1B]"
        >
          배심원으로 참여
        </button>
      </div>
      {/* 입장하기 버튼 */}
    </div>
  );
}

export default Room;
