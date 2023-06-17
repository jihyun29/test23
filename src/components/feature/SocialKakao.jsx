//socialKaka0

import React from "react";

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
    "http://front-black-delta.vercel.app/auth/kakao/callback"; //Redirect URI

  const CLIENT_ID = `${process.env.REACT_APP_KAKAO_REDIRECT_URL}`; //REST API KEY 나중에 이름변경
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  //인가코드 추출방법
  const code = new URL(window.location.href).searchParams.get(`code`);
  console.log(code);

  return (
    <div>
      <img
        onClick={() => handleLogin()}
        src="img/kakao_login_medium_narrow.png"
        alt={"kakao-login"}
        style={{ borderRadius: "4px" }}
      />
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
