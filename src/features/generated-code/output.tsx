import Frame from "react-frame-component";
import { useGeneratedCodeStore } from "./context";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { aria_browseract_tag, dealDom } from "@/utils/dom";
import { debounce } from "lodash";

export function Output() {
  const { code } = useGeneratedCodeStore((selector) => selector);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [iframeDocument, setIframeDocument] = useState<Document | null>(null);

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
    const iframe = frameRef.current;
    if (!iframe?.contentWindow) return;

    if (iframe.contentDocument) {
      setIframeDocument(iframe.contentDocument);
    }

    iframe.contentWindow.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "F11") {
        e.preventDefault();
        onNewOpen();
      } else if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        onLoad();
      }
    });
  };

  const handleUpdate = () => {};

  return (
    <Frame
      initialContent={code}
      className="w-full h-full overflow-auto"
      ref={frameRef}
      contentDidMount={handleMount}
      mountTarget="body"
      contentDidUpdate={handleUpdate}
    >
      {iframeDocument && frameRef.current?.contentWindow ? (
        <Business
          document={iframeDocument}
          window={frameRef.current.contentWindow}
        />
      ) : null}
    </Frame>
  );
}

const containerId = "browserActCustomField";
const selectionBoxId = "selectionBox";

const colors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFA500",
  "#800080",
  "#008080",
  "#FF69B4",
  "#4B0082",
  "#FF4500",
  "#2E8B57",
  "#DC143C",
  "#4682B4",
];

