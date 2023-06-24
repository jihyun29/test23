import Lottie from "lottie-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { game } from "../api/api";
import Footer from "../components/Footer";
import Header from "../components/Header";
import lottie from "../lottie";

function RoomList() {
  const navigate = useNavigate();
  // 카테고리 페이지로부터 선택된 카테고리 전달 받음
  const { state } = useLocation();
  const [name, code] = state;
  console.log(name, code);

  // 방 리스트 만들기 위해 더미데이터 이용 => api로 받아와야 되는 부분들
  const [roomList, setRoomList] = useState([]);

  const { data: getData, isLoading: isRoomListLoading } = useQuery(
    ["getRoom", code],
    () => game.getRoomList(code),
    {
      onSuccess: (data) => {
        console.log(data);
        setRoomList([...data.data.data]);
      },
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );

  useEffect(() => {
    console.log(roomList);
  }, [roomList]);

  // 페이지네이션 관련 변수들
  const limit = 10;
  const [page, setPage] = useState(1);
  const offset = (page - 1) * limit;

  // 카테고리로 이동하는 함수
  const goCategoryBtnClick = () => {
    navigate("/category");
  };

  // 방생성 함수 : 지금은 랜덤으로 생성 & 내 화면에만 표시됨으로 향후 수정 필요
  const createRoomBtnClick = async () => {
    // const randomTitle = Math.round(Math.random() * 7);
    // console.log(randomTitle);
    // console.log(await titleList);
    // const title = (await titleList)[randomTitle];
    // console.log(title);
    navigate(`/room/${roomList.length + 1}`, {
      state: [roomList.length + 1, "의미없는 데이터", state],
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
              {name}
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
          {roomList?.slice(offset, offset + limit).map((item, index) => (
            <ListOne
              key={item.roomId}
              number={index + limit * (page - 1)}
              categoryName={item.KategorieName}
              roomName={item.roomName}
              debater={item.debater}
              panel={item.panel}
              roomId={item.roomId}
              categoryCode={code}
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
function ListOne({
  number,
  roomName,
  debater,
  panel,
  roomId,
  categoryName,
  categoryCode,
}) {
  const navigate = useNavigate();
  // 방 입장 시 방 넘버 넘겨줌
  const btnClickHandler = () => {
    navigate(`/room/${roomId}`, {
      state: [roomId, roomName, categoryName, categoryCode],
    });
  };

  // 방이 꽉 찰 경우 접속 불가하도록 설정
  const debaterStyle = debater === 2 ? "text-red-600" : null;
  const panelStyle = panel === 8 ? "text-red-600" : null;
  const [style, disabled] =
    debater + panel === 10
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
          {roomName}
        </p>
      </div>
      {/* 방제목 */}

      {/* 인원 */}
      <div className="flex justify-between gap-4 text-[1.3vh]">
        <p className={debaterStyle}>발표자 : {debater}/2</p>
        <p className={panelStyle}>참여자 : {panel}/8</p>
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
