import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import * as icon from "../icons";

function Room() {
  const navigate = useNavigate();
  // 방 리스트 페이지에서 페이지 이동 시 넘겨는 State : 방 넘버
  const { state } = useLocation();

  const titleList = [
    "연애 중 초능력을 가지면 좋겠는가?",
    "연애 시 비밀번호를 공유해야 하는가?",
    "연애 중 굿모닝 콜을 받아야 하는가?",
    "연애 중에 솔직한 연애 고백을 해야 하는가?",
    "연애 중 키 차이는 중요한가?",
    "연애 중 신체적 유사성을 필요한가?",
    "연애 중에 썸타는 상대방에게 선물을 주어야 하는가?",
    "연애 중에도 개인 시간을 가져야 하는가?",
  ];

  // 향후 titleList가 변경될 때 useMemo 사용
  // const titleList = useMemo(() => );

  const colors = ["#919191", "#C6C6C6"];

  // 타이틀 설정 시 사용되는 State
  const [title, setTitle] = useState("");
  // 룰렛 표시 여부에 사용되는 State
  const [isRoulette, setIsRoulette] = useState(false);
  // 채팅 표시를 위해 사용되는 State
  const [totalChat, setTotalChat] = useState([]);

  const socket = useRef(null);

  // 룰렛 React DOM을 point하기 위한 Ref
  const change = useRef(null);

  // 비디오 부분 React DOM을 point하기 위한 Ref
  const myVideoBox = useRef(null);
  const yourVideoBox = useRef(null);

  // 채팅 전송을 위한 Ref
  const InputValue = useRef("");

  // 내 비디오, 오디오 스트림
  let myStream;

  // --------- 소켓 부분 -----------
  // 1, 컴포넌트가 마운트 됐을 때 : 소켓 연결
  // 2. 리랜더링 시 : 소켓 연결 유지
  // 3. 언마운트 시 : 소켓 연결 끊기
  // 참조 : https://gurtn.tistory.com/180
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
  }, [state]);

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

  // ---------- 룰렛 그리기 -----------
  // 문제점 : 룰렛 다른 참여자들도 보이도록 설정 필요
  useEffect(() => {
    if (isRoulette) {
      // const $c = document.querySelector("canvas");
      const $c = change.current;
      const ctx = $c.getContext(`2d`);

      const newMake = () => {
        // 캔버스의 중앙점 구하기
        const [cw, ch] = [$c.width / 2, $c.height / 2];
        const arc = Math.PI / 4;
        // 룰렛 배경 항목 수에 따라 그리기 : 8개
        for (let i = 0; i < 8; i++) {
          // 그리기 시작
          ctx.beginPath();
          // 해당 위치에 넣을 색상 지정
          ctx.fillStyle = colors[i % 2];
          // 중앙점으로 이동
          ctx.moveTo(cw, ch);
          // 호 그리기
          // arc(x,y,r, startAngle, endAngle, anticlockwise)
          // x좌표, y좌표, 반지름, 호의 시작점, 끝점을 각도(라디안 값)로 표시, 그릴 때 반시계 방향으로 그릴지 여부
          ctx.arc(cw, ch, cw, arc * i, arc * (i + 1), false);
          ctx.fill();
          ctx.closePath();
        }
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillStyle = "";

        // 아이템 표기
        for (let i = 0; i < 8; i++) {
          const angle = arc * i + arc / 2;

          ctx.save();

          ctx.translate(
            cw + Math.cos(angle) * (cw - 75),
            ch + Math.sin(angle) * (ch - 75)
          );
          // ctx.translate(
          //   cw + Math.cos(angle) * (cw - 70),
          //   ch + Math.sin(angle) * (ch - 70)
          // );
          ctx.rotate(angle + Math.PI);
          ctx.fillText(titleList[i], 0, i, 140);

          // ctx.rotate(angle + Math.PI);
          ctx.restore();
        }

        // titleList.forEach((text, j) => {

        //   // ctx.fillText(text, 0, 20 * j);
        // });
      };
      newMake();
    }
  }, [isRoulette, titleList]);
  // ---------- 룰렛 그리기 -----------

  // 내 채팅 내용 화면에 띄어줌
  const chatSubmitHandler = (event) => {
    const myChat = InputValue.current.value;
    event.preventDefault();
    socket.current.emit("send_chat", myChat, state);
    setTotalChat([...totalChat, `You: ${myChat}`]);
    InputValue.current.value = "";
  };

  // 나가기 버튼 클릭 시 실행되는 함수
  const goHomeBtnClick = () => {
    navigate("/roomlist");
  };

  // 내 비디오, 오디오 정보 가져오는 함수
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

  // 게임 시작 버튼 클릭 시 실행되는 함수
  const gameStartBtnClickhandler = () => {
    setIsRoulette(true);
  };

  // 룰렛 돌려 주제정하는 함수
  const setTitleBtnClickHandler = () => {
    const canvas = change.current;
    canvas.style.transform = `initial`;
    canvas.style.transition = `initial`;

    setTimeout(() => {
      const ran = Math.floor(Math.random() * titleList.length);

      const arc = 360 / titleList.length;
      const rotate = ran * arc + 3600 + arc * 3 - arc / 2;

      canvas.style.transform = `rotate(-${rotate}deg)`;
      canvas.style.transition = `2s`;

      setTimeout(() => {
        alert(`토론 주제는 ${titleList[ran]} 입니다!`);
        setTitle(titleList[ran]);
        setIsRoulette(false);
      }, 2000);
    }, 1);
  };

  getMedia();

  return (
    <div className="relative flex w-[100vw] h-[100vh] gap-3 bg-black">
      {/* 룰렛 */}
      {isRoulette ? (
        <div className="absolute w-[100vw] h-[100vh] top-0 left-0 bg-slate-200/40 z-[2]">
          <div className="relative flex justify-center items-center w-[75vh] h-[75vh] top-[12.5%] left-[25vw] z-[3] border border-black">
            <canvas
              ref={change}
              className="w-full h-full rounded-[100%] border-[2vh] border-gray-400 outline outline-[3vh]"
              width="400px"
              height="400px"
            />
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
          <div className="flex justify-between items-center w-full h-[85%] ov">
            {/* 비디오 html : srcObject는 내 오디오, 비디오 장비,연결 시 자동으로 Play되는 autoPlay 속성 적용 */}
            <video
              className="w-[48%] h-full rounded-2xl"
              ref={myVideoBox}
              autoPlay
            />
            <video
              className="w-[48%] h-full rounded-2xl border border-red-500"
              ref={yourVideoBox}
              autoPlay
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
          text prompt
        </div>
        {/* 기능 버튼들 */}
        <div className="flex justify-between w-full h-[7%] px-[1%]">
          <div className="flex w-[40%] gap-[8%]">
            <button className="text-white my-2">
              <icon.MoveRoom width="8vh" />
            </button>
            <button className="text-white my-2">
              <icon.VideoOff width="8vh" />
            </button>
            <button className="text-white my-2">
              <icon.Mute width="8vh" />
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
              <icon.Exit width="10vh" />
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
