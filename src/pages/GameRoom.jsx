import React from "react";
import Lottie from "lottie-react";

import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";
import jwt_decode from "jwt-decode";

import { useRoulette } from "../util/useRoulette";
import { useNotGoBack } from "../util/useNotGoBack";

import lottie from "../lottie";
import icon from "../icons";
import { useSocket } from "../util/useSocket";
import Prompt from "../components/feature/Prompt";
import Progressbar from "../components/feature/Progressbar";
import { decrypt } from "../util/cryptoJs";

function GameRoom() {
  const navigate = useNavigate();

  const state = useMemo(() => decrypt(sessionStorage.getItem("userData")), []);

  let { roomNumber, defaultTitle, categoryName, categoryCode } = state;

  const [isFirstLoading, setIsFirstLoading] = useState(true);
  // 타이틀 설정 시 사용되는 상태
  const [title, setTitle] = useState(defaultTitle);
  // 호스트 변경 시 사용
  const [isHost, setIsHost] = useState(state.isHost);
  // 배심원이 토론자로 변경될 시 사용할 예정
  const [isTeller, setIsTeller] = useState(state.isTeller);

  // 룰렛 표시 여부에 사용되는 상태
  const [isRoulette, setIsRoulette] = useState(false);
  const [isRouletteResult, setIsRouletteResult] = useState(false);
  // 채팅 표시를 위해 사용되는 상태
  const [totalChat, setTotalChat] = useState([]);
  // 음소거 아이콘 변경에 사용되는 상태
  const [isMuted, setIsMuted] = useState(false);
  // 비디오 끄기, 켜기에 사용되는 상태
  const [isVideoOff, setIsVideoOff] = useState(true);

  // 유저 닉네임 보여주는 상태
  const [hostInfo, setHostInfo] = useState({});
  const [debaterInfo, setDebaterInfo] = useState({});
  const [jurorInfo, setJurorInfo] = useState([]);

  // 게임 결과 보여주는 상태
  const [isVoteEnd, setIsVoteEnd] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [isLoser, setIsLoser] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [winnerNick, setWinnerNick] = useState("");

  // 찬성, 반대에 따라 유저 div 색상 지정
  const [hostDivDesign, setHostDivDesign] = useState("bg-black");
  const [debaterDivDesign, setDebaterDivDesign] = useState("bg-black");

  /*   // 유저 로딩 창 만들기
  const countReadyBox = () => {
    // const count = 5 - userNickname.length;
    const count = 5 - jurorInfo.length;
    console.log(count);
    return Array(count).fill(<Lottie animationData={lottie.loading} />);
  };
  // 유저 로딩 창 결과 캐싱
  const readyBox = useMemo(countReadyBox, [jurorInfo]); */

  // 룰렛 React DOM을 point하기 위한 Ref
  const roulette = useRef(null);
  // 비디오 부분 React DOM을 point하기 위한 Ref
  const myVideoBox = useRef(null);
  const yourVideoBox = useRef(null);
  // 채팅 전송을 위한 Ref
  const chatInputValue = useRef("");

  // BackEnd에 카테고리별 주제 받아오는 Ref
  const titleList = useRef([]);

  // ************************************************ 채팅 창 스크롤 최신 채팅으로 맞추기
  const chatContainerRef = useRef(null);

  const scrollToRecent = () => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToRecent();
  }, [totalChat]);
  // ***************************************************************************

  // ************************************************* 진행상황 바 표시 및 프롬프트 관련
  const [isStartGame, setIsStartGame] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);

  const startGameSignalHandler = () => {
    setIsStartGame(true);
  };

  const endGameSignalHandler = () => {
    setIsStartGame(false);
    setIsGameEnd(true);
    socket.emit("voteStart", roomNumber, categoryCode);
  };
  // **************************************************************************

  // ****************************************************************** 소켓 부분
  // [Start] 소켓 연결 : useSocket
  //서버와 연결된 소켓 캐싱
  const socket = useMemo(useSocket, []);

  /* 0. 소켓 연결 성공 시 : 방에 입장
  - 토론자일 시 : joinDebate 이벤트 밣생
  - 배심원일 시 : joinJuror 이벤트 발생 */
  // socket.on("connect", () => {
  useEffect(() => {
    if (!isTeller) {
      socket.emit("joinJuror", roomNumber, categoryCode, () => {
        setIsFirstLoading(false);
      });
    } else {
      socket.emit("joinDebate", roomNumber, categoryCode, (msg) => {
        // LoginError : 카카오로그인 안한 유저가 토론자로 참여시 에러 발생
        if (msg) {
          alert(`Error : ${msg}`);
          navigate("/roomlist", { state: [categoryName, categoryCode] });
        }
        setIsFirstLoading(false);
      });
    }
  }, []);
  // });

  // 2. 채팅
  // 2 - 1. 내 채팅 내용 화면에 띄어줌, 채팅 상대방에게 전송
  const chatSubmitHandler = (event) => {
    event.preventDefault();
    const myChat = chatInputValue.current.value;
    socket.emit("new_message", myChat, roomNumber, () => {
      console.log("채팅이 보내졌습니다!");
    });
    setTotalChat([...totalChat, `You: ${myChat}`]);
    chatInputValue.current.value = "";
  };

  // 2 - 2. 상대 방이 보낸 채팅 가져와서 화면에 표기
  socket.on("new_chat", (chat) => {
    setTotalChat([...totalChat, chat]);
  });

  // 3. 룰렛

  // 룰렛 그려주는 함수 - useEffect()
  useRoulette({ isRoulette, titleList, roulette, title });

  // 3 - 1 - 1. 게임 시작 버튼 클릭 시 룰렛 보여주는 이벤트 전송
  const gameStartBtnClickHandler = () => {
    console.log("버튼이 클릭되었습니다.");
    socket.emit("show_roulette", true, categoryCode, (msg) => {
      if (msg) {
        alert(`${msg}`);
        return;
      }
      console.log("룰렛이 생성되었습니다.");
    });
  };

  // 3 - 2 - 1.룰렛 애니메이션 시작 이벤트 전송
  const setTitleBtnClickHandler = () => {
    socket.emit("start_roulette", roomNumber, categoryCode);
  };

  /* 룰렛 애니메이션 작동하는 함수 
  - 시작점 : start_roulette 이벤트 수신 시
  */
  let currentTitle;
  const setTitleFunc = async (ran) => {
    currentTitle = titleList.current[ran];
    const canvas = roulette.current;
    console.log(canvas);
    canvas.style.transform = `initial`;
    canvas.style.transition = `initial`;
    console.log(canvas.style.transform);
    console.log(canvas.style.transition);

    // 룰렛 애니메이션 작동안하는 이유 : 초기화 후 순차적으로 진행 필요? setTimeout 적용하니 해결됨
    setTimeout(() => {
      const arc = 360 / titleList.current.length;
      const rotate = ran * arc + 3600 + arc * 3 - arc / 2;
      console.log(rotate);

      canvas.style.transform = `rotate(-${rotate}deg)`;
      canvas.style.transition = `2s`;

      setTimeout(() => {
        setTitle(currentTitle);
        setIsRouletteResult(true);
      }, 2000);
    }, 1);
  };

  // 3 - 3 - 1. 결과창 닫기 이벤트 시작 - Retry Button
  const closeResultModal = () => {
    socket.emit("close_result", false, roomNumber);
    socket.emit("close_roulette", false, roomNumber, () => {
      console.log("주제가 확정되었습니다. 게임이 시작됩니다!");
    });
  };

  // 3 - 4 - 1. 룰렛 닫기 이벤트 시작 - Start Button
  const closeRouletteModal = () => {
    socket.emit("close_result", false, roomNumber, categoryCode, () => {
      console.log("주제가 확정되었습니다. 게임이 시작됩니다!");
    });
  };

  // 4. 유저 나갔을 시 발생하는 알람
  socket.on("roomLeft", (nickname) => {
    setTotalChat([...totalChat, `Alarm : ${nickname}님이 나가셨습니다.`]);
  });

  // 5 - 1. Debator 1 투표 시
  const voteFirstPersonHandler = () => {
    socket.emit("vote", roomNumber, 1, categoryCode);
    setIsGameEnd(false);
  };

  // 5 - 2. Debator 2 투표 시
  const voteSecondPersonHandler = () => {
    socket.emit("vote", roomNumber, 0, categoryCode);
    setIsGameEnd(false);
  };

  // 나가기 버튼 클릭 시 실행되는 함수
  const gameOutBtnClick = async () => {
    if (window.confirm("이 게임방에서 나가실건가요?") === true) {
      socket.emit("leave_room", () => {
        socket.disconnect();
        navigate("/roomlist", {
          state: { categoryName, categoryCode },
        });
      });
    }
  };

  // 단밣성 이벤트
  useEffect(() => {
    // 1. 방에 입장한 유저 닉네임 리스트 받아오기
    socket.on("roomJoined", (data) => {
      const jurorList = [];
      let debaterList = {};
      let hostList = {};
      data.forEach((userInfo) => {
        const { host, debater } = userInfo;
        if (!debater) {
          jurorList.push({
            nickName: userInfo.nickName,
            avatar: JSON.parse(userInfo.avatar),
          });
        }
        if (host && debater) {
          hostList = {
            nickName: userInfo.nickName,
            avatar: JSON.parse(userInfo.avatar),
          };
        } else if (!host && debater) {
          debaterList = {
            nickName: userInfo.nickName,
            avatar: JSON.parse(userInfo.avatar),
          };
        }
      });
      setJurorInfo(jurorList);
      setHostInfo(hostList);
      setDebaterInfo(debaterList);
    });

    // 3 - 1 - 1. 룰렛 보여주는 이벤트 수신 후 룰렛 보여줌
    socket.on("show_roulette", (titleListFromBack, result) => {
      titleList.current = [...titleListFromBack];
      setIsRoulette(result);
    });

    //currentTitle, titleList, roulette, ran, setTitle, setIsRouletteResult
    // 3 - 2 - 2. 룰렛 애니메이션 시작 이벤트 수신 후 룰렛 애니메이션 시작
    socket.on("start_roulette", (randomSubjectIndex) => {
      console.log(roulette.current);
      // 룰렛 애니메이션 함수
      setTitleFunc(randomSubjectIndex);
    });

    // 3 - 3 - 2. 이벤트 수신 후 결과 창 닫기
    socket.on("close_result", (result) => {
      setIsRouletteResult(result);
    });

    const setDebaterPosition = (debatersInfo) => {
      if (!debatersInfo) {
        console.log("찬성/반대에 대한 정보가 전달되지 않았습니다.");
      }
      const hostPosition = debatersInfo[0];
      if (hostPosition.debatePosition === 1) {
        setHostDivDesign("bg-[#14B5FF]");
        setDebaterDivDesign("bg-[#FA3C3C]");
        console.log("호스트 찬성");
      } else {
        setHostDivDesign("bg-[#FA3C3C]");
        setDebaterDivDesign("bg-[#14B5FF]");
        console.log("호스트 반대");
      }
    };
    // 3 - 4 - 2. 이벤트 수신 후 룰렛 닫기
    socket.on("close_roulette", (result, debatersInfo) => {
      console.log(debatersInfo);
      setIsRoulette(result);
      setDebaterPosition(debatersInfo);
      setTimeout(startGameSignalHandler, 1000);
    });

    // 5. 호스트 변경 발생
    socket.on("changeHost", (id) => {
      const { userId } = jwt_decode(localStorage.getItem("Authorization"));
      if (userId === id) {
        setIsHost(true);
      }
    });

    // 6. 투표 결과 받기
    socket.on("voteResult", (result, done) => {
      setIsVoteEnd(true);
      setWinnerNick(result.winnerNickName);
      /*
      case 1 : 무승부
      object = {
        debater1: debaterUser1.userId,
        debater1Count: voteRecord.debater1Count,
        debater2: debaterUser2.userId,
        debater2Count: voteRecord.debater2Count,
      }
      */
      if (!result.winner) {
        setIsDraw(true);
        done();
      } else {
        /*
      case 2 : 승자 / 패자 있는 경우
      object = {
        winner: winner.userId,
        winnerCount: winnerCount,
        loser: loser.userId,
        loserCount: loserCount,
      }
      */
        const { userId: myUserId } = jwt_decode(
          localStorage.getItem("Authorization")
        );
        console.log(myUserId);
        if (result.winner === myUserId) {
          setIsWinner(true);
        }
      }
      setDebaterDivDesign("bg-black");
      setHostDivDesign("bg-black");
    });

    // 7. 토론에서 진 유저 추방하기
    socket.on("loserExit", (exitUserId) => {
      const { userId } = jwt_decode(localStorage.getItem("Authorization"));
      if (userId === exitUserId) {
        socket.disconnect();
        setIsLoser(true);
      }
    });
  }, []);

  // 뒤로가기 막기
  useNotGoBack(state);
  // ******************************************************************************

  // ********************************************************************** Web RTC

  // 내 오디오 음소거 함수
  const muteClickHandler = async () => {
    (await myStream)
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
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
    }, 0);
  }, [isMuted, isVideoOff, myStream]);
  // *******************************************************************************

  // ********************************************************************************

  // 룰렛 표시 관련 css
  const showRoullete = isRoulette
    ? { visibility: "visible" }
    : { display: "none" };

  const goHomeBtnClickHandler = () => {
    socket.disconnect();
    navigate("/");
  };

  const continueGameBtnClickHandler = () => {
    setIsVoteEnd(false);
    setIsDraw(false);
    setIsWinner(false);
    setIsLoser(false);
  };

  return (
    <div className="relative flex gap-3 w-[100vw] h-[100vh] bg-black">
      {/* ========================================= 로딩 모달 창 ================================================ */}
      {isFirstLoading && (
        <div className="absolute flex justify-center items-center w-[100vw] h-[100vh] top-0 left-0 bg-black z-[3]">
          <div className="flex flex-col items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
            <Lottie
              className="w-[80%] h-[80%]"
              animationData={lottie.gameLoading}
            />
            <p className="text-white text-[3vmin] mt-[3vmin]">
              말 많은 사람들을 모으고 있어요...
            </p>
          </div>
        </div>
      )}
      {/* =================================================================================================== */}

      {/* ========================================= 룰렛 모달 ================================================ */}
      <div
        style={showRoullete}
        className="absolute flex justify-center items-center w-[100vw] h-[100vh] top-0 left-0 bg-slate-200/40 z-[3]"
      >
        <div className="relative flex justify-center items-center w-[75vmin] h-[75vmin] z-[3]">
          <canvas
            ref={roulette}
            className="w-[90%] h-[90%] border-[2px] border-[#5523BE] outline outline-[2.2vh] outline-[#7A48DE] rounded-[100%]"
            width="450px"
            height="450px"
          />
          <div className="absolute flex flex-col justify-center items-center gap-[1vmin] w-[20%] h-[20%] bg-black rounded-full z-[4]">
            <button
              onClick={setTitleBtnClickHandler}
              disabled={!isHost}
              className=" text-white text-[3vmin] font-semibold"
            >
              START!
            </button>
          </div>
          <div className="absolute w-fit h-fit top-0 left-[50%] translate-x-[-50%] z-[4]">
            <icon.RoulettePin className="w-[10vmin] h-[10vmin]" />
          </div>
        </div>
      </div>
      {/* ============================================================================================== */}

      {/* ========================================== 룰렛 결과 모달 창 ======================================== */}
      {isRouletteResult ? (
        <div className="absolute flex justify-center items-center w-[100vw] h-[100vh] top-0 left-0 bg-slate-200/40 z-[3]">
          <div className="absolute flex flex-col justify-center items-center w-fit h-[21.91%] p-[2.5%] top-[50%] translate-y-[-50%] z-[5] bg-[#2F3131] rounded-[16px]">
            <div className="flex flex-col items-center">
              <p className="text-[2.26vh] text-[white] font-bold">
                토론 주제가 선정되었어요.
              </p>
              <div className="flex items-center w-full text-[#EFFE37] text-[1.76vh] font-bold mt-[2.13%]">
                <icon.IconOnly className="h-[1.76vh]" />
                &nbsp;&nbsp;
                {title}
              </div>
              <p className="text-[1.76vh] text-[#C6C6C6] mt-[2.13%]">
                이 창은 3초후에 닫힙니다.
              </p>
            </div>
            <div className="flex justify-evenly w-full mt-[2.01vh] gap-[0.63vw]">
              {isHost && (
                <>
                  <button
                    className="w-[50%] bg-[#D73232] px-[5%] py-[1.34vh] text-[1.5vh] text-white font-bold rounded-[1.34vh]"
                    onClick={closeRouletteModal}
                  >
                    다시 돌리기
                  </button>
                  <button
                    className="w-[50%] bg-[#EFFE37] px-[5%] py-[1.34vh] text-[1.5vh] font-bold rounded-[1.34vh]"
                    onClick={closeResultModal}
                  >
                    토론 시작하기
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
      {/* ============================================================================================== */}

      {/* ========================================== 투표 모달 창 ================================================ */}
      {isGameEnd && !isTeller && (
        <div className="absolute flex justify-center items-center w-[100vw] h-[100vh] top-0 left-0 bg-slate-200/40 z-[3]">
          <div className="absolute top-[50%] left-[50%] flex flex-col items-center w-fit h-[33.33%] p-[4.01vh] bg-[#2F3131] rounded-[16px] z-[4] translate-y-[-50%] translate-x-[-50%]">
            <p className="text-[2.26vh] text-white font-bold">투표해주세요.</p>
            <p className="text-[2.01vh] text-[#EFFE37] font-bold mt-[3.43vh]">
              {title}
            </p>
            <p className="text-[1.76vh] text-[#C6C6C6] mt-[3.43vh]">
              투표가 30초 남았습니다.
            </p>

            <div className="flex w-full h-[10%] justify-between mt-[2.01vh]">
              <div
                onClick={voteFirstPersonHandler}
                className={
                  hostDivDesign +
                  " flex flex-col justify-between items-center w-[45%] h-[7.02vh] px-[1.77vw] py-[0.67vh] text-white font-bold rounded-[16px] cursor-pointer"
                }
              >
                <div className="flex w-full">
                  <Avatar size="2.68vh" />
                  <div className="flex flex-col justify-center ">
                    <div className="w-full text-[1.34vh] whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {hostInfo.nickName}
                    </div>
                  </div>
                </div>
                <p>에게 투표</p>
              </div>
              <div
                onClick={voteSecondPersonHandler}
                className={
                  debaterDivDesign +
                  " flex flex-col justify-between items-center w-[45%]  h-[7.02vh] px-[1.77vw] py-[0.67vh] text-white font-bold rounded-[16px] cursor-pointer"
                }
              >
                <div className="flex w-full">
                  <Avatar size="2.68vh" />
                  <div className="w-full border flex flex-col justify-center whitespace-nowrap overflow-hidden overflow-ellipsis">
                    <div className="text-[1.34vh] whitespace-nowrap overflow-hidden overflow-ellipsis">
                      {debaterInfo.nickName}
                    </div>
                  </div>
                </div>
                <p>에게 투표</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ================================================================================================ */}

      {/* ========================================== 게임 결과 모달 창 ================================================ */}
      {isVoteEnd && (
        <div className="absolute flex justify-center items-center w-[100vw] h-[100vh] top-0 left-0 bg-slate-200/40 z-[3]">
          <div className="absolute flex flex-col items-center justify-evenly w-[25.83%] h-[53.43%] p-[4.01vh] bg-[#2F3131]">
            <div className="flex items-center h-[14%]">
              {isTeller ? (
                isDraw ? (
                  <p className="text-[5.52vh] text-[#B484F1] font-bold">DRAW</p>
                ) : isWinner ? (
                  <p className="text-[5.52vh] text-[#EFFE37] font-bold">WIN</p>
                ) : (
                  <p className="text-[5.52vh] text-[#966052] font-bold">LOSE</p>
                )
              ) : isDraw ? (
                <p className="text-[5.52vh] text-[#B484F1] font-bold">DRAW</p>
              ) : (
                <p className="text-[5.52vh] text-white font-bold">FIN</p>
              )}
            </div>
            <p className="w-full h-[2.51vh] text-[2.01vh] text-center text-white font-bold whitespace-between overflow-hidden overflow-ellipsis">
              패배는 다음의 승리를 위한 발돋움일 뿐
            </p>
            <div className="relative w-full h-[39.17%] overflow-hidden">
              {isTeller ? (
                isDraw ? (
                  <icon.DrawIcon className="absolute w-[250%] h-[300%] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]" />
                ) : isWinner ? (
                  <icon.WinIcon className="absolute w-[300%] h-[300%] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]" />
                ) : (
                  <icon.LoseIcon className="absolute w-[300%] h-[300%] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]" />
                )
              ) : isDraw ? (
                <icon.DrawIcon className="absolute w-[300%] h-[300%] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]" />
              ) : (
                <icon.WinIcon className="absolute w-[300%] h-[300%] top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%]" />
              )}
            </div>
            <div className="w-full flex flex-col items-center gap-[2.03%]">
              <p className="w-full text-[#EFFE37] text-[1.76vh] font-medium whitespace-nowrap overflow-hidden overflow-ellipsis">
                {title}
              </p>
              {!isDraw ? (
                <p className="text-[#C6C6C6] text-[1.56vh] font-medium">
                  토론의 승리자는 &nbsp;
                  <span className="text-white font-bold">
                    {winnerNick}
                  </span>{" "}
                  &nbsp;님 입니다.
                </p>
              ) : (
                <p className="text-[#C6C6C6] text-[1.56vh] font-medium">
                  토론은 &nbsp;
                  <span className="text-white font-bold">{"무승부"}</span>{" "}
                  &nbsp;로 끝났습니다.
                </p>
              )}
            </div>
            <div class="flex w-full gap-[2.42%]">
              <button
                onClick={goHomeBtnClickHandler}
                className="w-[50%] p-[2.36%] bg-[#777777] text-[#C6C6C6] font-bold rounded-[1.34vh]"
              >
                홈 화면으로
              </button>
              {!isLoser ? (
                <button
                  onClick={continueGameBtnClickHandler}
                  className="w-[50%] p-[2.36%] bg-[#EFFE37] font-bold rounded-[1.34vh]"
                >
                  계속할래요
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
      {/* ================================================================================================ */}

      {/* ========================================== 게임 창 ================================================ */}
      <div className="flex flex-col gap-[1%] w-[75%] h-full py-[1%] pl-[1%]">
        <div className="flex flex-col gap-[2%] h-[68%] p-[1%] bg-[#1E1E1E] rounded-2xl">
          {/* 1. 주제 */}
          <div className="w-full h-[8%]">
            <div className="flex gap-[0.83vw] w-full h-full items-center justify-center pl-[2vmin] rounded-lg text-white text-[1.76vh] font-medium">
              <icon.GameRoomTitleLogo className="h-[1.76vh]" /> {title}
            </div>
          </div>

          {/* 2. 비디오 */}
          <div className="relative flex justify-between items-center gap-[0.63vw] w-full h-[60%]">
            {/* 비디오 html : srcObject는 내 오디오, 비디오 장비,연결 시 자동으로 Play되는 autoPlay 속성 적용 */}
            {/* playsinline : 모바일 기기가 비디오를 재생할 때 전체화면이 되지 않도록 설정 */}
            <div className="absolute w-[8vmin] h-[8vmin] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[2]">
              <icon.icon_debate_versus width="100%" height="100%" />
            </div>
            <div className="relative w-[50%] h-full bg-black rounded-[4px]">
              {hostInfo.nickName && (
                <TellerIcon userInfo={hostInfo} divDesign={hostDivDesign} />
              )}
              <video
                className="w-full h-full rounded-2xl"
                ref={myVideoBox}
                autoPlay
                playsInline
                muted
              ></video>
            </div>
            <div className="relative w-[50%] h-full bg-black rounded-[4px]">
              {debaterInfo.nickName && (
                <TellerIcon
                  userInfo={debaterInfo}
                  divDesign={debaterDivDesign}
                />
              )}
              <video
                className="  w-full h-full rounded-2xl"
                ref={yourVideoBox}
                autoPlay
                playsInline
                muted
              />
            </div>
          </div>
          {/*----------- Progress bar --------- */}
          <div className="relative flex flex-col justify-evenly items-center w-full h-[32%] rounded-2xl text-white">
            <div className="flex w-full justify-evenly items-center">
              {isStartGame ? (
                <Progressbar endGameSignalHandler={endGameSignalHandler} />
              ) : (
                <>
                  <div className="w-full px-[2.97vw]">
                    <div className="bg-[#2F3131] w-full h-[3px] translate-y-[50%] rounded-full"></div>
                  </div>
                </>
              )}
            </div>
            {/*---------------------------------- */}

            {/*-------------- 프롬프트 --------------*/}
            <div className="flex justify-center items-center w-full h-[50%] text-[#C6C6C6] rounded-2xl text-[1.59vh]">
              {isStartGame ? (
                <Prompt title={title} />
              ) : (
                <div className="flex flex-col text-center">
                  <p>아래 시작 버튼을 눌러 시작해주세요!</p>
                  <p className="text-[#EFFE37]">
                    단, 토론자 2명과 배심원이 적어도 1명 들어와야 시작이
                    가능합니다.
                  </p>
                </div>
              )}
            </div>
            {/*------------------------------------*/}
          </div>
        </div>
        {/*----------- 주제 + 비디오 ---------- */}

        {/*-------------- 배심원 창 --------------*/}
        <div className="flex items-center w-full h-[3%] gap-[0.42vw] text-[1.5vh] text-white font-medium">
          <icon.UserIcon className="h-[1.5vh]" />
          <p>배심원</p>
          <p>({jurorInfo.length}/5)</p>
        </div>
        <div className="grid grid-cols-5 grid-rows-1 w-full h-[15%] gap-2">
          {jurorInfo &&
            jurorInfo.map((userInfo) => {
              const { nickName, avatar } = userInfo;
              return (
                <UserBox key={nickName} nickname={nickName} avatar={avatar} />
              );
            })}
        </div>
        {/*-------------------------------------*/}
        <div className="flex w-full h-[5%]">
          {/* 3. 게임시작 */}
          {isHost && (
            <button
              onClick={gameStartBtnClickHandler}
              disabled={
                !(
                  hostInfo.nickName &&
                  debaterInfo.nickName &&
                  jurorInfo.length !== 0
                )
              }
              className="flex justify-center items-center w-[20%] h-full bg-[#EFFE37] rounded-full ml-auto text-[2.01vh] font-semibold disabled:bg-[#919191] disabled:text-[#505050]"
            >
              <p>시작</p>
              {hostInfo.nickName &&
              debaterInfo.nickName &&
              jurorInfo.length !== 0 ? (
                <icon.ArrowRight className="h-[3vh]" />
              ) : (
                <icon.ArrowRightDisabled className="h-[3vh]" />
              )}
            </button>
          )}
        </div>
        {/*------------- 기능 버튼들 ------------*/}
        <div className="flex justify-between w-full h-[7%] px-[1%]">
          <div className="flex w-[40%] gap-[8%]">
            {/* 1. 비디오 켜기/끄기 */}
            {isTeller && (
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
            )}

            {/* 2. 오디오 켜기/끄기 */}
            {isTeller && (
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
            )}
          </div>

          {/* 4. 방 나가기 */}
          <div className="flex">
            <button
              className="text-white my-2 ml-auto"
              onClick={gameOutBtnClick}
            >
              <icon.Exit width="8vh" height="100%" />
            </button>
          </div>
        </div>
        {/*--------------------------------------------*/}
      </div>
      {/* =============================================================================================== */}

      {/* ========================================= 채팅 박스 ================================================ */}
      <div className="flex w-[25%] flex-col my-[1%]">
        <div className="w-full h-[5%] px-[1.34vh] pt-[1.34vh] bg-[#1B1B1B] text-white text-[2vmin] rounded-t-[12px]">
          <p className="w-fit">채팅</p>
        </div>
        <form
          className="flex flex-col ml-auto  w-full h-[95%] px-[1.34vh] pb-[1.34vh] bg-[#1B1B1B] rounded-b-[12px]"
          onSubmit={chatSubmitHandler}
        >
          <div
            ref={chatContainerRef}
            className="h-[95%] break-words overflow-x-hidden overflow-y-auto "
          >
            {/* ul tag의 이름으로 nickName state를 배열로 만들어 마지막 값이 들어오도록 */}
            <ul>
              {totalChat?.map((chat, index) => {
                if (chat.split(":")[0] === "You") {
                  return (
                    <li
                      key={index}
                      className="w-fit max-w-[80%] ml-auto bg-[#2F3131] px-[0.5vh] mt-[0.5vh] text-[#C6C6C6] text-[1.7vh] rounded-[1vh]"
                    >
                      {chat.split(":")[1]}
                    </li>
                  );
                }
                return (
                  <li
                    key={index}
                    className="w-fit max-w-[80%] bg-[#2F3131] text-[#C6C6C6] text-[1.7vh] mt-[0.5vh] px-[0.5vh] rounded-[1vh]"
                  >
                    {chat}
                  </li>
                );
              })}
            </ul>
          </div>
          {/* <div className="flex w-full h-[5%] border border-[#C6C6C6] gap-[10px] p-2 mt-2 rounded-2xl active:outline-[2px] active:outline-[#D7E33B]"> */}
          <input
            className="w-full h-[5%] px-[1.17vh] border border-[#C6C6C6] rounded-2xl bg-[#1B1B1B] text-white text-[1.17vh] font-medium focus:outline-[2px] focus:outline-[#D7E33B] focus:border focus:border-transparent"
            ref={chatInputValue}
            type="text"
            required
            placeholder="메세지를 입력해주세요"
          />
          {/* </div> */}
        </form>
      </div>

      {/* ==============================================================================================*/}
    </div>
  );
}

export default GameRoom;

// 배심원으로 들어온 유저 보여주는 컴포넌트
function UserBox({ nickname, avatar }) {
  return (
    <div className="relative flex flex-col h-full rounded-lg text-white justify-center items-center text-[2vmin]">
      <Avatar
        size="6vh"
        name={avatar.name}
        variant="beam"
        colors={avatar.color[0].split(",")}
      />
      <div className="w-full text-[2vmin] mt-[1vmin] text-center whitespace-nowrap overflow-hidden overflow-ellipsis">
        {nickname}
      </div>
    </div>
  );
}

// 빈 배심원 자리에 보여주는 컴포넌트
/* function UserLoadingBox() {
  return (
    <div className="flex flex-col h-full text-white justify-center items-center text-[2vmin] overflow-hidden">
      <div className="w-[6vmin] h-[6vmin] rounded-full bg-gray-300"></div>
      <div className="w-full h-[2vmin] mt-[1vmin] text-center whitespace-nowrap overflow-hidden overflow-ellipsis bg-gray-300"></div>
    </div>
  );
} */

// 토론자 및 호스트 유저아이콘 컴포넌트
function TellerIcon({ userInfo, divDesign }) {
  return (
    <div
      className={
        divDesign +
        " absolute w-full h-[17.58%] flex justify-between items-center bottom-0 z-[2]"
      }
    >
      <div className="flex items-center gap-[1.59%] ml-[1.59%]">
        <Avatar
          name={userInfo.avatar.name}
          variant="beam"
          colors={userInfo.avatar.color[0].split(",")}
          className="h-[2.67vh]"
        />
        <div className="w-full text-center whitespace-nowrap overflow-hidden overflow-ellipsis text-[1.34vh] text-white font-bold">
          {userInfo.nickName}
        </div>
      </div>

      <div className="flex gap-[0.83vw] text-[1.17vh] text-white font-medium mr-[1.59%]">
        <div className="flex flex-col gap-[0.41vh] items-center">
          <icon.likeButton className="h-[2.01vh] cursor-pointer" />0
        </div>
        <div className="flex flex-col gap-[0.41vh] items-center">
          <icon.hateButton className="h-[2.01vh] cursor-pointer" />0
        </div>
        <div className="flex flex-col gap-[0.41vh] items-center">
          <icon.whyButton className="h-[2.01vh] cursor-pointer" />0
        </div>
      </div>
    </div>
  );
}
