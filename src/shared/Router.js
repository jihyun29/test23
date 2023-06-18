import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Category from "../pages/Category";
import Home from "../pages/Home";
// import OneRoom from "../pages/OneRoom";
import Room from "../pages/Room";
import RoomList from "../pages/RoomList";
import Kakao from "../pages/kakaoLogin/Kakao";
import SocialKakao from "../pages/kakaoLogin/SocialKakao";
import Footer from "../components/Footer";
import Prompt from "../components/feature/Prompt";

function Router() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category" element={<Category />} />
          <Route path="/room" element={<Room />} />
          <Route path="/roomlist" element={<RoomList />} />
          {/* <Route path="/room/:id" element={<OneRoom />} /> */}

          <Route path="/auth/kakao/callback" element={<Kakao />} />
          <Route path="/socialkakao" element={<SocialKakao />} />
          <Route path="/prompt" element={<Prompt />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
}

export default Router;
