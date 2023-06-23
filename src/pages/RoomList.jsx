import Lottie from "lottie-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import image from "../images";
import lottie from "../lottie";

function RoomList() {
  const navigate = useNavigate();
  // 카테고리 페이지로부터 선택된 카테고리 전달 받음
  const { state } = useLocation();

  let imageSrc;
  switch (state) {
    case "게임/프로게이머":
      imageSrc = image.game;
      break;
    case "연예/이슈":
      imageSrc = image.celebrity;
      break;
    case "스포츠/운동":
      imageSrc = image.sports;
      break;
    case "연애":
      imageSrc = image.love;
      break;
    case "결혼/육아":
      imageSrc = image.marriage;
      break;
    case "회사생활":
      imageSrc = image.work;
      break;
    case "학교생활":
      imageSrc = image.school;
      break;
    case "밸런스게임":
      imageSrc = image.balance;
      break;
    default:
      imageSrc = null;
      break;
  }

  // 더미 데이터 => api로 받아와야 되는 부분들
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
  // 방 리스트 만들기 위해 더미데이터 이용 => api로 받아와야 되는 부분들
  const [roomList, setRoomList] = useState([
    {
      title: "연애 중 초능력을 가지면 좋겠는가?",
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
      roomNumber: "자",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "차",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "카",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "타",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "파",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "하",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "갸",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "냐",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "댜",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "랴",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "먀",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "뱌",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "샤",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "야",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "쟈",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "챠",
    },
    {
      title: "연애 중에도 개인 시간을 가져야 하는가?",
      talker: 1,
      listener: 8,
      roomNumber: "캬",
    },
  ]);

  // 페이지네이션 관련 변수들
  const limit = 10;
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  // 카테고리로 이동하는 함수
  const goCategoryBtnClick = () => {
    navigate("/category");
  };

  // 방생성 함수 : 지금은 랜덤으로 생성 & 내 화면에만 표시됨으로 향후 수정 필요
  const createRoomBtnClick = () => {
    const randomTitle = Math.round(Math.random() * 7);
    const randomTalker = Math.round(Math.random() * 2);
    const randomListener = Math.round(Math.random() * 8);
    const title = titleList[randomTitle];
    setRoomList([
      ...roomList,
      {
        title: title,
        talker: `${randomTalker}`,
        listener: `${randomListener}`,
        roomNumber: `${roomList.length + 1}`,
      },
    ]);
    navigate("/room", {
      state: {
        roomNumber: roomList.length + 1,
        defaultTitle: titleList[randomTitle],
      },
    });
  };

  return (
    <>
      <Header />
      <div className="flex flex-col w-full h-[80vh]">
        {/* 배너 부분 */}
        <div className="relative flex flex-col w-full h-[20vh] bg-white">
          <div className="relative w-full h-full overflow-hidden">
            <Lottie
              animationData={lottie.heartback}
              className="absolute w-full"
            />
            <Lottie
              animationData={lottie.heart3}
              className="absolute left-[45%] h-full"
            />
          </div>
          {/* [#464747] */}
          {/* <img
            className="h-full object-cover"
            src={imageSrc}
            alt="카테고리에 따른 이미지"
            auto
          /> */}
          <button
            onClick={goCategoryBtnClick}
            className="absolute ml-[2vh] text-[2.5vh] font-bold text-[#ABABAB] top-[10%]"
          >
            ← 카테고리 선택
          </button>
          <div className="absolute right-[5%] top-[10%] ">
            <div className="w-fit text-[2.7vh] text-black font-medium ml-auto">
              {state}
            </div>
            <div className="text-[#ABABAB] w-fit  ml-auto">
              연애할 때 나만 이럴까?
            </div>
            <div className="text-[#ABABAB] w-fit ml-auto">
              다양한 토론 주제에 대해 이야기해요
            </div>
          </div>
          <button
            onClick={createRoomBtnClick}
            className="absolute bg-[#777777] text-[2.3vh] text-white font-bold px-[3vh] py-[1vh] rounded-[8px] mt-[2%] right-[5%] bottom-[10%]"
          >
            {" "}
            방 생성하기
          </button>
        </div>
        {/* 배너 부분 */}

        {/* 방리스트 타이틀 */}
        <div className="flex items-center w-[87vw] h-[5vh] mx-[6.4vw] mt-auto border-b-2 border-[#777777]">
          <div className="flex justify-center ml-[3vw] w-[51px] text-[1.3vh]">
            Num
          </div>
          <p className="ml-[7.5vw] w-[50vw] text-[1.3vh]">방제목</p>
          <p className="ml-[50px] text-[1.3vh]">인원</p>
        </div>
        {/* 방리스트 타이틀 */}

        {/* 빙 리스트 본문 */}
        <div className="flex flex-col w-full h-[52vh] px-[6.4vw] overflow-hidden">
          {roomList.slice(offset, offset + limit).map((item, index) => (
            <ListOne
              key={item.roomNumber}
              number={index + limit * (page - 1)}
              title={item.title}
              talker={item.talker}
              listener={item.listener}
              roomNumber={item.roomNumber}
            />
          ))}
        </div>
        {/* 빙 리스트 본문 */}

        {/* 페이지네이션 부분 */}
        <div className="flex justify-center h-[3vh] items-center gap-[0.5vh]">
          <Pagination
            total={roomList.length}
            limit={limit}
            page={page}
            setPage={setPage}
          />
        </div>
        {/* 페이지네이션 부분 */}
      </div>
      <Footer />
    </>
  );
}

