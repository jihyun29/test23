//Kakao.js
import React from "react";
import { useCookies } from "react-cookie";

const Kakao = (props) => {
  const [cookie, setCookie, removeCookie] = useCookies(["authorization"]);

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
