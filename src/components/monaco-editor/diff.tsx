"use client";

import React from "react";

import { DiffEditor } from "@monaco-editor/react";

interface Props {
  language: string;
  originalCode: string;
  modifiedCode: string;
}
export function MonacoDiffEditor({ language, originalCode, modifiedCode }: Props) {


  return (
    <DiffEditor
      height="100%"
      original={originalCode}
      modified={modifiedCode}
      language={language}
      theme="vs-dark"
      options={{
        renderSideBySide: false, // false 表示上下显示，true 表示左右显示
        readOnly: true,          // 只读模式
      }}
    />
  );
}
