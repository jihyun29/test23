import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { game } from "../api/api";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Room from "../components/Room";
import Pagination from "../components/Pagination";
import image from "../images";
// test
import { useRoomListSocket } from "../util/useSocket";

function RoomList() {
  // ------------------------- test
  const roomListSocket = useMemo(useRoomListSocket, []);

  useEffect(() => {
    roomListSocket.emit("update", "update");
    return () => {
      roomListSocket.disconnect();
    };
  }, []);

  roomListSocket.on("send_roomlist", (msg) => {
    console.log(msg);
  });
  roomListSocket.on("test", (msg) => {
    console.log(msg);
  });
  // ------------------------- test

  const navigate = useNavigate();
  // 카테고리 페이지로부터 선택된 카테고리 전달 받음
  const { state } = useLocation();
  // 카테고리 이름, 코드
  const [name, code] = state;

  const bannerImageList = {
    game: image.game,
    entertainment: image.entertainment,
    sport: image.sport,
    love: image.love,
    marriage: image.marriage,
    company: image.company,
    school: image.school,
    balancegame: image.balancegame,
  };

  const bannerTextList = {
    love: [
      "연애할 때 나만 이럴까?",
      "하나부터 열까지 다른 연애관, 다양하게 토론해요",
    ],
    marriage: ["결혼과 육아에 대해 관심있는 분들 모여요"],
    entertainment: ["연예인과 다양한 가십거리에 대해 토론해요"],
    balancegame: [
      "짜장면이 좋아 짬뽕이 좋아?",
      "인류가 가진 영원한 난제, A와 B사이에서 무한히 고민해봐요",
    ],
    sport: ["다양한 프로 스포츠와 운동에 관해 토론해요"],
    school: ["학교에서는 뭐가 좋을까"],
    company: [
      "기본급이 높은 게 좋나, 영끌이 높은 게 좋나-",
      "하나하나 전부 다 다른 가치관을 토론으로 깨부숴요.",
    ],
    game: [
      "게임할 때 나만 이럴까?",
      "하나부터 열까지 다른 게임스타일, 다양하게 토론해요",
    ],
  };

  let bannerImage;
  let bannerText;

  switch (name) {
    case "게임/프로게이머":
      bannerImage = bannerImageList.game;
      bannerText = bannerTextList.game;
      break;
    case "연예/이슈":
      bannerImage = bannerImageList.entertainment;
      bannerText = bannerTextList.entertainment;
      break;
    case "스포츠/운동":
      bannerImage = bannerImageList.sport;
      bannerText = bannerTextList.sport;
      break;
    case "연애":
      bannerImage = bannerImageList.love;
      bannerText = bannerTextList.love;
      break;
    case "결혼/육아":
      bannerImage = bannerImageList.marriage;
      bannerText = bannerTextList.marriage;
      break;
    case "회사생활":
      bannerImage = bannerImageList.company;
      bannerText = bannerTextList.company;
      break;
    case "학교생활":
      bannerImage = bannerImageList.school;
      bannerText = bannerTextList.school;
      break;
    case "밸런스게임":
      bannerImage = bannerImageList.balancegame;
      bannerText = bannerTextList.balancegame;
      break;
    default:
      break;
  }

  // 페이지네이션 관련 변수들
  const limit = 10;
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  // 방 리스트 만들기 위해 더미데이터 이용 => api로 받아와야 되는 부분들
  const [roomList, setRoomList] = useState([]);

  // useQuery에 대한 것은 queryKey부터 시작해서 좀 더 공부 필요 !!
  const { isLoading: isRoomListLoading } = useQuery(
    ["getRoom", code],
    () => game.getRoomList(code),
    {
      onSuccess: (data) => {
        // console.log(data);
        setRoomList([...data.data.data]);
      },
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  const { mutateAsync: createRoom } = useMutation(() => game.createRoom(code), {
    onSuccess: (res) => {
      console.log(res);
    },
  });

  // 방생성 함수 : 지금은 랜덤으로 생성 & 내 화면에만 표시됨으로 향후 수정 필요
  // createRoom mustation으로 들어가도록 설정 필요
  const createRoomBtnClick = async () => {
    const data = await createRoom();
    const roomData = data.data.data[0];
    navigate(`/room/${roomData.roomId}`, {
      state: [roomData.roomId, roomData.roomName, name, code, true],
    });
  };

  // 카테고리로 이동하는 함수
  const goCategoryBtnClick = () => {
    navigate("/category");
  };

  const showRoomListDevidedByNumber = (
    totalRoomList,
    startNumber,
    devideNumber
  ) => {
    return totalRoomList
      ?.slice(startNumber, startNumber + devideNumber)
      .map((item, index) => (
        <Room
          key={item.roomId}
          number={index + limit * (page - 1)}
          ß
          categoryName={item.KategorieName}
          roomName={item.roomName}
          debater={item.debater}
          panel={item.panel}
          roomId={item.roomId}
          categoryCode={code}
        />
      ));
  };

  return (
    <>
      <Header />
      <div className="flex flex-col w-full h-[83vh]">
        {/* 배너 부분 */}
        <div className="relative flex flex-col w-full h-[23vh] bg-white">
          <div className="relative w-full h-full overflow-hidden z-[2]">
            <img
              className="w-full h-full object-fill"
              src={bannerImage}
              alt="카테고리에 따른 이미지"
            />
          </div>
          <button
            onClick={goCategoryBtnClick}
            className="absolute ml-[3vh] text-[2.5vh] font-bold text-[#C6C6C6] top-[10%] z-[4]"
          >
            ← 카테고리 선택
          </button>
          <div className="absolute flex flex-col justify-center items-center w-full h-full left-0 top-0 z-[3]">
            <div className="w-fit text-[2.7vh] text-white font-medium mx-auto">
              {name}
            </div>
            <div className="text-white text-[1.5vh] w-fit mt-[1vh] mx-auto">
              {bannerText[0]}
            </div>
            <div className="text-white text-[1.5vh] w-fit mx-auto">
              {bannerText[1] && bannerText[1]}
            </div>
          </div>
          {localStorage.getItem("kakaoId") === "1" && (
            <button
              onClick={createRoomBtnClick}
              className="absolute border border-white text-[2.3vh] text-white font-bold px-[3vh] py-[1vh] rounded-[8px] mt-[2%] right-[7%] bottom-[10%] z-[4]"
            >
              {" "}
              방 만들기
            </button>
          )}
        </div>
        {/* 배너 부분 */}

        {/* 방리스트 타이틀 */}
        <div className="flex items-center w-[87vw] h-[5vh] mx-[6.4vw] mt-auto border-b-2 border-[#777777]">
          <div className="flex justify-center ml-[3vw] w-[51px] text-[1.6vh] text-[#919191] font-semibold">
            Num
          </div>
          <p className="ml-[7.5vw] w-[46vw] text-[1.6vh] text-[#919191] font-semibold">
            방제목
          </p>
          <p className="ml-[50px] text-[1.6vh] text-[#919191] font-semibold">
            인원
          </p>
        </div>
        {/* 방리스트 타이틀 */}

        {/* 빙 리스트 본문 */}
        <div className="flex flex-col w-full h-[52vh] px-[6.4vw] overflow-hidden">
          {showRoomListDevidedByNumber(roomList, offset, limit)}
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
