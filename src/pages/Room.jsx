import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Room() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const socket = useRef(null);

  const [totalChat, setTotalChat] = useState([]);
  const videoBox = useRef(null);
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
      videoBox.current.srcObject = myStream;
    } catch (e) {
      console.log(e);
    }
  };

  getMedia();

  return (
    <div className="flex w-full h-[87%] border gap-3 bg-black">
      {/* 뒤로 가기 버튼 */}
      <div>
        <button className="text-white" onClick={goHomeBtnClick}>
          Go Home
        </button>
      </div>
      {/* 뒤로 가기 버튼 */}
      <div className="mx-[7%]">
        {/* 내 비디오 */}
        <div>
          {/* 비디오 html : srcObject는 내 오디오, 비디오 장비
        연결 시 자동으로 Play되는 autoPlay 속성 적용 */}
          <video className="w-fit h-fit border" ref={videoBox} autoPlay />
        </div>
        {/* 내 비디오  */}
      </div>
      {/* 채팅 박스 */}
      <form
        className="flex flex-col ml-auto  w-[20%] h-full border"
        onSubmit={chatSubmitHandler}
      >
        <h3 className="text-white h-[5%]"> 현재 방 : {state}</h3>
        <div className="h-[88%] border border-black p-2 overflow-auto bg-white">
          <ul className="gap-2">
            {totalChat?.map((chat) => {
              if (chat.split(":")[0] === "You") {
                return (
                  <li className="w-fit ml-auto bg-yellow-200 px-2">
                    {chat.split(":")[1]}
                  </li>
                );
              }
              return <li className="bg-blue-300 px-2 w-fit">{chat}</li>;
            })}
          </ul>
        </div>
        <div className="flex w-full h-[5%] border border-black gap-[10px] bg-slate-300 p-2 mt-2">
          <input
            className="border w-full"
            ref={InputValue}
            type="text"
            required
            placeholder="Write chat"
          />
          <button className="bg-slate-100 px-1">Send</button>
        </div>
      </form>
      {/* 채팅 박스 */}
    </div>
  );
}

export default Room;
