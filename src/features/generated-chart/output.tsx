import Frame from "react-frame-component";
import { useGeneratedChartStore } from "./context";
import { useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobalComponentsStore } from "@/stores/global-components";

export function Output() {
  const { code } = useGeneratedChartStore((selector) => selector);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [_iframeDocument, setIframeDocument] = useState<Document | null>(null);
  const { showToast } = useGlobalComponentsStore();

  const filename = useMemo(() => {
    return `${uuidv4()}.html`;
  }, []);

  const onNewOpen = () => {
    const newWindow = window.open("", "_blank");
    newWindow?.document?.write?.(code);
  };

  const onLoad = async () => {
    try {
      // 调用创建 HTML 接口
      const response = await fetch("/api/html/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          content: code,
        }),
      });

      if (!response.ok) {
        throw new Error("创建 HTML 文件失败");
      }

      const result = await response.json();

      // 成功后直接打开访问地址
      if (result.success && result.path) {
        window.open(result.path, "_blank");
      }
    } catch (error) {
      console.error("保存 HTML 文件失败:", error);
      showToast("error", "保存失败，请重试");
    }
  };

  const handleMount = () => {
    const iframe = frameRef.current;
    if (!iframe?.contentWindow) return;

    if (iframe.contentDocument) {
      setIframeDocument(iframe.contentDocument);
    }

    // iframe.contentWindow.addEventListener("keydown", (e: KeyboardEvent) => {
      
    // });
  };

  const handleUpdate = () => {};

  return (
    <div onKeyDown={(e) => {
      if (e.ctrlKey && e.key === "F11") {
        e.preventDefault();
        onNewOpen();
      } else if (e.ctrlKey && e.shiftKey && e.key === "s") {
        e.preventDefault();
        onLoad();
      } else if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        onLoad();
      }
    }}>
      <Frame
        initialContent={code}
        className="w-full h-full overflow-auto"
        ref={frameRef}
        contentDidMount={handleMount}
        mountTarget="body"
        contentDidUpdate={handleUpdate}
      >
        <></>
      </Frame>
    </div>
  );
}
