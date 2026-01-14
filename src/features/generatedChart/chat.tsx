"use client";

import {
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
} from "@/components/ai-elements/message";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  ImageShow,
  PromptInput,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { MessageResponse } from "@/components/ai-elements/message";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import type { ToolUIPart } from "ai";
import { ImageIcon, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useGeneratedChartStore } from "./context";
import { v4 } from "uuid";
import { cn } from "@/utils/cn";
import { useLoginStore } from "@/stores/login";
import { traceparent } from "@/utils/cursor";
import LineLoading from "@/components/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalComponentsStore } from "@/stores/global-components";

type MessageType = {
  key: string;
  from: "user" | "assistant";
  sources?: { href: string; title: string }[];
  versions: {
    id: string;
    content: string;
    files?: {
      data: string;
      type: string;
      filename: string;
      dimension?: {
        height: number;
        width: number;
      };
    }[];
  }[];
  reasoning?: {
    content: string;
    duration: number;
  };
  tools?: {
    name: string;
    description: string;
    status: ToolUIPart["state"];
    parameters: Record<string, unknown>;
    result: string | undefined;
    error: string | undefined;
  }[];
};

const CHART_TYPES = [
  { value: "柱状图", label: "柱状图" },
  { value: "折线图", label: "折线图" },
  { value: "饼图", label: "饼图" },
  { value: "环形图", label: "环形图" },
  { value: "面积图", label: "面积图" },
  { value: "漏斗图", label: "漏斗图" },
  { value: "散点图", label: "散点图" },
  { value: "雷达图", label: "雷达图" },
  { value: "仪表盘", label: "仪表盘" },
  { value: "热力图", label: "热力图" },
  { value: "矩形树图", label: "矩形树图" },
  { value: "瀑布图", label: "瀑布图" },
];

