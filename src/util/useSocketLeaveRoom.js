import { useEffect } from "react";

export function useSocketLeaveRoom({ socket }) {
  useEffect(() => {
    return () => {
      socket.disconnect();
      console.log("소켓연결이 해제되었습니다.");
    };
  }, []);
}
