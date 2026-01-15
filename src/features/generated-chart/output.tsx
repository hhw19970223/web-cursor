import Frame from "react-frame-component";
import { useGeneratedChartStore } from "./context";
import {  useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobalComponentsStore } from "@/stores/global-components";
import { Save, Loader2 } from "lucide-react";

export function Output() {
  const { code } = useGeneratedChartStore((selector) => selector);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [_iframeDocument, setIframeDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useGlobalComponentsStore();

  const filename = useMemo(() => {
    return `${uuidv4()}.html`;
  }, []);

  const onNewOpen = () => {
    const newWindow = window.open("", "_blank");
    newWindow?.document?.write?.(code);
  };

  const onLoad = async () => {
    setIsLoading(true);
    try {
      
      // 调用创建 HTML 接口
      const response = await fetch('/api/html/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          content: code,
        }),
      });

      if (!response.ok) {
        throw new Error('创建 HTML 文件失败');
      }

      const result = await response.json();
      
      // 成功后直接打开访问地址
      if (result.success && result.path) {
        window.open(result.path, '_blank');
        showToast("success", "保存成功");
      }
    } catch (error) {
      console.error('保存 HTML 文件失败:', error);
      showToast("error", "保存失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMount = () => {
    const iframe = frameRef.current;
    if (!iframe?.contentWindow) return;

    if (iframe.contentDocument) {
      setIframeDocument(iframe.contentDocument);
    }

    iframe.contentWindow.addEventListener("keydown", (e: KeyboardEvent) => {
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
    });
  };

  const handleUpdate = () => {};

  return (
    <div className="relative w-full h-full">
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
      
      {/* 悬浮保存按钮 */}
      <button
        onClick={onLoad}
        disabled={isLoading}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
        title="保存 HTML"
      >
        {isLoading ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <Save className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}