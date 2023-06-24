import { useEffect } from "react";
import { io } from "socket.io-client";

export function useSocket({ socket, roomNumber }) {
  // 1, 컴포넌트가 마운트 됐을 때 : 방 입장
  // 2. 언마운트 시 : 소켓 연결 끊기
  // 참조 : https://socket.io/how-to/use-with-react
  useEffect(() => {
    // 페이지 접속 시 방넘버가 없을 경우 방 입장 안됨
    if (roomNumber === null) {
      return;
    }
    // 방 넘버만 있다면 소켓 연결
    socket.emit("enter_room", roomNumber);
    // 페이지 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
    };
  }, []);
}
