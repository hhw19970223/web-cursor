"use client";

import Split from "react-split";
import { EditCode } from "./edit-code";
import { Output } from "./output";
import { Chat } from "./chat";
import { GeneratedCodeStateContextProvider } from "./context";
export function GeneratedCode() {
  return (
    <div className="h-full bg-lightgray">
      <GeneratedCodeStateContextProvider>
        <Split
          sizes={[0, 67, 33]} // 初始宽度比例
          minSize={0} // 每个面板最小宽度
          gutterSize={8} // 拖动条宽度
          style={{ display: "flex", height: "100%", width: "100%" }}
        >
          <EditCode />
          <div className="w-full h-full max-h-full overflow-hidden relative bg-white">
            <div className="w-full h-full overflow-auto">
              <Output />
            </div>
          </div>
          <div className="w-full h-full max-h-full overflow-hidden relative bg-white">
            <div className="w-full h-full overflow-auto">
              <Chat />
            </div>
          </div>
        </Split>
      </GeneratedCodeStateContextProvider>
    </div>
  );
}
