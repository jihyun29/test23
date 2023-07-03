import { io } from "socket.io-client";

const URL = "http://localhost:4000";
// const URL = process.env.REACT_APP_BACKEND_SERVER_URL;

export const useSocket = () => {
  const socket = io.connect(URL, {
    withCredentials: true,
    query: {
      token: localStorage.getItem("Authorization"),
    },
  });
  return socket;
};

// -------------- test
export const useRoomListSocket = () => {
  const socket = io.connect(`${URL}/roomlist`, {
    withCredentials: true,
  });
  return socket;
};
