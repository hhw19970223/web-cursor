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
        <div className="body-wrapper w-full bg-white dark:bg-dark">
          <Header />
          <div className="bg-lightgray rounded-page min-h-[90vh]">
            <div
              className='flex h-[90vh] w-full overflow-y-auto overflow-x-hidden'
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
