import { useEffect } from "react";

export function useSocketEnterRoom({ socket, roomNumber, isTeller }) {
  // 서버와 연결된 소켓 가져오는 파일

  // 1, 컴포넌트가 마운트 됐을 때 : 방 입장
  // 2. 언마운트 시 : 소켓 연결 끊기
  // 참조 : https://socket.io/how-to/use-with-react
  useEffect(() => {
    console.log(socket);
    if (!socket.connected) {
      // 배포 시
      socket.connect(process.env.REACT_APP_BACKEND_SERVER_URL);

      // 로컬 테스트 시
      // socket.connect("http://localhost:4000");
    }
    console.log(socket.connected);
    if (!isTeller) {
      socket.emit(
        "joinJuror",
        localStorage.getItem("userId"), // 미들웨어 적용 후 삭제
        roomNumber,
        () => {
          console.log("참여자로 입장되었습니다!");
        }
      );
    } else {
      socket.emit(
        "joinDebate",
        localStorage.getItem("userId"), // 미들웨어 적용 후 삭제
        roomNumber,
        () => {
          console.log("토론자로 입장되었습니다!");
        }
      );
    }

    // 페이지 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
      console.log("소켓연결이 해제되었습니다.");
    };
  }, []);
}
