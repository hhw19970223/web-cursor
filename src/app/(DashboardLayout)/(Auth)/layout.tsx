"use client";
import { useLoginStore } from "@/stores/login";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { loginInfo } = useLoginStore();
  return loginInfo ? children : <div className="h-full w-full flex justify-center items-center text-2xl">请使用cursor登录</div>
}
