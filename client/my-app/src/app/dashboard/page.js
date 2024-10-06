"use client";
import React, { useState, useEffect } from "react";
import Content from "./(content)/Content";
import Sidebar from "./(sidebar)/Sidebar";
export default function Main() {
  return (
    <div className="w-full min-h-screen bg-[#221F3B] py-[0.80%] px-[0.50%]">
      <div className="flex flex-1 flex-row gap-2">
        <Sidebar />
        <Content />
      </div>
    </div>
  );
}
