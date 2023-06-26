import { useEffect } from "react";

export function useSocket({ socket, roomNumber, isTeller }) {
  console.log(roomNumber);
  console.log(isTeller);
  // 1, 컴포넌트가 마운트 됐을 때 : 방 입장
  // 2. 언마운트 시 : 소켓 연결 끊기
  // 참조 : https://socket.io/how-to/use-with-react
  useEffect(() => {
    // 누르는 버튼에 따라 다른 이벤트 발생
    socket.connect();
    if (!isTeller) {
      socket.emit(
        "joinJuror",
        localStorage.getItem("userId"),
        roomNumber,
        () => {
          console.log("참여자로 입장되었습니다!");
        }
      );
    } else {
      socket.emit(
        "joinDebate",
        localStorage.getItem("userId"),
        roomNumber,
        () => {
          console.log("토론자로 입장되었습니다!");
        }
      );
    }

    console.log("ok");
    // 페이지 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
      console.log("소켓 연결이 끊겼습니다.");
    };
  }, [socket]);
}
