import { io } from "socket.io-client";

// 서버와 연결된 소켓 가져오는 파일
// "undefined" means the URL will be computed from the `window.location` object

// 배포 시
const URL = process.env.REACT_APP_BACKEND_SERVER_URL;

// 로컬 테스트 시
// const URL = "http://localhost:4000";

export const socket = io(URL, {
  // secure: true,
  withCredentials: true,
  query: {
    token: localStorage.getItem("authorization"),
  },
});