function Business({
  document,
  window,
}: {
  document: Document;
  window: Window;
}) {
  const isSelecting = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const { selector, addTag, delTag } = dealDom(document.body);
  const onUpdateList = useRef<Function[]>([]);
  const { setSelectTags } = useGeneratedCodeStore((selector) => selector);

  const updateSelection = (
    left: number,
    top: number,
    width: number,
    height: number
  ) => {
    clearSelection();

    const selectionBox = document.getElementById(selectionBoxId) as HTMLElement;

    const container = document.getElementById(containerId) as HTMLElement;

    // 获取所有可选择的元素（排除选择框本身和 body）
    const allElements = selector((dom) => {
      if (
        dom.id === selectionBoxId ||
        dom.id === containerId ||
        dom.tagName === "body" ||
        dom.tagName === "html"
      ) {
        return false;
      } else if (selectionBox.contains(dom)) {
        return false;
      } else if (container?.contains(dom)) {
        return false;
      } else if (dom.clientHeight <= 15 || dom.clientWidth <= 15) { // 太小不处理
        return false;
      } else {
        return true;
      }
    });

    if (allElements.length) {
      addTag();

      const list: { tag: string; color: string }[] = []

      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement("div");
        container.id = containerId;
        container.style.overflow = "hidden";
        container.style.position = "absolute";
        container.style.pointerEvents = "none";
        container.style.top = "0";
        container.style.left = "0";
        container.style.bottom = "0";
        container.style.right = "0";
        container.style.width = "100%";
        container.style.height = "100%";
        container.style.zIndex = "2147483647";
        container.style.backgroundColor = "transparent";
        container.style.cursor = "not-allowed";
        document.body.appendChild(container);
      }

      for (let i = 0; i < allElements.length; i++) {
        const element = allElements[i];

        const rect = element.getBoundingClientRect();
        if (!rect) continue;

        // 检查元素是否在选择框内（部分重叠也算选中）
        if (
          isOverlapping(
            left,
            top,
            width,
            height,
            rect.left,
            rect.top,
            rect.width,
            rect.height
          )
        ) {
          try {
            const colorIndex = i % colors.length;
            const baseColor = colors[colorIndex];
            const backgroundColor = baseColor + "1A";

            if (rect.width === 0 || rect.height === 0) continue; // Skip empty rects

            const overlay = document.createElement("div");
            const label = document.createElement("div");
            const calc = (rect: DOMRect) => {
              const { x: I, y: o } = (() => {
                const { x: C, y: c } = rect;
                const u =
                  Number.parseFloat(getComputedStyle(document.body).zoom) || 1;
                const f = window.pageXOffset;
                const m = window.pageYOffset;
                return {
                  x: (C + f) / u,
                  y: (c + m) / u,
                };
              })();

              overlay.style.position = "absolute";
              overlay.style.border = `3px solid ${baseColor}`;
              overlay.style.backgroundColor = backgroundColor;
              overlay.style.pointerEvents = "none";
              overlay.style.boxSizing = "border-box";
              overlay.style.cursor = "default";
              overlay.style.transform = `translate(${I}px, ${o}px)`;
              overlay.style.width = `${rect.width}px`;
              overlay.style.height = `${rect.height}px`;

              label.style.position = "absolute";
              label.style.background = baseColor;
              label.style.color = "white";
              label.style.padding = "1px 4px";
              label.style.borderRadius = "4px";
              label.style.transform = `translate(${I}px, ${o}px)`;
              label.style.fontSize = `${Math.min(
                12,
                Math.max(8, rect.height / 2)
              )}px`;
              label.textContent = element.getAttribute(aria_browseract_tag);


              container.style.height =
                document.documentElement.scrollHeight + "px";
            };

            calc(rect);

            const updatePositions = () => {
              const newRects = element.getBoundingClientRect();

              calc(newRects);
            };

            onUpdateList.current.push(updatePositions);

            container.appendChild(overlay);
            container.appendChild(label);
            list.push({
              tag: element.getAttribute(aria_browseract_tag) || '',
              color: baseColor,
            });
          } catch (error) {
            console.error(error);
          }
        }
      }

      setSelectTags(list);
    }
  };

  // 检查两个矩形是否重叠
  const isOverlapping = (
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ) => {
    // return !(x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1);

    // 选择框的边界
    const selectionLeft = x1;
    const selectionRight = x1 + w1;
    const selectionTop = y1;
    const selectionBottom = y1 + h1;
    
    // 元素的边界
    const elementLeft = x2;
    const elementRight = x2 + w2;
    const elementTop = y2;
    const elementBottom = y2 + h2;
    
    // 检查宽度是否完全在选择框内
    const widthFullyInside = elementLeft >= selectionLeft && elementRight <= selectionRight;
    
    // 检查高度是否完全在选择框内
    const heightFullyInside = elementTop >= selectionTop && elementBottom <= selectionBottom;
    
    // 检查两个矩形是否有重叠（在X轴和Y轴都有重叠）
    const hasOverlapX = !(selectionRight < elementLeft || elementRight < selectionLeft);
    const hasOverlapY = !(selectionBottom < elementTop || elementBottom < selectionTop);
    const hasOverlap = hasOverlapX && hasOverlapY;
    
    // 宽度完全在区域内并且有重合，或者高度完全在区域内并且有重合
    return (widthFullyInside && hasOverlap) || (heightFullyInside && hasOverlap);
  };

  // 清除选中状态
  const clearSelection = () => {
    const container = document.getElementById(containerId);
    container?.remove();
    onUpdateList.current.length = 0;
    delTag();
    setSelectTags([]);
  };
  const onKeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey && !isSelecting.current) {
      document.body.style.cursor = "crosshair";
      document.body.style.userSelect = "none";
    }
  };

  const onKeyup = (e: KeyboardEvent) => {
    if (!e.ctrlKey && !isSelecting.current) {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };

  const onMousedown = (e: MouseEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      isSelecting.current = true;
      const selectionBox = document.getElementById(
        selectionBoxId
      ) as HTMLElement;
      if (selectionBox) {
        startX.current = e.clientX;
        startY.current = e.clientY;

        selectionBox.style.left = startX.current + "px";
        selectionBox.style.top = startY.current + "px";
        selectionBox.style.width = "0px";
        selectionBox.style.height = "0px";
        selectionBox.style.display = "block";

        // 清除之前的选中状态
        clearSelection();
      }
    }
  };

  const onMousemove = (e: MouseEvent) => {
    if (isSelecting.current) {
      const currentX = e.clientX;
      const currentY = e.clientY;

      const selectionBox = document.getElementById(
        selectionBoxId
      ) as HTMLElement;
      if (selectionBox) {
        const left = Math.min(startX.current, currentX);
        const top = Math.min(startY.current, currentY);
        const width = Math.abs(currentX - startX.current);
        const height = Math.abs(currentY - startY.current);

        selectionBox.style.left = left + "px";
        selectionBox.style.top = top + "px";
        selectionBox.style.width = width + "px";
        selectionBox.style.height = height + "px";

        // 更新选中的元素
        updateSelection(left, top, width, height);
      }
    }
  };

  const onMouseup = (e: MouseEvent) => {
    if (isSelecting.current) {
      isSelecting.current = false;
      const selectionBox = document.getElementById(
        selectionBoxId
      ) as HTMLElement;
      if (selectionBox) {
        selectionBox.style.display = "none";
      }

      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  };

  const onSelectstart = (e: any) => {
    if (isSelecting.current || (e.ctrlKey && e.button === 0)) {
      e.preventDefault();
    }
  };

  const throttledUpdatePositions = useCallback(
    debounce(() => {
      for (const onUpdate of onUpdateList.current) {
        try {
          onUpdate();
        } catch (error) {
          console.error(error);
        }
      }
    }, 60),
    []
  );

  useEffect(() => {
    // 监听 Ctrl 键按下
    document.addEventListener("keydown", onKeydown);

    // 监听 Ctrl 键释放
    document.addEventListener("keyup", onKeyup);

    // 鼠标按下事件
    document.addEventListener("mousedown", onMousedown);

    // 鼠标移动事件
    document.addEventListener("mousemove", onMousemove);

    // 鼠标释放事件
    document.addEventListener("mouseup", onMouseup);

    // 防止 Ctrl+拖拽时触发文本选择
    document.addEventListener("selectstart", onSelectstart);

    window.addEventListener("scroll", throttledUpdatePositions, true);
    window.addEventListener("resize", throttledUpdatePositions);

    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("keyup", onKeyup);
      document.removeEventListener("mousedown", onMousedown);
      document.removeEventListener("mousemove", onMousemove);
      document.removeEventListener("mouseup", onMouseup);
      document.removeEventListener("selectstart", onSelectstart);

      window.removeEventListener("scroll", throttledUpdatePositions, true);
      window.removeEventListener("resize", throttledUpdatePositions);
    };
  }, []);

  return (
    <>
      <div
        id={selectionBoxId}
        style={{
          position: "fixed",
          border: "2px dashed #00d9a3",
          background: "rgba(0, 217, 163, 0.1)",
          pointerEvents: "none",
          display: "none",
          zIndex: 9999,
        }}
      ></div>
    </>
  );
}
