import React from "react";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import icon from "../icons";
import lottie from "../lottie";
// import axios from "axios";
// import instance from "../api/api";

function Home() {
  const navigate = useNavigate();
  const moveToCategoryPage = () => {
    // 테스트
    // instance.put("https://simsimhae.store/api/discussant/36");
    navigate("/category");
  };

  return (
    <>
      <Header />
      <div className="w-full h-[83vh]">
        <div className="relative mt-[5vh] flex flex-col items-center w-full h-[20vmin] whitespace-nowrap overflow-hidden">
          <div className="absoulte flex justify-start w-[300vmin] h-[50%] animate-flowTextToLeft">
            <div className="flex w-full h-full items-center justify-start">
              <icon.MainFlowText1 width="19%" height="100%" />
              <Lottie className="w-[12%]" animationData={lottie.globe} />
              <icon.MainFlowText2 width="38%" height="100%" />
              <icon.MainHearts width="10%" height="290%" />
              <icon.MainFlowText3 width="54%" height="100%" />
              <icon.MainArrow width="12%" height="100%" />
              <icon.MainFlowText4 width="46%" height="100%" />
              <icon.MainBlah width="20%" height="100%" />
              <icon.MainFlowText5 width="39%" height="100%" />
              <p className="w-[2vmin]"></p>
            </div>
            <div className="flex w-full h-full items-center">
              <icon.MainFlowText1 width="19%" height="100%" />
              <Lottie className="w-[12%]" animationData={lottie.globe} />
              <icon.MainFlowText2 width="38%" height="100%" />
              <icon.MainHearts width="10%" height="290%" />
              <icon.MainFlowText3 width="54%" height="100%" />
              <icon.MainArrow width="12%" height="100%" />
              <icon.MainFlowText4 width="46%" height="100%" />
              <icon.MainBlah width="20%" height="100%" />
              <icon.MainFlowText5 width="39%" height="100%" />
              <p className="w-[2vmin]"></p>
            </div>
          </div>
          <div className="absoulte flex w-[300vmin] h-[50%] animate-flowTextToRight">
            <div className="flex w-full h-full items-center">
              <icon.MainFlowText6 width="22%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainLoL width="20%" height="100%" />
              <icon.MainFlowText7 width="30%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainProp width="8%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainFlowText8 width="33%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainSound width="12%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainFlowText9 width="25%" height="100%" />
              <p className="w-[2vmin]"></p>
            </div>
            <div className="flex w-full h-full items-center">
              <icon.MainFlowText6 width="22%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainLoL width="20%" height="100%" />
              <icon.MainFlowText7 width="30%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainProp width="8%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainFlowText8 width="33%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainSound width="12%" height="100%" />
              <p className="w-[2vmin]"></p>
              <icon.MainFlowText9 width="25%" height="100%" />
              <p className="w-[2vmin]"></p>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-[6vh]">
          <button
            onClick={moveToCategoryPage}
            className="py-[2vmin] px-[8vw] bg-[#EFFE37] text-black font-bold text-[4vmin] rounded-[60px]"
          >
            Let's Go!
          </button>
        </div>
        <div className="mt-[9vh]">
          <icon.MainMidSection width="100%" height="100%" />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Home;
