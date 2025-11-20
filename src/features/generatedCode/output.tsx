import Frame from "react-frame-component";
import { useGeneratedCodeStore } from "./context";
import { useRef } from "react";

export function Output() {
  const { code } = useGeneratedCodeStore((selector) => selector);
  const frameRef = useRef(null);
  
  const onNewOpen = () => {
    const newWindow = window.open("", "_blank");
    newWindow?.document?.write?.(code);
  };

  const onLoad = () => {
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "page.html";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleMount = () => {
    const iframe = frameRef.current as HTMLIFrameElement | null;
    if (!iframe?.contentWindow) return;

    iframe?.contentWindow.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "F11") {
        e.preventDefault();
        onNewOpen();
      } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        onLoad();
      }
    });
  };

  return (
    <Frame
      initialContent={code}
      className="w-full h-full overflow-auto"
      ref={frameRef} 
      contentDidMount={handleMount}
    >
      <></>
    </Frame>
  );
}
