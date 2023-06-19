import axios from "axios";

// axios instance : axios 생성자
// axios default 설정
const instance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_SERVER_URL,
  withCredentials: true,
  headers: {},
});

// axios request가 back으로 요청되기 전에 진행되는 작업 -> 일종의 middleware
instance.interceptors.request.use(
  function (config) {
    // 작업내용
    return config;
  },
  function (error) {
    // 에러 발생 시 작업 내용
    return Promise.reject(error);
  }
);

// axios response가 받기 전에 진행되는 작업 -> 일종의 middleware
instance.interceptors.response.use(
  function (response) {
    // 작업 내용
    return response;
  },
  function (error) {
    // 에러 발생 시 작업 내용
    return Promise.reject(error);
  }
);
