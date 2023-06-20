import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import * as icon from "../icons";

function Room() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const socket = useRef(null);

  const [totalChat, setTotalChat] = useState([]);
  const myVideoBox = useRef(null);
  const yourVideoBox = useRef(null);
  const InputValue = useRef("");

  let myStream;
  // 컴포넌트가 마운트 됐을 때 : 소켓 연결
  // 리랜더링 시 : 소켓 연결 유지
  // 언마운트 시 : 소켓 연결 끊기
  useEffect(() => {
    // 페이지 접속 시 방넘버가 없을 경우 소켓 연결 안되도록 설정
    if (state === null) {
      return;
    }
    // 방 넘버만 있다면 소켓 연결
    socket.current = io("http://localhost:4000", {
      withCredentials: true,
    });
    socket.current.emit("enter_room", state);
    // 페이지 언마운트 시 소켓 연결 해제
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    // 소켓이 연결되어 있지 않다면 홈페이지로 이동
    if (socket.current === null) {
      return navigate("/");
    }
    // 소켓이 연결되어 있다면 새로운 채팅 발생 시 해당 채팅 화면에 띄어줌
    socket.current.on("new_chatting", (chat) => {
      setTotalChat([...totalChat, chat]);
    });
  });

  // 내 채팅 내용 화면에 띄어줌
  const chatSubmitHandler = (event) => {
    const myChat = InputValue.current.value;
    event.preventDefault();
    socket.current.emit("send_chat", myChat, state);
    setTotalChat([...totalChat, `You: ${myChat}`]);
    InputValue.current.value = "";
  };

  // 카테고리로 이동하는 Click 이벤트
  const goHomeBtnClick = () => {
    navigate("/roomlist");
  };

  // 내 장비 정보 가져오는 함수
  const getMedia = async () => {
    try {
      // 내 오디오, 비디오 장비들의 stram 정보를 가져옴
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
      });
      // vedio html요소와 내 오디오, 비동 장비 연결
      myVideoBox.current.srcObject = myStream;
      yourVideoBox.current.srcObject = myStream;
    } catch (e) {
      console.log(e);
    }
  };

  getMedia();

  return (
    <div className="flex w-[100vw] h-[88vh] gap-3 bg-black">
      <div className="flex flex-col w-[75%] h-full py-[1%] pl-[1%] gap-[1%]">
        {/* 주제 + 비디오 */}
        <div className="relative flex flex-col gap-[2%] p-[1%] h-[46%] bg-[#1E1E1E] rounded-2xl">
          <div className="w-full h-[15%]">
            <div className="flex h-full justify-between gap-[1%]">
              <div className="flex w-[10%] items-center justify-center bg-[#2F3131] text-white rounded-lg">
                주제
              </div>
              <div className="flex w-[90%] items-center justify-center bg-[#2F3131] text-white rounded-lg">
                연애 시 비밀번호를 공유해야 하는가?
              </div>
            </div>
          </div>

          <div className="absolute w-[3vh] h-[2vh right-[48.5%] top-[55%]">
            <icon.Versus width="100%" height="100%" />
          </div>

          <div className="flex justify-between h-[85%]">
            {/* 내 비디오 */}
            <div className="w-[49%] h-full">
              {/* 비디오 html : srcObject는 내 오디오, 비디오 장비
        연결 시 자동으로 Play되는 autoPlay 속성 적용 */}
              <video
                className="w-full h-full rounded-2xl"
                ref={myVideoBox}
                autoPlay
              />
            </div>
            <video
              className="w-[49%] h-full rounded-2xl"
              ref={yourVideoBox}
              autoPlay
            />
            {/* 내 비디오  */}
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex justify-center items-center w-full h-[10%] bg-[#1E1E1E] rounded-2xl text-white">
          progress bar
        </div>
        {/* 닉네임 */}
        <div className="grid grid-cols-4 grid-rows-2 w-full h-[20%]  gap-2">
          <div className="bg-[#1B1B1B] rounded-lg"></div>
          <div className="bg-[#1B1B1B] rounded-lg"></div>
          <div className="bg-[#1B1B1B] rounded-lg"></div>
          <div className="bg-[#1B1B1B] rounded-lg"></div>
          <div className="bg-[#1B1B1B] rounded-lg"></div>
          <div className="bg-[#1B1B1B] rounded-lg"></div>
          <div className="bg-[#1B1B1B] rounded-lg"></div>
          <div className="bg-[#1B1B1B] rounded-lg"></div>
        </div>
        {/* text prompt  */}
        <div className="flex justify-center items-center w-full h-[14%] bg-[#2F3131] text-[#C6C6C6] font-bold rounded-2xl">
          text prompt
        </div>
        {/* 기능 버튼들 */}
        <div className="flex justify-between w-full h-[8%] px-[1%]">
          <div className="flex w-[40%] gap-[8%]">
            {/* 뒤로 가기 버튼 */}
            <button className="text-white my-2">
              <icon.MoveRoom />
            </button>
            {/* 뒤로 가기 버튼 */}
            <button className="text-white my-2">
              <icon.VideoOff />
            </button>
            <button className="text-white my-2">
              <icon.Mute />
            </button>
          </div>
          <div className="flex">
            <button
              className="text-white my-2 ml-auto"
              onClick={goHomeBtnClick}
            >
              <icon.Exit />
            </button>
          </div>
        </div>
      </div>

      {/* 채팅 박스 */}
      <form
        className="flex flex-col ml-auto  w-[25%] h-full"
        onSubmit={chatSubmitHandler}
      >
        <div className="h-full border border-black p-2 overflow-auto bg-[#1B1B1B]">
          <ul>
            {totalChat?.map((chat) => {
              if (chat.split(":")[0] === "You") {
                return (
                  <li className="w-fit ml-auto bg-[#2F3131] px-2 mt-[0.5vh] text-[#C6C6C6] text-[1.7vh] rounded-[1vh]">
                    {chat.split(":")[1]}
                  </li>
                );
              }
              return <li className="bg-blue-300 px-2 w-fit">{chat}</li>;
            })}
          </ul>
        </div>
        <div className="flex w-full h-[5%] border border-black gap-[10px] bg-slate-300 p-2 mt-2 rounded-2xl">
          <input
            className="border w-full"
            ref={InputValue}
            type="text"
            required
            placeholder="Write chat"
          />
          <button className="bg-slate-100 px-1 rounded-2xl">Send</button>
        </div>
      </form>
      {/* 채팅 박스 */}
    </div>
  );
}

export default Room;
