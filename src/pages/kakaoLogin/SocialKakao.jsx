//socialKaka0
import React from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import icon from "../../icons";

//restapi 방법
const SocialKakao = () => {
  const kakaoLogin = `${process.env.REACT_APP_BACKEND_SERVER_URL}/auth/kakao/callback`;

  const { search } = useLocation();
  const token = queryString.parse(search);

  // query에 token이 있다면 localStorage에 저장
  if (Object.keys(token).length > 0) {
    sessionStorage.setItem("RefreshToken", token.token);
  }

  return (
    <div className="flex flex-col justify-between border w-[70vh] h-[80vh] m-auto px-[114px] rounded-[20px]">
      <div className="w-[100%] h-[10vh] mt-[10vh]">
        <p className="  text-[3vh] font-medium text-white">Do Debate,</p>
        <p className="text-[3vh] font-bold text-white">Get Win!</p>
      </div>
      <div className="w-full h-[30vh] mx-auto">
        <icon.Random width="100%" height="100%" />
      </div>
      <div className="flex flex-col justify-center mb-[8vh]">
        <div className="App">
          <a href={kakaoLogin}>
            <img
              src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg"
              alt="카카오로그인"
            />
          </a>
        </div>
        <p className="text-[1.7vh] text-[#ABABAB] mx-auto mt-[1.4vh]">
          카카오톡 소셜 로그인을 통해 내 계정 정보로 접속할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
export default SocialKakao;

//TODO: 소셜로그인 - kakao
// export function kakaoSignIn(code:string)
// {
// return new Promise(async (resolve,reject)=>{
//   await post(`/auth/kakao`,code)
//     .then((data)=>{
//       resolve(data)
//     })
//     .catch((error)=>{
//       reject(error)
//     })
// })
// }