export default RoomList;

// 방 리스트 1개 컴포넌트
function ListOne({ number, title, talker, listener, roomNumber }) {
  const navigate = useNavigate();
  // 방 입장 시 방 넘버 넘겨줌
  const btnClickHandler = () => {
    // socket.emit("enter_room", roomNumber);
    navigate("/room", {
      state: { roomNumber: roomNumber, defaultTitle: title },
    });
  };

  // 방이 꽉 찰 경우 접속 불가하도록 설정
  const talkerStyle = talker === 2 ? "text-red-600" : null;
  const listenerStyle = listener === 8 ? "text-red-600" : null;
  const [style, disabled] =
    talker + listener === 10
      ? ["font-semibold text-[#C6C6C6] text-[1.3vh]", true]
      : ["font-semibold text-[#35C585] text-[1.3vh]", false];

  return (
    <div className="flex items-center w-full h-[10%] border-b">
      {/* 방 넘버 */}
      <div className="flex justify-center itmes-center w-[51px] ml-[3vw] text-[1.3vh]">
        {number + 1}
      </div>
      {/* 방 넘버 */}

      {/* 방제목 */}
      <div className="ml-[7.5vw] w-[50vw] text-[1.3vh]">
        <p onClick={btnClickHandler} className="w-fit hover:cursor-pointer">
          {title}
        </p>
      </div>
      {/* 방제목 */}

      {/* 인원 */}
      <div className="flex justify-between gap-4 text-[1.3vh]">
        <p className={talkerStyle}>발표자 : {talker}/2</p>
        <p className={listenerStyle}>참여자 : {listener}/8</p>
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

// 문제점 : 다른 페이지 넘버에 갔다가 이전 페이지 넘버로 이동 시 두개가 합쳐지는 현상 발생 => map함수로 컴포넌트 그릴때 각 컴포넌트가 다른 Id를 가지고 있으면 문제 발생하지 않음
function Pagination({ total, limit, page, setPage }) {
  const numPages = Math.ceil(total / limit);

  return (
    <>
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="h-full disabled:text-gray-400 disabled:cursor-default"
      >
        &lt;
      </button>
      {Array(numPages)
        .fill()
        .map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? "page" : null}
            className="w-[2vh] h-[2vh] rounded-[100%] px-[0.5vh] bg-black text-[white] text-[1vh] hover:bg-[tomato] hover:cursor-pointer translate-y-[-2px] aria-[current]:bg-green-500 aria-[current]:font-bold"
          >
            {i + 1}
          </button>
        ))}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === numPages}
        className="h-full disabled:text-gray-400 disabled:cursor-default"
      >
        &gt;
      </button>
    </>
  );
}
