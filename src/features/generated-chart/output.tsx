import Frame from "react-frame-component";
import { useGeneratedChartStore } from "./context";
import {  useMemo, useRef, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGlobalComponentsStore } from "@/stores/global-components";
import { Save, Loader2, Check, X, Image as ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";

export function Output() {
  const { code } = useGeneratedChartStore((selector) => selector);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [_iframeDocument, setIframeDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isPngLoading, setIsPngLoading] = useState(false);
  const [pngStatus, setPngStatus] = useState<'idle' | 'success' | 'error'>('idle');
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

  // PNG状态自动重置
  useEffect(() => {
    if (pngStatus !== 'idle') {
      const timer = setTimeout(() => {
        setPngStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [pngStatus]);

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

  // 将HTML转换为PNG图片
  const onConvertToPng = async () => {
    setIsPngLoading(true);
    setPngStatus('idle');
    try {
      const iframe = frameRef.current;
      if (!iframe?.contentDocument?.body) {
        throw new Error('无法获取iframe内容');
      }

      // 使用html2canvas将iframe内容转换为canvas
      const canvas = await html2canvas(iframe.contentDocument.body, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        scale: 2, // 提高清晰度
      });

      // 将canvas转换为blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('生成图片失败');
        }

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chart-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setPngStatus('success');
        showToast("success", "PNG图片已下载");
      }, 'image/png');

    } catch (error) {
      console.error('转换为PNG失败:', error);
      setPngStatus('error');
      showToast("error", "转换失败，请重试");
    } finally {
      setIsPngLoading(false);
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
        <div className="absolute top-4 right-4 z-[50] flex gap-3">
          {/* 保存HTML按钮 */}
          <div className="group">
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

          {/* 转换为PNG按钮 */}
          <div className="group">
            <button
              onClick={onConvertToPng}
              disabled={isPngLoading}
              className={`relative w-[64px] h-[64px] text-purple-200 p-2 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:cursor-not-allowed transform hover:scale-110 active:scale-95
                ${pngStatus === 'success' ? 'bg-gradient-to-br from-green-500 to-green-600' : 
                  pngStatus === 'error' ? 'bg-gradient-to-br from-red-500 to-red-600' : 
                  'bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'}
                ${isPngLoading ? 'from-purple-400 to-purple-500' : ''}
              `}
              title={pngStatus === 'success' ? '下载成功' : pngStatus === 'error' ? '转换失败' : '转换为 PNG'}
            >
              {/* 按钮光晕效果 */}
              <div className={`absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300
                ${pngStatus === 'success' ? 'bg-green-400' : 
                  pngStatus === 'error' ? 'bg-red-400' : 
                  'bg-purple-400'}
              `}></div>
              
              {/* 图标 */}
              <div className="relative z-10">
                {isPngLoading ? (
                  <Loader2 className="w-7 h-7 animate-spin" />
                ) : pngStatus === 'success' ? (
                  <Check className="w-7 h-7 drop-shadow-md animate-in zoom-in duration-200" />
                ) : pngStatus === 'error' ? (
                  <X className="w-7 h-7 drop-shadow-md animate-in zoom-in duration-200" />
                ) : (
                  <ImageIcon className="w-6 h-6 drop-shadow-md" />
                )}
              </div>
              
              {/* 按钮边框高光 */}
              <div className="absolute inset-0 rounded-full ring-2 ring-white/20 ring-inset"></div>
              
              {/* 进度环效果 */}
              {isPngLoading && (
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

          
        </div>
      ) : null}
    </div>
  );
}