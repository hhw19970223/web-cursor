"use client";
import React, { useState, useEffect } from "react";
import Profile from "./Profile";

const Header = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-[5] ${isSticky
            ? "bg-white dark:bg-dark fixed w-full"
            : "bg-white"
          }`}
      >
        <div
          className={`rounded-none bg-transparent dark:bg-transparent py-4 sm:px-30 px-4 ml-auto mr-0 flex justify-end`}
        >
          <Profile />
        </div>
      </header>
    </>
  );
};

export default Header;
