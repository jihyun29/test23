import { useEffect } from "react";
import { io } from "socket.io-client";

export function useSocket({ socket, roomNumber }) {
  // 1, 컴포넌트가 마운트 됐을 때 : 소켓 연결
  // 2. 리랜더링 시 : 소켓 연결 유지
  // 3. 언마운트 시 : 소켓 연결 끊기
  // 참조 : https://gurtn.tistory.com/180
  useEffect(() => {
    // 페이지 접속 시 방넘버가 없을 경우 소켓 연결 안되도록 설정
    if (roomNumber === null) {
      return;
    }
    // 방 넘버만 있다면 소켓 연결
    socket.current = io("http://localhost:4000", {
      withCredentials: true,
    });
    socket.current.emit("enter_room", roomNumber);
    // 페이지 언마운트 시 소켓 연결 해제
    return () => {
      socket.current.disconnect();
    };
  }, [roomNumber, socket]);
}
