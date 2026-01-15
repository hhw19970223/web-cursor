import Frame from "react-frame-component";
import { useGeneratedChartStore } from "./context";
import {  useMemo, useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobalComponentsStore } from "@/stores/global-components";
import { Save, Loader2, Check, X } from "lucide-react";

export function Output() {
  const { code } = useGeneratedChartStore((selector) => selector);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [_iframeDocument, setIframeDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { showToast } = useGlobalComponentsStore();

  const filename = useMemo(() => {
    return `${uuidv4()}.html`;
  }, []);

  // 状态自动重置
  useEffect(() => {
    if (saveStatus !== 'idle') {
      const timer = setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const onNewOpen = () => {
    const newWindow = window.open("", "_blank");
    newWindow?.document?.write?.(code);
  };

  const onLoad = async () => {
    setIsLoading(true);
    setSaveStatus('idle');
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
        setSaveStatus('success');
        window.open(result.path, '_blank');
        showToast("success", "保存成功");
      }
    } catch (error) {
      console.error('保存 HTML 文件失败:', error);
      setSaveStatus('error');
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
    <div className="relative w-full h-full overflow-hidden max-h-full">
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
      {code ? (
        <div className="absolute top-4 right-4 z-[50] group">
          <button
            onClick={onLoad}
            disabled={isLoading}
            className={`relative w-[64px] h-[64px] text-blue-200 p-2  rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed transform hover:scale-110 active:scale-95
              ${saveStatus === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' : 
                saveStatus === 'error' ? 'bg-gradient-to-br from-red-500 to-red-600' : 
                'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}
              ${isLoading ? 'from-blue-400 to-blue-500' : ''}
            `}
            title={saveStatus === 'success' ? '保存成功' : saveStatus === 'error' ? '保存失败' : '保存 HTML'}
          >
            {/* 按钮光晕效果 */}
            <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300
              ${saveStatus === 'success' ? 'bg-green-400' : 
                saveStatus === 'error' ? 'bg-red-400' : 
                'bg-blue-400'}
            `}></div>
            
            {/* 图标 */}
            <div className="relative z-10">
              {isLoading ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : saveStatus === 'success' ? (
                <Check className="w-7 h-7 drop-shadow-md animate-in zoom-in duration-200" />
              ) : saveStatus === 'error' ? (
                <X className="w-7 h-7 drop-shadow-md animate-in zoom-in duration-200" />
              ) : (
                <Save className="w-6 h-6 drop-shadow-md" />
              )}
            </div>
            
            {/* 按钮边框高光 */}
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 ring-inset"></div>
            
            {/* 进度环效果 */}
            {isLoading && (
              <div className="absolute inset-0 rounded-full">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r="30"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    strokeDasharray="188.4"
                    strokeDashoffset="0"
                    className="animate-pulse"
                  />
                </svg>
              </div>
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}