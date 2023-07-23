import React from "react";
import Lottie from "lottie-react";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "boring-avatars";
import jwt_decode from "jwt-decode";

import { useRoulette } from "../util/useRoulette";
import { useNotGoBack } from "../util/useNotGoBack";
import { useSocket, useMediaSocket } from "../util/useSocket";
import { decrypt } from "../util/cryptoJs";

import Prompt from "../components/feature/Prompt";
import Progressbar from "../components/feature/Progressbar";

import lottie from "../lottie";
import icon from "../icons";

import * as mediasoupClient from "mediasoup-client";

function GameRoom() {
  const navigate = useNavigate();

  ///////////////////////////// 미디어스프 변수선언////////////////////////////

  //방 구분
  const roomName = window.location.pathname.split("/")[2];

  //비디오ref
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  let device;
  let rtpCapabilities;
  let producerTransport;
  let consumerTransports = [];
  let audioProducer;
  let videoProducer;
  // let consumer;
  // let isProducer = false;

  let params = {
    // mediasoup params
    encodings: [
      {
        rid: "r0",
        maxBitrate: 100000,
        scalabilityMode: "S1T3",
      },
      {
        rid: "r1",
        maxBitrate: 300000,
        scalabilityMode: "S1T3",
      },
      ////필요없어보이는데
      {
        rid: "r2",
        maxBitrate: 900000,
        scalabilityMode: "S1T3",
      },
      //consumer rtpParameters.encodings 예시
      { ssrc: 222220, scalabilityMode: "L4T3" },
    ],
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#ProducerCodecOptions
    codecOptions: {
      videoGoogleStartBitrate: 1000,
    },
  };

  let audioParams;
  let videoParams = { params };
  let consumingTransports = [];

  ////////////////////////////////미디어스프 변수선언끝////////////////////////////////

  const state = useMemo(() => decrypt(sessionStorage.getItem("userData")), []);

  let { roomNumber, defaultTitle, categoryName, categoryCode } = state;

  const [isFirstLoading, setIsFirstLoading] = useState(true);
  // 타이틀 설정 시 사용되는 상태
  const [title, setTitle] = useState(defaultTitle);
  // 호스트 변경 시 사용
  const [isHost, setIsHost] = useState(false);
  // 배심원이 토론자로 변경될 시 사용할 예정
  const isTeller = useMemo(() => state.isTeller, [state.isTeller]);
  // const [isTeller, setIsTeller] = useState(state.isTeller);

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
  // 1. 방장 정보
  const [hostInfo, setHostInfo] = useState({});
  // 2. 토론자 정보
  const [debaterInfo, setDebaterInfo] = useState({});
  // 3. 배심원들 정보
  const [jurorInfo, setJurorInfo] = useState([]);

  // 게임 결과 보여주는 상태
  const [isVoteEnd, setIsVoteEnd] = useState(false);
  const [winnerNick, setWinnerNick] = useState("");
  const [isWinner, setIsWinner] = useState(false);
  const [isLoser, setIsLoser] = useState(false);
  const [isDraw, setIsDraw] = useState(false);

  // 찬성, 반대에 따라 유저 div 색상 지정
  const [hostDivDesign, setHostDivDesign] = useState("bg-black");
  const [debaterDivDesign, setDebaterDivDesign] = useState("bg-black");

  // 투표 시 남은 시간 설정
  const [remainTime, setRemainTime] = useState("30");

  // 룰렛 React DOM을 point하기 위한 Ref
  const roulette = useRef(null);
  // // 비디오 부분 React DOM을 point하기 위한 Ref
  // const myVideoBox = useRef(null);
  // const yourVideoBox = useRef(null);
  // 채팅 전송을 위한 Ref
  const chatInputValue = useRef("");

  // BackEnd에 카테고리별 주제 받아오는 Ref
  const titleList = useRef([]);

  // 뒤로가기 막기 & 새로고침 시 게임진행 중이면 잘못된 접속으로 홈페이지로 이동
  useNotGoBack(state);
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
  // 프로그레스 바 진행 관련 상태
  const [isStartGame, setIsStartGame] = useState(false);
  // 투표 창 보여주는 상태
  const [isGameEnd, setIsGameEnd] = useState(false);

  // 게임 시작
  const startGameSignalHandler = () => {
    setIsStartGame(true);
  };

  // 게임 종료
  const endGameSignalHandler = () => {
    setIsStartGame(false);
    setIsGameEnd(true);
    socket.emit("voteStart", roomNumber, categoryCode, () => {
      setIsGameEnd(false);
    });
  };
  // **************************************************************************

  // ****************************************************************** 소켓 부분
  // [Start] 소켓 연결 : useSocket
  //서버와 연결된 소켓 캐싱
  const socket = useMemo(useSocket, []);

  const mediaSocket = useMediaSocket();
  /* 0. 소켓 연결 성공 시 : 방에 입장
  - 토론자일 시 : joinDebate 이벤트 밣생
  - 배심원일 시 : joinJuror 이벤트 발생 */
  // socket.on("connect", () => {
  useEffect(() => {
    if (!isTeller) {
      console.log("채팅에서 배심원");
      socket.emit("joinJuror", roomNumber, categoryCode, () => {
        setIsFirstLoading(false);
      });
    } else {
      console.log("채팅에서 발언자");
      socket.emit("joinDebate", roomNumber, categoryCode, (msg) => {
        // LoginError : 카카오로그인 안한 유저가 토론자로 참여시 에러 발생
        if (msg) {
          alert(`Error : ${msg}`);
          navigate("/roomlist", { state: [categoryName, categoryCode] });
        }
        setIsFirstLoading(false);
      });
    }
  }, [categoryCode, categoryName, isTeller, navigate, roomNumber, socket]);

  //////미디어스프 시작- 발언자와 배심원 구분해서 로직시작////////////

  const newDebate = async () => {
    mediaSocket.on("connection-success", ({ socketId }) => {
      console.log("토론자 소켓::", socketId);
      getLocalStream();
    });
  };

  const newJuror = async () => {
    mediaSocket.on("connection-success-juror", ({ socketId }) => {
      console.log("배심원 소켓:::::::::", socketId);
      newJurorRTPcreate();
    });
  };

  useEffect(() => {
    if (!isTeller) {
      console.log("화상채팅 배심원");
      //배심원일 때 실행되는 함수
      newJuror();
    } else {
      //발언자일 때 실행되는 함수
      newDebate();
      console.log("화상채팅 발언자입니다-------------------");
    }
  }, [isTeller]);

  const getLocalStream = () => {
    // Get local stream logic
    console.log("---------------1. localstream 생성", navigator.mediaDevices);
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(streamSuccess)
      .catch((error) => {
        console.log(error);
      });
  };

  //오디오 및 비디오 받아오기
  const streamSuccess = (stream) => {
    console.log("1-2 스트림", stream);

    localVideoRef.current.srcObject = stream;

    audioParams = { track: stream.getAudioTracks()[0], ...audioParams };
    videoParams = { track: stream.getVideoTracks()[0], ...videoParams };

    //방 입장 실행

    console.log("joinRoom 직전 콘솔이지롱~");
    joinRoom();
  };

  //방생성 보내기 (라우터(/server) + (1) RTP Capabilities + (2) Device + (3) transport생성)

  const joinRoom = () => {
    console.log("2. 방 입장");

    mediaSocket.emit("joinRoom", { roomName }, (data) => {
      console.log("2-1. 방 이름은?", roomName);
      try {
        console.log("2-2 룸네임뭐야", roomName);
        console.log("2-3 Router RTP Capabilities", data.rtpCapabilities);
        // local변수에 할당
        // the client Device를 loading할 때 사용 (see createDevice)
        //mediasoup 또는 엔드포인트가 미디어 수준에서 수신할 수 있는 것을 정의
        rtpCapabilities = data.rtpCapabilities;

        createDevice();
        console.log("2-4. 디바이스 생성 완료");
      } catch (error) {
        console.log("joinRoom 소켓 에러");
        console.log(error);
        console.log("-----------");
      }
    });
  };

  // (2)
  // device는 미디어를 전송/수신하기 위해
  // 서버 측의 라우터에 연결하는 엔드포인트입니다.
  const createDevice = async () => {
    console.log("3. Device 만들기 실행 시작");
    try {
      device = new mediasoupClient.Device();

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // 라우터(서버 측)의 RTP 기능이 있는 장치를 로드합니다
      await device.load({
        // see getRtpCapabilities() below
        routerRtpCapabilities: rtpCapabilities,
      });

      console.log("3-1. Device RTP Capabilities = ", device.rtpCapabilities);

      // (3)
      // device가 한번 load되면 , transport 생성
      createSendTransport();
    } catch (error) {
      console.log(error);
      if (error.name === "UnsupportedError")
        console.warn("browser not supported");
    }
  };

  ///////////여기까지 프로듀서 확인

  // (3) 서버쪽에서 프로듀서 트랜스포트가 만들어지면 이제 클라이언트 프로듀서 Transport 생성
  const createSendTransport = () => {
    console.log("4. 프로듀서 트랜스포트만들기 시작  params = ", params);
    // 서버에 params 를 콜백받으면은 로컬프로듀서 생성되서 프로듀서와 커넥트 이벤트발생
    mediaSocket.emit(
      "createWebRtcTransport",
      { consumer: false },
      ({ params }) => {
        // params에 방정보 (라우터) 추가해서 다시보내줌

        // 만약 받은 params에 문제가 있다면..
        if (params.error) {
          console.log("에러", params.error);
          return;
        }

        console.log("4-1. transport 정상 생성..", params);

        // client side의 Producer Transport 생성
        // 서버에서 다시 받은 params기반으로 생성됨
        producerTransport = device.createSendTransport(params);
        console.log("4-2. server에서 params 받아옴 = ", params);
        // 이 이벤트는 transport.products에 대한 첫 번째 호출이 이루어질 때 발생
        // see connectSendTransport() below

        //Transport connect 시켜달라고 서버에 요청
        producerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              // DTLS parameters를 서버로 보내줌
              // 그럼 서버가 soketId와 dtlsParmeters를 연결시켜줌 (transport connect)
              mediaSocket.emit("transport-connect", {
                dtlsParameters,
              });
              console.log("5. transport connect 요청 / dtl = ", dtlsParameters);

              // 매개변수가 변경되었음을 알림
              callback();
            } catch (error) {
              errback(error);
            }
          }
        );

        //producer의 transport가 연결되면은
        producerTransport.on(
          "produce",
          async (parameters, callback, errback) => {
            console.log("5. 프로듀스 파라미터스 = ", parameters);

            try {
              // Producer 생성 알림
              // with the following parameters and produce
              // 서버에게 producer id 전송
              // 그럼 서버가 room에 prodcuer id 추가함
              mediaSocket.emit(
                "transport-produce",
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id, producersExist }) => {
                  // Tell the transport that parameters were transmitted and provide it with the
                  // 다시 producer id와  producersExist 을 확인해서 보내줌
                  // (producersExist) : 방에 처음 생긴 producer인지 추가된사람인지 알려줌

                  callback({ id });
                  console.log("5. 콜백 받은 아이디 = ", id);
                  // if producers exist, then join room
                  console.log("producersExist = ", producersExist);
                  if (producersExist) getProducers(); // 첫 producer(방만든사람)일경우 실행
                }
              );
            } catch (error) {
              errback(error);
            }
          }
        );

        connectSendTransport();
      }
    );
  };

  // producer transport를 이용하여 media를 보내기위한 produce() 요청
  const connectSendTransport = async () => {
    // Router에 media 전송
    // 이것은 the 'connect' & 'produce' 이벤트를 유도
    console.log("6. 'connect' & 'produce' 이벤트를 유도 ");
    audioProducer = await producerTransport.produce(audioParams);
    videoProducer = await producerTransport.produce(videoParams);

    audioProducer.on("trackended", () => {
      console.log("audio track ended");
      console.log("오디오트랙????????");
      // close audio track
    });

    audioProducer.on("transportclose", () => {
      console.log("audio transport ended");

      // close audio track
    });

    videoProducer.on("trackended", () => {
      console.log("video track ended");

      // close video track
    });

    videoProducer.on("transportclose", () => {
      console.log("video transport ended");

      // close video track
    });
  };

  //////////////////컨슈머 기능시작////////////////////////
  // 방에 이미 producer가 있는 경우, producer id 정보들을 가져옴
  const getProducers = () => {
    console.log("7. producer 존재");
    mediaSocket.emit("getProducers", (producerIds) => {
      //producer의 모든 Id 가져옴
      console.log("7. 기존프로듀서아이디", producerIds);
      // new producer에 대한 consumer 각각 생성
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach(signalNewConsumerTransport); // produce Id에 대하여 각각의 consumer을 생성
    });
  };

  //1번 rtp 요청 - 콜백으로 받기
  const newJurorRTPcreate = () => {
    mediaSocket.emit("newJuror", { roomName }, (data) => {
      // rtp capability 발급
      try {
        console.log("소비자 Router RTP Capabilities...", data.rtpCapabilities);
        // local변수에 할당
        // the client Device를 loading할 때 사용 (see createDevice)
        rtpCapabilities = data.rtpCapabilities;

        // (2)
        newJurorCreateDevice();
      } catch (error) {
        console.log("joinRoom 소켓 에러");
        console.log(error);
        console.log("-----------");
      }
    });
  };

  //2번  클라이언트 컨슈머쪽 디바이스 생성
  const newJurorCreateDevice = async () => {
    try {
      device = new mediasoupClient.Device();

      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // 라우터(서버 측)의 RTP 기능이 있는 장치를 로드합니다
      await device.load({
        // see getRtpCapabilities() below
        routerRtpCapabilities: rtpCapabilities,
      });

      console.log("나는 배심원Device RTP Capabilities", device.rtpCapabilities);

      // 방에 있는 모든 producer Id가져와서 각각의 consumer 생성
      getProducers();
      // => consumer생성
    } catch (error) {
      console.log(error);
      if (error.name === "UnsupportedError")
        console.warn("browser not supported");
    }
  };

  /////////////////// 새로운 발언자 입장////////////////////////

  // 기존의 peer에게 서버에서 새로운 producer 알림 및 새로운 consumer 생성
  // 즉 1개의 consumer만 생성하는 코드
  mediaSocket.on("new-producer", ({ producerId }) =>
    signalNewConsumerTransport(producerId)
  );

  // 새로운 peer가 들어와서 consumer를 첫 생성할 때 코드
  const signalNewConsumerTransport = async (remoteProducerId) => {
    console.log("???여기");
    //이미 remoteProducerId를 사용하고 있는지 확인
    if (consumingTransports.includes(remoteProducerId)) return;
    consumingTransports.push(remoteProducerId);

    //consuner Transport 생성
    mediaSocket.emit(
      "createWebRtcTransport",
      { consumer: true },
      ({ params }) => {
        // sever에서 매개변수 다시전송
        // fornt에서 Transport 생성
        if (params.error) {
          console.log(params.error);
          return;
        }
        console.log("컨슈머 PARAMS:::", params);

        let consumerTransport;
        try {
          consumerTransport = device.createRecvTransport(params);
        } catch (error) {
          console.log(error);
          return;
        }

        consumerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              // 로컬 DTLS 매개 변수를 서버에 전송
              // see server's socket.on('transport-recv-connect', ...)
              mediaSocket.emit("transport-recv-connect", {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              });

              // 매개변수 전송 알림
              callback();
            } catch (error) {
              // transport 오류
              errback(error);
            }
          }
        );

        connectRecvTransport(consumerTransport, remoteProducerId, params.id);
      }
    );
  };

  //consumer을 생성하기위해 server에 요청
  const connectRecvTransport = async (
    consumerTransport,
    remoteProducerId,
    serverConsumerTransportId
  ) => {
    // rtpCapabilities 기반으로 consumer생성 및 consume
    // 만약 router가 consume 상태면, 아래 params 전송
    mediaSocket.emit(
      "consume",
      {
        rtpCapabilities: device.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }) => {
        if (params.error) {
          console.log("Cannot Consume");
          return;
        }

        console.log("컨슈머파람", params);
        // consumer를 생성하는 local consumer transport를 consume ??
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        });

        consumerTransports = [
          ...consumerTransports,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ];
        console.log("consumer", consumer);
        /////////////////////////////////////////////////////

        // 인원마다 늘어나는 vido 창이 아니므로 삭제?
        // 새로운 consumer media를 위한 div element 생성
        // const newElem = document.createElement("div");
        // newElem.setAttribute("id", `td-${remoteProducerId}`);

        // if (params.kind == "audio") {
        //   //append to the audio container
        //   newElem.innerHTML =
        //     '<audio id="' + remoteProducerId + '" autoplay></audio>';
        // } else {
        //   //append to the video container
        //   newElem.setAttribute("class", "remoteVideo");
        //   newElem.innerHTML =
        //     '<video id="' +
        //     remoteProducerId +
        //     '" autoplay class="video" ></video>';
        // }

        // videoContainer.appendChild(newElem);

        // ///
        // const remoteStream = ({ remoteProducerId, kind }) => {
        //   if (kind === "audio") {
        //     return <audio id={remoteProducerId} autoPlay />;
        //   } else {
        //     return <video id={remoteProducerId} autoPlay className="video" />;
        //   }
        // };

        // const RemoteStreamComponent = ({ remoteProducerId, kind }) => {
        //   useEffect(() => {
        //     const newElem = document.createElement("div");
        //     newElem.setAttribute("id", `td-${remoteProducerId}`);

        //     if (kind === "audio") {
        //       // append to the audio container
        //       newElem.innerHTML = `<audio id="${remoteProducerId}" autoplay></audio>`;
        //     } else {
        //       // append to the video container
        //       newElem.setAttribute("class", "remoteVideo");
        //       newElem.innerHTML = `<video id="${remoteProducerId}" autoplay class="video"></video>`;
        //     }

        //     const videoContainer = document.getElementById("videoContainer");
        //     videoContainer.appendChild(newElem);

        //     // 컴포넌트가 언마운트되면 DOM에서 해당 엘리먼트를 제거합니다.
        //     return () => {
        //       videoContainer.removeChild(newElem);
        //     };
        //   }, [remoteProducerId, kind]);

        //   // 이 컴포넌트는 실제로 렌더링 결과를 반환하지 않으며, DOM 조작만 수행합니다.
        //   return null;
        // };
        //dd

        // destructure and retrieve the video track from the producer
        const { track } = consumer; //여기까지 삭제

        remoteVideoRef.current.srcObject = new MediaStream([track]);
        // remoteVideoRef.current.srcObject = new MediaStream([track]);

        // 서버 소비자가 미디어를 일시 중지한 상태에서 시작했기 때문에
        // 서버에 다시 시작하도록 알려야 함
        mediaSocket.emit("consumer-resume", {
          serverConsumerId: params.serverConsumerId,
        });
      }
    );
  };

  // producer가 닫혔을 때 server notification가 수신됨
  mediaSocket.on("producer-closed", ({ remoteProducerId }) => {
    // 클라이언트 consumer과 transport 해제
    const producerToClose = consumerTransports.find(
      (transportData) => transportData.producerId === remoteProducerId
    );
    producerToClose.consumerTransport.close();
    producerToClose.consumer.close();

    // 목록에서 consumer transport 제거
    consumerTransports = consumerTransports.filter(
      (transportData) => transportData.producerId !== remoteProducerId
    );

    // // video div element 제거
    // videoContainer.removeChild(
    //   document.getElementById(`td-${remoteProducerId}`)
    // );
  });

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

  // 3 - 1 - 1. 게임 시작 버튼 클릭 시 룰렛 보여줌
  const gameStartBtnClickHandler = () => {
    console.log("버튼이 클릭되었습니다.");
    socket.emit("show_roulette", true, categoryCode);
  };

  // 3 - 2 - 1.룰렛 애니메이션 시작 - 룰렛의 Start 버튼
  const setTitleBtnClickHandler = () => {
    socket.emit("start_roulette", roomNumber, categoryCode);
  };

  // 3 - 3 - 1. 결과창 닫기  - 다시돌리기 Button
  const closeResultModal = () => {
    socket.emit("close_result", false, roomNumber, categoryCode);
    socket.emit("close_roulette", false, roomNumber, categoryCode);
  };

  // 3 - 4 - 1. 룰렛 닫기  - 토론 시작하기 Button
  const closeRouletteModal = () => {
    socket.emit("close_result", false, roomNumber, categoryCode);
  };

  // 4. 유저 나갔을 시 발생하는 알람
  socket.on("roomLeft", (nickname) => {
    setTotalChat([...totalChat, `Alarm : ${nickname}님이 나가셨습니다.`]);
  });

  // 5 - 1. Host 투표
  const voteFirstPersonHandler = () => {
    socket.emit("vote", roomNumber, 1, categoryCode);
    setIsGameEnd(false);
  };

  // 5 - 2. Debator 투표
  const voteSecondPersonHandler = () => {
    socket.emit("vote", roomNumber, 0, categoryCode);
    setIsGameEnd(false);
  };

  // 페이지 나가기 버튼 클릭 함수
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

  // 백 웹 소켓 서버에서 이벤트 받는 함수 (매번 생성할 필요 없이 페이지 마운트 시 한 번만 생성할 함수)
  useEffect(() => {
    // 1. 방에 입장한 유저 닉네임 리스트 받아오기 [ 전체 수신 ]
    socket.on("roomJoined", (data) => {
      // console.log("데이터 = ", data);
      // console.log("로컬스토리지 값", sessionStorage.getItem("Authorization"));
      const { userId: myUserId } = jwt_decode(
        sessionStorage.getItem("Authorization")
      );
      // console.log("내 아이디 = ", myUserId);
      // console.log("내 아이디 = ", typeof myUserId);
      const jurorList = [];
      let debaterList = {};
      let hostList = {};
      data.forEach((userInfo) => {
        // console.log("받아온 개별 유저정보", userInfo);
        const { host, debater } = userInfo;
        if (!debater) {
          jurorList.push({
            nickName: userInfo.nickName,
            avatar: JSON.parse(userInfo.avatar),
          });
        }
        if (host && debater) {
          // console.log("host 유저ID", userInfo.userId);
          // console.log("host 유저ID", typeof userInfo.userId);
          hostList = {
            nickName: userInfo.nickName,
            avatar: JSON.parse(userInfo.avatar),
          };
          if (userInfo.userId === myUserId) {
            setIsHost(true);
          } else {
            if (isHost) {
              setIsHost(false);
            }
          }
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

    // 3 - 1 - 1. 룰렛 보여줌 [ 전체 수신 ]
    socket.on("show_roulette", (titleListFromBack, result) => {
      titleList.current = [...titleListFromBack];
      setIsRoulette(result);
    });

    /* 룰렛 애니메이션 작동
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

    // 3 - 2 - 2. 룰렛 애니메이션 시작 [ 전체 수신 ]
    socket.on("start_roulette", (randomSubjectIndex) => {
      console.log(roulette.current);
      // 룰렛 애니메이션 함수
      setTitleFunc(randomSubjectIndex);
    });

    // 3 - 3 - 2. 결과 창 닫기 [ 전체 수신 ]
    socket.on("close_result", (result) => {
      setIsRouletteResult(result);
    });

    // 찬성 반대에 따른 색상 지정 함수 ( 찬성 : 파란색, 반대 : 빨간색 )
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

    // 3 - 4 - 2. 이벤트 수신 후 룰렛 닫기 [ 전체 수신 ]
    socket.on("close_roulette", (result, debatersInfo) => {
      console.log(debatersInfo);
      setIsRoulette(result);
      setTimeout(startGameSignalHandler, 100);
      setDebaterPosition(debatersInfo);
    });

    // 6. 투표 결과 받기 [ 전체 수신 ]
    socket.on("voteResult", (result) => {
      setRemainTime("30");
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
        // done();
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
        // 승자 있을 경우 jwt에서 userId가져와서 어느 유저가 승리자인지 확인
        const { userId: myUserId } = jwt_decode(
          sessionStorage.getItem("Authorization")
        );
        console.log(myUserId);
        if (result.winner === myUserId) {
          setIsWinner(true);
        }
      }
      // 게임이 끝났음으로 호스트 및 토론자 div 색상 기본 값으로 재설정
      setDebaterDivDesign("bg-black");
      setHostDivDesign("bg-black");
    });

    // 7. 토론에서 진 유저 추방하기 [ 전체 수신 ]
    socket.on("loserExit", (exitUserId) => {
      const { userId } = jwt_decode(sessionStorage.getItem("Authorization"));
      if (userId === exitUserId) {
        socket.disconnect();
        setIsLoser(true);
      }
    });

    socket.on("sendRemainTime", (remainTime) => {
      setRemainTime(remainTime);
    });

    // 방 폭파 시 배심원들 나가게 하기 위한 로직
    socket.on("userDisconnected", (jurorUserId) => {
      const { userId } = jwt_decode(sessionStorage.getItem("Authorization"));
      if (userId === jurorUserId) {
        socket.disconnect();
        navigate("/");
      }
    });

    // 게임 중 토론자 유저 나갈 경우
    socket.on("gameEnd", () => {
      setIsStartGame(false);
      setHostDivDesign("bg-black");
      setDebaterDivDesign("bg-black");
    });
  }, [navigate, socket, isHost]);
  // ******************************************************************************

  // ********************************************************************** Web RTC

  // 내 오디오 음소거 함수
  const muteClickHandler = async () => {
    (await getLocalStream) //이걸로바꿔도디나
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
    getLocalStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (!isVideoOff) {
      setIsVideoOff(true);
    } else {
      setIsVideoOff(false);
    }
  };

  // // // 내 비디오, 오디오 정보 가져오는 함수
  // const getMedia = async () => {
  //   try {
  //     // 내 오디오, 비디오 장비들의 stram 정보를 가져옴
  //     const Stream = await navigator.mediaDevices.getUserMedia({
  //       audio: true,
  //       video: true,
  //     });
  //     Stream.getVideoTracks().forEach(
  //       (track) => (track.enabled = !track.enabled)
  //     );
  //     console.log("Stream.getVideoTracks??", Stream.getVideoTracks());
  //     return Stream;
  //   } catch (e) {
  //     console.log("겟미디어 e", e);
  //   }
  // };

  // 컴포넌트 첫 마운트 시에 myStream 정보를 캐싱 후 바꾸지 않음
  // 향후 반장이 바뀔 때 의존성으로 사용할 수 있을 것 같음
  // const myStream = useMemo(getLocalStream, []);

  // // isMuted 와 isVideoOff 상태를 의존성을 가지며 2개의 상태값이 변할 때마다 캐싱된 myStream 값을 가져와서 video의 srcObject로 입력해줌
  // useEffect(() => {
  //   setTimeout(async () => {
  //     // console.log(await myStream);
  //     myVideoBox.current.srcObject = await myStream;
  //   }, 0);
  // }, [isMuted, isVideoOff, myStream]);
  // *******************************************************************************

  // ********************************************************************************

  // 룰렛 표시 관련 css
  const showRoullete = isRoulette
    ? { visibility: "visible" }
    : { display: "none" };

  const hideStartBtn = !isStartGame
    ? { visibility: "visible" }
    : { display: "none" };

  const hoverStyleOnGameStartBtn =
    hostInfo.nickName && debaterInfo.nickName && jurorInfo.length !== 0
      ? "hover:shadow-[#EFFF364D] hover:shadow-xl"
      : "";

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
            width="680px"
            height="680px"
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
          <div className="absolute w-fit h-fit top-0 left-[50%] translate-x-[-50%] translate-y-[-10%] z-[4]">
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
              투표가 {remainTime}초 남았습니다.
            </p>

            <div className="flex w-full h-[10%] justify-between gap-[1vh] mt-[2.01vh]">
              <div
                onClick={voteFirstPersonHandler}
                className={
                  hostDivDesign +
                  " flex justify-between items-center gap-[0.67vh] w-[50%] h-[4.68vh] px-[1.77vw] py-[0.67vh] text-white font-bold rounded-[16px] cursor-pointer"
                }
              >
                <Avatar
                  name={hostInfo.avatar?.name}
                  variant="beam"
                  color={hostInfo.avatar?.color[0].split(",")}
                  className="h-[2.68vh]"
                />
                <div className="w-[70%] flex flex-col justify-center">
                  {hostDivDesign === "bg-[#14B5FF]" ? (
                    <p>찬성 발언자</p>
                  ) : hostDivDesign === "bg-[#FA3C3C]" ? (
                    <p>반대 발언자</p>
                  ) : null}
                  <div className="w-full text-[1.34vh] whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {hostInfo.nickName}
                  </div>
                </div>
              </div>
              <div
                onClick={voteSecondPersonHandler}
                className={
                  debaterDivDesign +
                  " flex justify-between items-center gap-[0.67vh] w-[50%] h-[4.68vh] px-[1.77vw] py-[0.67vh] text-white font-bold rounded-[16px] cursor-pointer"
                }
              >
                <Avatar
                  name={debaterInfo.avatar?.name}
                  variant="beam"
                  color={debaterInfo.avatar?.color[0].split(",")}
                  className="h-[2.68vh]"
                />
                <div className="w-[70%] flex flex-col justify-center">
                  {debaterDivDesign === "bg-[#14B5FF]" ? (
                    <p>찬성 발언자</p>
                  ) : debaterDivDesign === "bg-[#FA3C3C]" ? (
                    <p>반대 발언자</p>
                  ) : null}
                  <div className="text-[1.34vh] whitespace-nowrap overflow-hidden overflow-ellipsis">
                    {debaterInfo.nickName}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isGameEnd && isTeller && (
        <div className="absolute flex justify-center items-center w-[100vw] h-[100vh] top-0 left-0 bg-slate-200/40 z-[3]">
          <div className="absolute top-[50%] left-[50%] flex flex-col justify-evenly items-center w-fit h-[33.33%] p-[4.01vh] bg-[#2F3131] rounded-[16px] z-[4] translate-y-[-50%] translate-x-[-50%]">
            <p className="text-[2.26vh] text-white font-bold">
              투표가 진행중입니다.
            </p>
            <p className="text-[2.01vh] text-[#EFFE37] font-bold">{title}</p>
            <p className="text-[1.76vh] text-[#C6C6C6]">
              투표가 {remainTime}초 남았습니다.
            </p>
          </div>
        </div>
      )}
      {/* ================================================================================================ */}

      {/* ========================================== 투표 결과 모달 창 ================================================ */}
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
                ref={localVideoRef}
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
                ref={remoteVideoRef}
                autoPlay
                playsInline
                muted
              />
              {/* <div id="videoContainer" className="  w-full h-full rounded-2xl">
                <RemoteStreamComponent
                  remoteProducerId={remoteProducerId}
                  kind={kind}
                />
              </div> */}
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
              style={hideStartBtn}
              disabled={
                !(
                  hostInfo.nickName &&
                  debaterInfo.nickName &&
                  jurorInfo.length !== 0
                )
              }
              className={
                hoverStyleOnGameStartBtn +
                " flex justify-center items-center w-[20%] h-full bg-[#EFFE37] rounded-full ml-auto text-[2.01vh] font-semibold disabled:bg-[#919191] disabled:text-[#505050]"
              }
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
              disabled={isStartGame}
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
