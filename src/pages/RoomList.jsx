import Lottie from "lottie-react";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { game } from "../api/api";
import Footer from "../components/Footer";
import Header from "../components/Header";
import lottie from "../lottie";
import Room from "../components/Room";
import Pagination from "../components/Pagination";

function RoomList() {
  const navigate = useNavigate();
  // 카테고리 페이지로부터 선택된 카테고리 전달 받음
  const { state } = useLocation();
  const [name, code] = state;
  console.log(name, code);

  // 방 리스트 만들기 위해 더미데이터 이용 => api로 받아와야 되는 부분들
  const [roomList, setRoomList] = useState([]);

  // useQuery에 대한 것은 queryKey부터 시작해서 좀 더 공부 필요 !!
  const { isLoading: isRoomListLoading } = useQuery(
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
          <div className="flex justify-center ml-[3vw] w-[51px] text-[1.5vh]">
            Num
          </div>
          <p className="ml-[7.5vw] w-[50vw] text-[1.5vh]">방제목</p>
          <p className="ml-[50px] text-[1.5vh]">인원</p>
        </div>
        {/* 방리스트 타이틀 */}

        {/* 빙 리스트 본문 */}
        <div className="flex flex-col w-full h-[52vh] px-[6.4vw] overflow-hidden">
          {roomList?.slice(offset, offset + limit).map((item, index) => (
            <Room
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
