import React from 'react';
import Menu from "../components/menu";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3">
        <div className="flex justify-center gap-6 md:gap-20 items-center h-36">
          
          {/* 1. Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img src="/logo.png" className=" w-25 md:w-35"alt="" />
          </div>
          <div className="flex-shrink-0 flex items-center">
            <img src="/logo2.png" className="w-65 md:w-95"alt="" />
          </div>
          <div className="flex-shrink-0 flex items-center">
            <img src="/site.jpg" className="w-35 md:w-45"alt="" />
          </div>
        </div>
      </div>
      <Menu />
    </nav>
  );
}