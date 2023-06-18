//socialKaka0
import { useEffect } from "react";
import React from "react";
import { LoginLogo } from "../../icons";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

//restapi 방법
const SocialKakao = () => {
  const [cookie, setCookie, removeCookie] = useCookies(["authorization"]);

  const navigate = useNavigate();

  // useEffect(() => {
  //   // 현재 URL에서 쿼리 파라미터 추출
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const token = urlParams.get("token");
  //   console.log("urlparan", urlParams);
  //   console.log("token ", token);

  //   if (token) {
  //     localStorage.setItem("authorization", JSON.stringify(`Bearer ${token}`));
  //     setCookie("authorization", `Bearer ${token}`);
  //     console.log("token");
  //     navigate("/");
  //   }
  //   // 추출한 토큰을 로컬 스토리지에 저장
  // }, [navigate]);

  const { search } = useLocation();
  const token = queryString.parse(search);

  // query에 token이 있다면 localStorage에 저장
  if (Object.keys(token).length > 0) {
    sessionStorage.setItem("RefreshToken", token.token);
  }

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
        <div className="App">
          <a href="http://52.79.240.44:3000/auth/kakao">
            <img src="//k.kakaocdn.net/14/dn/btqCn0WEmI3/nijroPfbpCa4at5EIsjyf0/o.jpg" />
          </a>
        </div>
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
