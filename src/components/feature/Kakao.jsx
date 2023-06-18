//Kakao.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
// import { useDispatch } from "react-redux";
// import { actionCreators as userActions } from "../../shared/user";

const Kakao = (props) => {
  // const dispatch = useDispatch();
  // const href = window.location.href;
  // let params = new URL(document.URL).searchParams;
  // let code = params.get("code");
  // React.useEffect(async () => {
  //   await dispatch(userActions.auth(code));
  // }, []);

  const navigate = useNavigate();

  const code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_SERVER_URL}kakaoLogin${code}`)
      .then((r) => {
        console.log(r.data); // 토큰과 함께 오는 정보들을 출력해보자

        // / 토큰을 받아서 localStorage같은 곳에 저장하는 코드를 여기에 쓴다.
        localStorage.setItem("name", r.data.user_name); // 일단 이름만 저장했다.

        navigate("/"); //
      });
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await axios.get(`api/code=${code}`);
  //       const token = res.headers.authorization;
  //       window.localStorage.setItem("token", token);
  //       navigate("/");
  //     } catch (e) {
  //       console.error(e);
  //       navigate("/");
  //     }
  //   })();
  // }, []);
  return (
    <div>
      <div>
        <h1>잠시만 기다려 주세요! 로그인 중입니다.</h1>
      </div>
    </div>
  );
};

export default Kakao;

// const OAuth = () => {
//   const code = new URL(window.location.href).searchParams.get("code"); // 인가코드 추출
// 코드 전달은 바디에 담아서 보내도 되지만 아래에서는 url 을 통해서 전달
//   useEffect(() => {
//     fetch(`http://172.20.10.3:3000/user/signin?code=${code}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded;",
//       },
//     });
//   }, []);

//   return <Oabox>카카오 인가코드 받아서 넘기고 토큰 받아오는 과정</Oabox>;
// };
