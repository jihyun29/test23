import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RoomList() {
  const navigate = useNavigate();
  const { state } = useLocation();
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
      listener: 0,
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
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col w-full h-[20%] border border-black gap-4">
        <div className="mx-auto mt-5">
          <p>{state}</p>
        </div>
        <div className="flex flex-col mr-auto gap-3">
          <button
            onClick={goCategoryBtnClick}
            className="bg-slate-300 ml-[20px] p-[12px] rounded-lg"
          >
            카테고리로
          </button>
          <button
            onClick={createRoomBtnClick}
            className="bg-slate-300 ml-[20px] p-[12px] rounded-lg"
          >
            방 생성하기
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full h-full border border-black gap-[10px] overflow-auto p-3">
        {roomList.map((item) => (
          <ListOne
            key={item.roomNumber}
            title={item.title}
            talker={item.talker}
            listener={item.listener}
            roomNumber={item.roomNumber}
          />
        ))}
      </div>
    </div>
  );
}

export default RoomList;

function ListOne({ title, talker, listener, roomNumber }) {
  const navigate = useNavigate();
  const btnClickHandler = () => {
    // socket.emit("enter_room", roomNumber);
    navigate("/room", { state: roomNumber });
  };
  const talkerStyle = talker === 2 ? "text-red-600" : null;
  const listenerStyle = listener === 8 ? "text-red-600" : null;
  return (
    <div
      onClick={btnClickHandler}
      className="flex justify-between w-full h-[30px] px-3 border bg-yellow-100 rounded-md"
    >
      <div className="w-[70%] ">{title}</div>
      <div className="flex justify-between w-[20%]">
        <p className={talkerStyle}>발표자 : {talker}/2</p>
        <p className={listenerStyle}>참여자 : {listener}/8</p>
      </div>
    </div>
  );
}
