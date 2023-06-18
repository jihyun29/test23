import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

function RoomList() {
  const navigate = useNavigate();
  const { state } = useLocation();
  console.log(state);
  const titleList = [
    "연애 중 초능력을 가지면 좋곘는가?",
    "연애 시 비밀번호를 공유해야 하는가?",
    "연애 중 굿모닝 콜을 받아야 하는가?",
    "연애 중에 솔직한 연애 고백을 해야 하는가?",
    "연애 중 키 차이는 중요한가?",
    "연애 중 신체적 유사성을 필요한가?",
    "연애 중에 썸타는 상대방에게 선물을 주어야 하는가?",
    "연애 중에도 개인 시간을 가져야 하는가?",
  ];
  const [roomList, setRoomList] = useState([
    {
      title: "연애 중 초능력을 가지면 좋곘는가?",
      talker: 1,
      listener: 4,
      roomNumber: "가",
    },
    {
      title: "연애 시 비밀번호를 공유해야 하는가?",
      talker: 2,
      listener: 5,
      roomNumber: "나",
    },
    {
      title: "연애 중 굿모닝 콜을 받아야 하는가?",
      talker: 1,
      listener: 3,
      roomNumber: "다",
    },
    {
      title: "연애 중에 솔직한 연애 고백을 해야 하는가?",
      talker: 1,
      listener: 2,
      roomNumber: "라",
    },
    {
      title: "연애 중 키 차이는 중요한가?",
      talker: 2,
      listener: 8,
      roomNumber: "마",
    },
    {
      title: "연애 중 신체적 유사성을 필요한가?",
      talker: 2,
      listener: 5,
      roomNumber: "바",
    },
    {
      title: "연애 중에 썸타는 상대방에게 선물을 주어야 하는가?",
      talker: 1,
      listener: 7,
      roomNumber: "사",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "아",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "아",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "아",
    },
  ]);

  const goCategoryBtnClick = () => {
    navigate("/category");
  };

  const createRoomBtnClick = () => {
    const randomTitle = Math.round(Math.random() * 7);
    const randomTalker = Math.round(Math.random() * 2);
    const randomListener = Math.round(Math.random() * 8);
    const title = titleList[randomTitle];
    console.log(randomTitle);
    console.log(title);
    setRoomList([
      ...roomList,
      {
        title: title,
        talker: `${randomTalker}`,
        listener: `${randomListener}`,
        roomNumber: `${roomList.length + 1}`,
      },
    ]);
    navigate("/room", { state: roomList.length + 1 });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col w-full h-full">
        <div>
          <button
            onClick={goCategoryBtnClick}
            className="ml-[108px] py-[20px] text-[24px] font-bold text-[#777777]"
          >
            ← 카테고리 선택
          </button>
        </div>
        <div className="relative flex flex-col w-full h-[240px] bg-[#464747] gap-4">
          <div className="absolute right-[127px] top-[100px] ">
            <div className="w-fit text-[24px] text-white font-medium ml-auto">
              {state}
            </div>
            <div className="text-[#ABABAB] w-fit  ml-auto mt-[20px]">
              연애할 때 나만 이럴까?
            </div>
            <div className="text-[#ABABAB] w-fit ml-auto">
              다양한 토론 주제에 대해 이야기해요
            </div>
          </div>
          <div className="flex flex-col mr-auto gap-3"></div>
        </div>
        <div className="flex flex-col justify-betweenw-full h-[140px] px-[80px]">
          <div className="w-fit ml-auto">
            <button
              onClick={createRoomBtnClick}
              className="bg-[#777777] text-[22px] text-[#E2E2E2] px-[39px] py-[14.5px] rounded-[8px] mt-[16px]"
            >
              {" "}
              방 생성하기
            </button>
          </div>
          <div className="flex items-center w-full h-[60px] mt-auto border-b-2 border-[#777777]">
            <div className="flex justify-center ml-[37px] w-[51px]">Num</div>
            <p className="ml-[97px] w-[695px]">방제목</p>
            <p className="ml-[70px]">인원</p>
          </div>
        </div>
        <div className="flex flex-col w-full h-[700px] px-[80px] overflow-hidden">
          {roomList.map((item, index) => (
            <ListOne
              key={item.roomNumber}
              number={index}
              title={item.title}
              talker={item.talker}
              listener={item.listener}
              roomNumber={item.roomNumber}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default RoomList;

function ListOne({ number, title, talker, listener, roomNumber }) {
  const navigate = useNavigate();
  const btnClickHandler = () => {
    // socket.emit("enter_room", roomNumber);
    navigate("/room", { state: roomNumber });
  };
  const talkerStyle = talker === 2 ? "text-red-600" : null;
  const listenerStyle = listener === 8 ? "text-red-600" : null;
  const [style, disabled] =
    talker + listener === 10
      ? ["font-semibold text-[#C6C6C6]", true]
      : ["font-semibold text-[#35C585]", false];
  return (
    <div className="flex items-center w-full h-[70px] border-b">
      <div className="flex justify-center w-[51px] ml-[37px]">{number + 1}</div>
      <div className="ml-[97px] w-[695px]">{title}</div>
      <div className="flex justify-between gap-4">
        <p className={talkerStyle}>발표자 : {talker}/2</p>
        <p className={listenerStyle}>참여자 : {listener}/8</p>
      </div>
      <div className="ml-auto px-[57px]">
        <button disabled={disabled} onClick={btnClickHandler} className={style}>
          입장하기
        </button>
      </div>
    </div>
  );
}
