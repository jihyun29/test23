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
    <div className="flex flex-col  justify-between items-center  border w-[80vh] h-[80vh] m-auto px-[114px] rounded-[20px]">
      <div className="w-[100%] h-[full] mt-[8vh] ">
        <icon.illust_login width="100%" height="60%" />
        <icon.logo_debatory_middle width="80%" height="20%" />
        <div className="mt-[5vh] ">
          <p className="text-[2vh] text-[#ABABAB] whitespace-nowrap mx-auto mt-[1.4vh] mb-[1vh] flex flex-col items-center">
            카카오톡 소셜 로그인을 통해 내 계정 정보로 접속할 수 있습니다.
          </p>
          <a href={kakaoLogin}>
            <icon.kakaologin alt="카카오로그인" width="100%" height="20%" />
          </a>
        </div>
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
