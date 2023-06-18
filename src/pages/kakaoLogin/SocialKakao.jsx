//socialKaka0

import React from "react";
import { LoginLogo } from "../../icons";

//restapi 방법
const SocialKakao = () => {
  // const Rest_api_key = process.env.REACT_APP_KAKAO_REDIRECT_URL; //REST API KEY
  // // const Rest_api_key = ""; //REST API KEY
  // const redirect_uri = "http://localhost:3000/auth"; //Redirect URI

  // // oauth 요청 URL
  // const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${Rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;
  // const handleLogin = () => {
  //   window.location.href = kakaoURL;
  // };

  const REDIRECT_URI =
    "https://front-black-delta.vercel.app/auth/kakao/callback"; //Redirect URI

  const CLIENT_ID = `${process.env.REACT_APP_KAKAO_REDIRECT_URL}`; //REST API KEY 나중에 이름변경
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  //인가코드 추출방법
  const code = new URL(window.location.href).searchParams.get(`code`);
  console.log(code);

  return (
    <div className="flex flex-col justify-between w-[600px] h-[671px] border border-[#777777] m-auto px-[114px] rounded-[20px]">
      <div className="w-[131px] h-[60ox] mt-[117px]">
        <p className="  text-[24px] leading-[30px] font-medium">Do Debate,</p>
        <p className="text-[24px] leading-[30px] font-bold">Get Win!</p>
      </div>
      <div className="w-[181px] h-[181px] mx-auto">
        <LoginLogo />
      </div>
      <div className="flex flex-col justify-center mb-[78px]">
        <img
          onClick={() => handleLogin()}
          src="img/kakao_login_medium_narrow.png"
          alt={"kakao-login"}
          className="w-[371px] h-[80px] rounded-[8px] cursor-pointer"
        />
        <p className="text-[14px] text-[#777777] leading-[18.5px] mx-auto mt-[15px]">
          카카오톡 소셜 로그인을 통해 내 계정 정보로 접속할 수 있습니다.
        </p>
      </div>
    </div>
  );
};
export default SocialKakao;

// //TODO: 소셜로그인 - kakao
// export function kakaoSignIn(code:string)
// {
//   return new Promise(async (resolve,reject)=>{
//     await post(`/auth/kakao`,code)
//       .then((data)=>{
//         resolve(data)
//       })
//       .catch((error)=>{
//         reject(error)
//       })
//   })
// }
