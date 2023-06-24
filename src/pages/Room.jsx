import React from "react";
import Lottie from "lottie-react";

import { useState, useRef, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "react-query";

import { useRoulette } from "../util/useRoulette";
import { useSocket } from "../util/useSocket";

import { chatgpt } from "../api/api";

import lottie from "../lottie";
import * as icon from "../icons";

function Room() {
  const navigate = useNavigate();
  // 방 리스트 페이지에서 페이지 이동 시 넘겨는 State : 방 넘버
  const { state } = useLocation();

  const { roomNumber, defaultTitle, category } = state;

  // 타이틀 설정 시 사용되는 State
  const [title, setTitle] = useState(defaultTitle);
  // 룰렛 표시 여부에 사용되는 State
  const [isRoulette, setIsRoulette] = useState(false);
  // 채팅 표시를 위해 사용되는 State
  const [totalChat, setTotalChat] = useState([]);

  // 비디오 끄기, 음소거 아이콘 변경에 사용되는 State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true);

  const socket = useRef(null);

  // 룰렛 React DOM을 point하기 위한 Ref
  const roulette = useRef(null);

  // 비디오 부분 React DOM을 point하기 위한 Ref
  const myVideoBox = useRef(null);
  const yourVideoBox = useRef(null);

  // 채팅 전송을 위한 Ref
  const chatInputValue = useRef("");

  const { mutateAsync: getTitleList, isLoading: isTitleLoading } = useMutation(
    () => chatgpt.kategorie(category),
    {
      onSuccess: (res) => {
        console.log("title is", res);
      },
      onError: (error) => {
        console.log(error);
      },
      retry: 0,
    }
  );

  const titleList = useRef([]);

  // --------- 소켓 부분 -----------
  useSocket({ socket, roomNumber });
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
  // ---------- 소켓 부분 -----------

  // ---------- 룰렛 관련 -----------
  // 문제점 : 룰렛 다른 참여자들도 보이도록 설정 필요
  useRoulette({ isTitleLoading, isRoulette, titleList, roulette });

  // 룰렛 닫는 함수
  const closeRoulette = () => {
    setIsRoulette(false);
  };
  // ---------- 룰렛 관련 -----------

  // 내 채팅 내용 화면에 띄어줌
  const chatSubmitHandler = (event) => {
    const myChat = chatInputValue.current.value;
    event.preventDefault();
    socket.current.emit("send_chat", myChat, roomNumber);
    setTotalChat([...totalChat, `You: ${myChat}`]);
    chatInputValue.current.value = "";
  };

  // 나가기 버튼 클릭 시 실행되는 함수
  const goHomeBtnClick = () => {
    navigate("/category");
  };

  // 게임 시작 버튼 클릭 시 실행되는 함수
  const gameStartBtnClickhandler = async () => {
    const data = await getTitleList();
    const sortedData = data.data.data.answer.split("\n");
    console.log(sortedData);
    titleList.current = sortedData;
    setIsRoulette(true);
  };

  // 룰렛 돌려 주제정하는 함수
  const setTitleBtnClickHandler = (event) => {
    event.stopPropagation();
    const canvas = roulette.current;
    canvas.style.transform = `initial`;
    canvas.style.transition = `initial`;

    setTimeout(() => {
      const ran = Math.floor(Math.random() * titleList.current.length);

      const arc = 360 / titleList.current.length;
      const rotate = ran * arc + 3600 + arc * 3 - arc / 2;

      canvas.style.transform = `rotate(-${rotate}deg)`;
      canvas.style.transition = `2s`;

      setTimeout(() => {
        alert(`토론 주제는 ${titleList.current[ran]} 입니다!`);
        setTitle(titleList.current[ran]);
        setIsRoulette(false);
      }, 2000);
    }, 1);
  };

  // 내 오디오 음소거 함수
  const muteClickHandler = async () => {
    (await myStream)
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    // console.log((await myStream).getAudioTracks());
    if (!isMuted) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  // 내 비디오 끄기 함수
  const cameraOffClickHandler = async () => {
    (await myStream)
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    // console.log((await myStream).getVideoTracks());
    if (!isVideoOff) {
      setIsVideoOff(true);
    } else {
      setIsVideoOff(false);
    }
  };

  // 내 비디오, 오디오 정보 가져오는 함수
  const getMedia = async () => {
    try {
      // 내 오디오, 비디오 장비들의 stram 정보를 가져옴
      const Stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      Stream.getVideoTracks().forEach(
        (track) => (track.enabled = !track.enabled)
      );
      // console.log(Stream);
      return Stream;
    } catch (e) {
      console.log(e);
    }
  };

  // 컴포넌트 첫 마운트 시에 myStream 정보를 캐싱 후 바꾸지 않음
  // 향후 반장이 바뀔 때 의존성으로 사용할 수 있을 것 같음
  const myStream = useMemo(getMedia, []);

  // isMuted 와 isVideoOff 상태를 의존성을 가지며 2개의 상태값이 변할 때마다 캐싱된 myStream 값을 가져와서 video의 srcObject로 입력해줌
  useEffect(() => {
    setTimeout(async () => {
      // console.log(await myStream);
      myVideoBox.current.srcObject = await myStream;
      yourVideoBox.current.srcObject = await myStream;
    }, 0);
  }, [isMuted, isVideoOff, myStream]);

  return (
    <div className="relative flex w-[100vw] h-[100vh] gap-3 bg-black">
      {/* 룰렛 */}(
      {isRoulette ? (
        <div
          onClick={closeRoulette}
          className="absolute w-[100vw] h-[100vh] top-0 left-0 bg-slate-200/40 z-[2]"
        >
          <div className="relative flex justify-center items-center w-[75vh] h-[75vh] top-[12.5%] left-[25vw] z-[2]">
            <canvas
              ref={roulette}
              className="w-full h-full rounded-[100%] border-[2vh] border-gray-400 outline outline-[3vh]"
              width="400px"
              height="400px"
            />
            )
            <button
              className="absolute z-[4] w-[20%] h-[20%] border rounded-full bg-white text-[3vh]"
              onClick={setTitleBtnClickHandler}
            >
              룰렛돌리기
            </button>
            <div className="absolute z-[4] w-[1vh] h-[1vh] top-[-2.5vh] left-[48%] text-[5vh]">
              ▼
            </div>
          </div>
        </div>
      ) : isTitleLoading ? (
        <div className="absolute w-[100vw] h-[100vh] top-0 left-0 bg-slate-200/40 z-[2]">
          <div className="relative flex justify-center items-center w-[75vh] h-[75vh] top-[12.5%] left-[25vw] z-[2]">
            <Lottie animationData={lottie.loading} />
          </div>
        </div>
      ) : null}
      {/* 룰렛 */}
      {/* 게임 창 부분 */}
      <div className="flex flex-col w-[75%] h-full py-[1%] pl-[1%] gap-[1%]">
        {/* 주제 + 비디오 */}
        <div className="relative flex flex-col gap-[2%] p-[1%] h-[50%] bg-[#1E1E1E] rounded-2xl">
          <div className="w-full h-[15%]">
            {/* 주제 */}
            <div className="flex h-full justify-between gap-[1%]">
              <div className="flex w-[10%] items-center justify-center bg-[#2F3131] text-white rounded-lg font-medium text-[1.8vh]">
                주제
              </div>

              <div className="flex w-[90%] items-center justify-center bg-[#2F3131] text-white rounded-lg font-medium text-[2vh]">
                {title}
              </div>
            </div>
            {/* 주제 */}
          </div>

          <div className="absolute w-[3vh] h-[2vh right-[48.5%] top-[55%]">
            <icon.Versus width="100%" height="100%" />
          </div>
          {/* 비디오 */}
          <div className="flex justify-between items-center w-full h-[85%]">
            {/* 비디오 html : srcObject는 내 오디오, 비디오 장비,연결 시 자동으로 Play되는 autoPlay 속성 적용 */}
            {/* playsinline : 모바일 기기가 비디오를 재생할 때 전체화면이 되지 않도록 설정 */}
            <video
              className="w-[48%] h-full rounded-2xl"
              ref={myVideoBox}
              autoPlay
              playsInline
              muted
            />
            <video
              className="w-[48%] h-full rounded-2xl"
              ref={yourVideoBox}
              autoPlay
              playsInline
              muted
            />
          </div>
          {/* 비디오 */}
        </div>
        {/*----------- 주제 + 비디오 ---------- */}
        {/* Progress bar */}
        <div className="flex justify-center items-center w-full h-[7%] bg-[#1E1E1E] rounded-2xl text-white">
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
        <div className="flex justify-center items-center w-full h-[14%] bg-[#2F3131] text-[#C6C6C6] font-bold rounded-2xl text-[2vh]">
          {/* <Prompt /> */}
        </div>
        {/* 기능 버튼들 */}
        <div className="flex justify-between w-full h-[7%] px-[1%]">
          <div className="flex w-[40%] gap-[8%]">
            <button className="text-white my-2">
              <icon.MoveRoom width="8vh" height="100%" />
            </button>
            <button className="text-white my-2">
              {isVideoOff ? (
                <icon.VideoOn
                  onClick={cameraOffClickHandler}
                  width="8vh"
                  height="100%"
                />
              ) : (
                <icon.VideoOff
                  onClick={cameraOffClickHandler}
                  width="8vh"
                  height="100%"
                />
              )}
            </button>
            <button className="text-white my-2">
              {isMuted ? (
                <icon.MuteOff
                  onClick={muteClickHandler}
                  width="8vh"
                  height="100%"
                />
              ) : (
                <icon.Mute
                  onClick={muteClickHandler}
                  width="8vh"
                  height="100%"
                />
              )}
            </button>
          </div>
          <div className="flex w-[10vh]">
            <button
              className="text-white my-2 ml-auto w-full border text-[3vh]"
              onClick={gameStartBtnClickhandler}
            >
              start
            </button>
          </div>
          <div className="flex">
            <button
              className="text-white my-2 ml-auto"
              onClick={goHomeBtnClick}
            >
              <icon.Exit width="8vh" height="100%" />
            </button>
          </div>
        </div>
      </div>
      {/* 게임 창 부분 */}
      {/* 채팅 박스 */}
      <form
        className="flex flex-col ml-auto  w-[25%] h-full"
        onSubmit={chatSubmitHandler}
      >
        <div className="h-full border border-black p-2 break-words overflow-x-hidden overflow-y-auto bg-[#1B1B1B]">
          <ul>
            {totalChat?.map((chat) => {
              if (chat.split(":")[0] === "You") {
                return (
                  <li className="w-fit max-w-[80%] ml-auto bg-[#2F3131] px-[0.5vh] mt-[0.5vh] text-[#C6C6C6] text-[1.7vh] rounded-[1vh]">
                    {chat.split(":")[1]}
                  </li>
                );
              }
              return (
                <li className="w-fit max-w-[80%] bg-[#2F3131] text-[#C6C6C6] text-[1.7vh] mt-[0.5vh] px-[0.5vh] rounded-[1vh]">
                  {chat}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex w-full h-[5%] border border-black gap-[10px] bg-slate-300 p-2 mt-2 rounded-2xl">
          <input
            className="border w-full"
            ref={chatInputValue}
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
