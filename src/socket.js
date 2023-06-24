import { io } from "socket.io-client";

// 서버와 연결된 소켓 가져오는 파일
// "undefined" means the URL will be computed from the `window.location` object
const URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_SERVER_URL
    : "http://localhost:4000";
// const URL = process.env.REACT_APP_BACKEND_SERVER_URL;

export const socket = io(URL, {
  withCredentials: true,
});
