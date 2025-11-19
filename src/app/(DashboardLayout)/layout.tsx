"use client";
import React from "react";
import Header from "./layout/header/Header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full min-h-screen">
      <div className="page-wrapper flex w-full">
        <div className="body-wrapper w-full bg-white dark:bg-dark flex overflow-hidden flex-col">
          <Header />
          <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