export const Chat = () => {
  const [text, setText] = useState<string>("");
  const [composerId] = useState(v4());
  const [status, setStatus] = useState<
    "submitted" | "streaming" | "ready" | "error"
  >("ready");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedChartType, setSelectedChartType] = useState<string>(CHART_TYPES[0].value);

  const { showToast } = useGlobalComponentsStore();

  const { loginInfo } = useLoginStore();
  const { setCode, setNewCode, code: html } = useGeneratedChartStore(selector => selector);

  const addUserMessage = useCallback(({ newText, images, selectedChartType, prompt, messages, ts }: any) => {

    let promptText = ``;
    if (!messages || messages.length === 0) {
      promptText += `你好，你是一位专业的数据分析师和可视化图表生成助手。

你的主要任务是：
1. 仔细分析用户提供的数据结构（已解析为 JavaScript 对象格式）
2. 总结数据的关键特征、趋势和洞察
3. 根据数据特点和用户需求，生成高质量的交互式图表

`;
    }  

    // 如果有表格数据，添加到提示文本中
    if (ts) {
      promptText += `## @index.ts 已解析的数据结构（JavaScript 格式）：

### 数据结构说明：
- **变量名**：使用原始文件名作为常量名称（特殊字符已转换为下划线）
- **数据格式**：对象结构，键为 Excel 工作表名称（如 "Sheet1"、"Sheet2" 等）
- **数据内容**：每个工作表对应一个数组，数组中每个元素是一个对象，代表表格的一行数据
- **字段名称**：对象的键来自 Excel 表格的列标题，值为对应的单元格数据
- **使用方式**：可以直接在 HTML 的 <script> 标签中使用这些常量，例如：\`const data = 文件名.Sheet1;\`

`;
    }

    promptText += ts ? `请根据以下要求生成一个${selectedChartType}：

## 数据分析要求
- 深入分析提供的数据结构，识别数据类型、字段含义和数据关系
- 数据已经是 JavaScript 对象格式，可以直接在代码中使用
- 总结数据的关键统计信息（如总数、平均值、最大/最小值、趋势等）
- 提取有价值的数据洞察和发现

## 代码生成要求
- 使用 HTML 单文件格式，包含完整的 HTML 结构（<!DOCTYPE html> 到 </html>）
- 将上面提供的数据结构直接嵌入到 HTML 的 <script> 标签中
- 使用内联 CSS 样式（<style> 标签）进行美化
- 使用 ECharts（Apache ECharts）通过 CDN 方式引入：https://cdn.jsdelivr.net/npm/echarts@latest/dist/echarts.min.js
- 所有外部资源（包括字体、图标等）必须使用 CDN 引入，不能有本地路径引用
- 图表必须具有良好的交互性（如 tooltip、legend 点击切换、数据区域缩放等）
- 设计现代化、美观的样式，包括：
  * 合理的配色方案
  * 清晰的标题和说明文字
  * 适当的边距和间距
  * 响应式布局设计
  * 适配所有的分辨率
- 确保代码健壮性，包含必要的错误处理

## 输出格式
- 所有代码必须在一个 HTML 文件中
- 数据结构和图表逻辑都在同一个文件中
- 代码结构清晰，有适当的注释说明
- 直接生成可运行的完整代码，无需额外配置

## 用户额外需求
${prompt}

请先简要分析数据特征和结构，然后生成符合要求的完整代码。` : `@index.html 

- 用户额外需求：
${prompt}

`;

    const userMessage: MessageType = {
      key: `user-${Date.now()}`,
      from: "user",
      versions: [
        {
          id: `user-${Date.now()}`,
          content: newText,
          files: images,
        },
      ],
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(async () => {
      const assistantMessageId = `assistant-${Date.now()}`;

      const assistantMessage: MessageType = {
        key: `assistant-${Date.now()}`,
        from: "assistant",
        versions: [
          {
            id: assistantMessageId,
            content: "",
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      const bubbleId = v4();
      const requestId = v4();

      const params = encodeURIComponent(
        JSON.stringify({
          uuid: composerId,
        })
      );

      setStatus("streaming");

      try {
        await fetch("/api/cursor/chat", {
          method: "POST",
          body: JSON.stringify({
            text: promptText,
            token: loginInfo?.accessToken,
            traceparent,
            xRequestId: requestId,
            bubbleId,
            composerId,
            requestId,
            images: [],
            richText: "",
            uuid: composerId,
            code:  html,
            ts
          }),
        });

        const eventSource = new EventSource(`/api/cursor/chat?data=${params}`);

        let code = "";

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data?.message?.streamUnifiedChatResponse) {
            const streamUnifiedChatResponse = data.message.streamUnifiedChatResponse;
            console.log(data.message);
            console.warn(streamUnifiedChatResponse.text);

            if (streamUnifiedChatResponse.thinking?.text != null) {
              assistantMessage.versions[0].content +=
                streamUnifiedChatResponse.thinking.text;
              setMessages((prev) => [...prev]);
            }

            if (streamUnifiedChatResponse.text != null) {
              assistantMessage.versions[0].content +=
                streamUnifiedChatResponse.text;
              setMessages((prev) => [...prev]);
            }

            if (streamUnifiedChatResponse.toolCall) {
              const toolCall = streamUnifiedChatResponse.toolCall;
              if (toolCall.rawArgs) {
                try {
                  const args = JSON.parse(toolCall.rawArgs);
                  const contents = args.contents;
                  if (contents) {
                    if (!code) {
                      code = contents;
                      setNewCode(code);
                    } else {
                      code += contents;
                      setCode(code);
                    }
                  }
                  
                } catch (e) {
                  console.error(e);
                }
              }
            }

            if (streamUnifiedChatResponse.parallelToolCallsComplete && code) {
              onClose();
            }
          }
        };

        const onClose = () => {
          eventSource?.close();
          setStatus("ready");
        };

        eventSource.onerror = (err) => {
          console.error("SSE error:", err);
          eventSource.close();
          setStatus("ready");
        };
      } catch (e) {
        setStatus("ready");
      }
    }, 500);
  }, []);

  const handleSubmit = async (message: PromptInputMessage) => {
    if (status === "streaming") return;


    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      showToast('error', '请上传文件或输入额外需求');
      return;
    }

    setStatus("submitted");

    let ts = ''

    const images: any[] = [];

    if (message.files?.length) {
      for (const info of message.files) {
        // @ts-expect-error file
        const file = info.file;
        
        // 检查是否为表格文件
        const isExcel = file.name.match(/\.(xlsx|xls|csv)$/i);
        
        if (isExcel) {
          images.push({
            data: info.url,
            uuid: v4(),
            // @ts-expect-error dimension
            dimension: info.dimension,
            type: file?.type,
            filename: file?.name,
          });
          try {
            // 动态导入 xlsx 库
            const XLSX = await import('xlsx');
            
            // 读取文件
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            // 获取文件名（去除扩展名并生成合法的变量名）
            const fileName = file.name.replace(/\.(xlsx|xls|csv)$/i, '');
            
            // 解析所有 sheet
            const sheetsData: Record<string, any[]> = {};
            
            workbook.SheetNames.forEach(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              sheetsData[sheetName] = jsonData;
            });
            
            // 生成代码字符串
            const dataString = `const ${fileName} = ${JSON.stringify(sheetsData, null, 2)};\n\n`;
            ts += dataString;
          } catch (error) {
            console.error('解析表格文件失败:', error);
            showToast('error', `解析文件 ${file.name} 失败`);
          }
        }
        // 非表格文件直接丢弃
      }
    }

    console.log(images);

    if (!(hasText || ts)) {
      showToast('error', '请上传表格格式的文件');
      return;
    }

    // 将选中的图表类型添加到用户消息中
    const chartTypeLabel = CHART_TYPES.find(t => t.value === selectedChartType)?.label || "";
    const enhancedText = chartTypeLabel && ts ? `请生成一个${chartTypeLabel}：${message.text}` : message.text;

    addUserMessage({
      newText: enhancedText,
      prompt: message.text,
      images,
      selectedChartType,
      messages,
      ts: ts
    });
    setText("");
  };

  useEffect(() => {
    return () => {
      fetch("/api/cursor/chat", {
        method: "DELETE",
        body: JSON.stringify({
          composerId
        }),
      })
    }
  }, [])

  return (
    <div className="relative flex size-full flex-col divide-y overflow-hidden">
      {/* 图表类型选择器 */}
      <div className="shrink-0 border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            图表类型：
          </label>
          <Select value={selectedChartType} onValueChange={setSelectedChartType}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="选择图表类型" />
            </SelectTrigger>
            <SelectContent>
              {CHART_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Conversation>
        <ConversationContent>
          {messages.map(({ versions, ...message }) => (
            <MessageBranch defaultBranch={0} key={message.key}>
              <MessageBranchContent>
                {versions.map((version) => (
                  <Message
                    from={message.from}
                    key={`${message.key}-${version.id}`}
                  >
                    <div>
                      {message.sources?.length && (
                        <Sources>
                          <SourcesTrigger count={message.sources.length} />
                          <SourcesContent>
                            {message.sources.map((source) => (
                              <Source
                                href={source.href}
                                key={source.href}
                                title={source.title}
                              />
                            ))}
                          </SourcesContent>
                        </Sources>
                      )}
                      {message.reasoning && (
                        <Reasoning duration={message.reasoning.duration}>
                          <ReasoningTrigger />
                          <ReasoningContent>
                            {message.reasoning.content}
                          </ReasoningContent>
                        </Reasoning>
                      )}
                      {version.files?.length ? (
                        <MessageContent className="group-[.is-user]:bg-none mb-4 max-w-full overflow-hidden">
                          <div
                            className={cn(
                              "flex flex-wrap items-center gap-2 p-3"
                            )}
                          >
                            {version.files.map((file, index) => {
                              return (
                                <div key={index + ""}>
                                  {file?.data ? (
                                    <div>
                                      <ImageShow
                                        data={file.data}
                                        type={file.type}
                                        filename={file.filename}
                                      />
                                    </div>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </MessageContent>
                      ) : null}

                      <MessageContent>
                        <MessageResponse>{version.content}</MessageResponse>
                      </MessageContent>
                    </div>
                  </Message>
                ))}
              </MessageBranchContent>
              {versions.length > 1 && (
                <MessageBranchSelector from={message.from}>
                  <MessageBranchPrevious />
                  <MessageBranchPage />
                  <MessageBranchNext />
                </MessageBranchSelector>
              )}
            </MessageBranch>
          ))}
          {status === "streaming" ? (
            <div className="mb-4">
              <LineLoading />
            </div>
          ) : null}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="grid shrink-0 gap-4 pt-4">
        <div className="w-full px-4 pt-2 pb-4 max-w-full overflow-hidden">
          <div className="w-full max-w-full">
            <PromptInputProvider>
              <PromptInput globalDrop multiple onSubmit={handleSubmit}>
                <PromptInputHeader>
                  <PromptInputAttachments>
                    {(attachment) => (
                      <PromptInputAttachment data={attachment} />
                    )}
                  </PromptInputAttachments>
                </PromptInputHeader>
                <PromptInputBody>
                  <PromptInputTextarea
                    onChange={(event) => setText(event.target.value)}
                    value={text}
                    placeholder="请提出你的额外需求"
                  />
                </PromptInputBody>
                <PromptInputFooter>
                  <UploadImg />
                  <PromptInputSubmit
                    disabled={status === "streaming"}
                    status={status}
                  />
                </PromptInputFooter>
              </PromptInput>
            </PromptInputProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

function UploadImg() {
  const attachments = usePromptInputAttachments();

  return (
    <div
      className="rounded-sm bg-white border border-gray-200 p-1 cursor-pointer hover:bg-gray-50"
      onClick={(e) => {
        e.preventDefault();
        attachments.openFileDialog();
      }}
    >
      <ImageIcon className="size-4" />
    </div>
  );
}
