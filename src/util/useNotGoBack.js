import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

export function useNotGoBack(state, socket) {
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
    console.log("입장소켓", socket);

    /* 새로고침 감지  
   const handleBeforeUnload = (event) => {
      event.preventDefault();
      alert("새로고침되었습니다.");
      // event.returnValue = ''; // 이 부분은 브라우저에 메시지를 표시할 수도 있습니다.
    }; 

    window.addEventListener("beforeunload", handleBeforeUnload);
    */

    function wait(seconds) {
      return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }

    window.onbeforeunload = async function () {
      console.log("언로드 리프레쉬");
      console.log("socket", socket);
      socket.emit("refresh");
    };

    // window.addEventListener("beforeunload", () => {
    //   socket.emit("refresh");
    // });

    // window.addEventListener("pagehide", function (event) {
    //   socket.emit("refresh");
    // });

    return async () => {
      window.removeEventListener("popstate", handlePopstate);
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      console.log("나가졌습니다.");
    };
  }, []);
}
