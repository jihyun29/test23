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
    if (state === null) {
      return;
    }
    socket.current = io("http://localhost:4000", {
      withCredentials: true,
    });
    socket.current.emit("enter_room", state);
    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket.current === null) {
      return navigate("/");
    }
    socket.current.on("new_chatting", (chat) => {
      setTotalChat([...totalChat, chat]);
    });
  });

  const chatSubmitHandler = (event) => {
    const myChat = InputValue.current.value;
    event.preventDefault();
    socket.current.emit("send_chat", myChat, state);
    setTotalChat([...totalChat, `You: ${myChat}`]);
    InputValue.current.value = "";
  };

  const goHomeBtnClick = () => {
    navigate("/category");
  };

  const getMedia = async () => {
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      videoBox.current.srcObject = myStream;
      console.log(videoBox);
      console.log(myStream);
    } catch (e) {
      console.log(e);
    }
  };

  getMedia();

  return (
    <div className="flex w-full h-full mt-[20px] border gap-3">
      <div>
        <button onClick={goHomeBtnClick}>Go Home</button>
      </div>
      <div>
        <video className="w-[400px] h-[400px] border" ref={videoBox} autoPlay />
      </div>
      <form onSubmit={chatSubmitHandler}>
        <h3> 현재 방 : {state}</h3>
        <div className="w-[400px] h-[50%] border border-black p-2 overflow-auto">
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
        <div className="flex border border-black gap-[10px] bg-slate-300 p-2 mt-2">
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
    </div>
  );
}

export default Room;
