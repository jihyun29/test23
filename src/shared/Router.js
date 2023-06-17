import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Category from "../pages/Category";
import Home from "../pages/Home";
// import OneRoom from "../pages/OneRoom";
import Room from "../pages/Room";
import RoomList from "../pages/RoomList";
import Kakao from "../components/feature/Kakao";
import SocialKakao from "../components/feature/SocialKakao";

function Router() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/room" element={<Room />} />
        <Route path="/roomlist" element={<RoomList />} />
        {/* <Route path="/room/:id" element={<OneRoom />} /> */}

        <Route path="/auth" element={<Kakao />} />
        <Route path="/socialkakao" element={<SocialKakao />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
