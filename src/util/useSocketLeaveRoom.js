import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useSocketLeaveRoom(state) {
  const { roomNumber } = state;
  const navigate = useNavigate();
  useEffect(() => {
    console.log("방에 입장하셨습니다.");
    const handlePopstate = () => {
      console.log("popstate");
      console.log(window.history);
      navigate(`/room/${roomNumber}`);
    };
    window.history.pushState(null, "", "");
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  // 새로고침 시 알람 띄우는 코드
  // useEffect(() => {
  //   const unloadHandler = (e) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };

  //   window.addEventListener("beforeunload", unloadHandler);

  //   return () => {
  //     window.removeEventListener("beforeunload", unloadHandler);
  //   };
  // }, []);
}
