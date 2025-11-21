'use client'

import { useLoginStore } from "@/stores/login";
import React, { useState } from "react";
import Link from "next/link";
import { ColorButton } from "@/components/color-button";
import { Input } from "@/components/ui/input";

const page = () => {
  const { loginInfo } = useLoginStore();
  const [inputValue, setInputValue] = useState("");

  const list = [
    {
      title: "前端代码生成",
      type: "1",
      link: "/generated-code",
    },
  ];

  return (
    <div className="px-4 pb-4 h-full">
      <div className="bg-lightgray rounded-page h-full w-full pt-20">
        <div className="container mb-6">
          <Input
            type="text"
            placeholder="请输入内容..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="container grid grid-cols-4 gap-4">
          {list.map((item, index) => (
            <div
              key={index}
              className="h-full flex flex-col items-center justify-center"
            >
              <Link href={item.link} target="_blank">
                <ColorButton
                  type={item.type}
                  disable={!loginInfo}
                  label={item.title}
                  className="rounded-2xl"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
