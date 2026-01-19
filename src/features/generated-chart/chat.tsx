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
import { ImageIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const jsonRef = useRef('');
  const jsonName = useRef('');

  const addUserMessage = useCallback(({ newText, images, selectedChartType, prompt, messages, json }: any) => {
    let name = jsonName.current;
    if (json) {
      jsonRef.current = json;
      jsonName.current = name = v4();
    }
   

    let promptText = ``;
    if (!messages || messages.length === 0) {
      promptText += `你好，你是一位专业的数据分析师和可视化图表生成助手。

你的主要任务是：
1. 仔细分析用户提供的数据结构
2. 总结数据的关键特征、趋势和洞察
3. 根据数据特点和用户需求，生成高质量的交互式图表

`;
    }  

    // 如果有表格数据，添加到提示文本中
    if (json) {
      promptText += `## 表格数据全在 @index.json中

### 表格数据结构说明：
- **数据格式**：对象结构，键为 Excel 工作表名称（如 "Sheet1"、"Sheet2" 等）
- **数据内容**：每个工作表对应一个数组，数组中每个元素是一个对象，代表表格的一行数据
- **字段名称**：对象的键来自 Excel 表格的列标题，值为对应的单元格数据
- **使用方式**：可以直接在 HTML 的 <script> 标签中使用这些常量，例如：\`const data = 文件名.Sheet1;\`

`;
    }

    promptText += json ? `请根据以下要求生成一个${selectedChartType}：

## 数据分析要求
- 深入分析提供的数据结构，识别数据类型、字段含义和数据关系
- 数据已经是 JSON 结构的数据
- 总结数据的关键统计信息（如总数、平均值、最大/最小值、趋势等）
- 提取有价值的数据洞察和发现
- 必须对所有数据进行分析
- 如果用户没有额外需求，请对数据进行智能分析，提取出有用的部分，并生成图表

## 代码生成要求
- 使用 HTML 单文件格式，包含完整的 HTML 结构（<!DOCTYPE html> 到 </html>）
- **数据加载方式**：必须使用 fetch 从外部 JSON 文件加载数据，禁止在 HTML 中硬编码数据
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
- 确保代码健壮性，包含必要的错误处理和数据加载失败的提示

## 输出格式
- 所有代码必须在一个 HTML 文件中
- 数据通过 fetch API 从外部 JSON 文件动态加载，不在 HTML 中硬编码
- 代码结构清晰，有适当的注释说明
- 直接生成可运行的完整代码，无需额外配置

## 用户额外需求
${prompt}

请先简要分析数据特征和结构，然后生成符合要求的完整代码。` : `@index.html 

- 用户额外需求：
${prompt}

- 表格数据全在 @index.json中

### 表格数据结构说明：
- **数据格式**：对象结构，键为 Excel 工作表名称（如 "Sheet1"、"Sheet2" 等）
- **数据内容**：每个工作表对应一个数组，数组中每个元素是一个对象，代表表格的一行数据
- **字段名称**：对象的键来自 Excel 表格的列标题，值为对应的单元格数据
- **使用方式**：可以直接在 HTML 的 <script> 标签中使用这些常量，例如：\`const data = 文件名.Sheet1;\`

`;

promptText += `
## 数据引用方式（重要）
${name ? `
- **禁止硬编码数据**：不要将数据直接写在 HTML 中
- **使用外部数据源**：数据已保存，可通过 API 访问 \`/api/json/${name}\`
- **数据加载方式**：必须使用以下方式从外部 JSON 文件加载数据：

\`\`\`javascript
// 在 HTML 的 <script> 标签中添加以下代码
fetch('/api/json/${name}')
  .then(response => response.json())
  .then(sourceData => {
    // sourceData 就是完整的数据对象
    // 可以通过 sourceData.Sheet1, sourceData.Sheet2 等访问不同工作表的数据
    // 在这里编写图表初始化代码
    initChart(sourceData);
  })
  .catch(error => {
    console.error('数据加载失败:', error);
  });
\`\`\`

- **变量命名**：将加载的数据赋值给变量 \`sourceData\`
- **数据结构**：sourceData 是一个对象，包含所有工作表数据（如 sourceData.Sheet1, sourceData.Sheet2）
- **示例代码结构**：
\`\`\`html
<script>
  // 从外部 JSON 文件加载数据
  fetch('/api/json/${name}')
    .then(response => response.json())
    .then(sourceData => {
      // 使用 sourceData 进行图表渲染
      const chartData = sourceData.Sheet1; // 访问 Sheet1 的数据
      
      // ECharts 图表配置
      const option = {
        // ... 使用 chartData 配置图表
      };
      
      const chart = echarts.init(document.getElementById('main'));
      chart.setOption(option);
    });
</script>
\`\`\`
` : ''}
`

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
        if (json) {
          await fetch('/api/json/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: name,
              data: JSON.parse(json)
            })
          });
        }
        
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
            json: json || jsonRef.current
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
        console.error(e);
        // @ts-expect-error message
        showToast('error', e?.message || '代码生成失败，请重试');
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

    let json = ''

    const images: any[] = [];

    if (message.files?.length) {
      for (const info of message.files) {
        // @ts-expect-error file
        const file = info.file;
        
        // 检查是否为表格文件
        const isExcel = file.name.match(/\.(xlsx|xls|csv)$/i);
        
        if (isExcel) {
          try {
            // 动态导入 xlsx 库
            const XLSX = await import('xlsx');
            
            // 读取文件
            const arrayBuffer = await file.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            // 获取文件名（去除扩展名并生成合法的变量名）
            // const fileName = file.name.replace(/\.(xlsx|xls|csv)$/i, '');
            
            // 解析所有 sheet
            const sheetsData: Record<string, any[]> = {};
            
            workbook.SheetNames.forEach(sheetName => {
              const worksheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(worksheet);
              sheetsData[sheetName] = jsonData;
            });
            

            images.push({
              data: info.url,
              uuid: v4(),
              // @ts-expect-error dimension
              dimension: info.dimension,
              type: file?.type,
              filename: file?.name,
            });

            console.log(sheetsData);

            json = JSON.stringify(sheetsData);

            break;
          } catch (error) {
            console.error('解析表格文件失败:', error);
            showToast('error', `解析文件 ${file.name} 失败`);
          }
        }
        // 非表格文件直接丢弃
      }
    }

    console.log(images);

    if (!(hasText || json)) {
      showToast('error', '请上传表格格式的文件');
      return;
    }

    // 将选中的图表类型添加到用户消息中
    const chartTypeLabel = CHART_TYPES.find(t => t.value === selectedChartType)?.label || "";
    const enhancedText = chartTypeLabel && json ? `请生成一个${chartTypeLabel}：${message.text}` : message.text;

    addUserMessage({
      newText: enhancedText,
      prompt: message.text,
      images,
      selectedChartType,
      messages,
      json
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
            <SelectTrigger className="w-[180px] h-9 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-blue-200/50 active:scale-100 active:translate-y-0">
              <SelectValue placeholder="选择图表类型" />
            </SelectTrigger>
            <SelectContent className="bg-white border-blue-200 shadow-xl shadow-blue-100/50 animate-in fade-in-0 zoom-in-95 duration-200">
              {CHART_TYPES.map((type) => (
                <SelectItem 
                  key={type.value} 
                  value={type.value}
                  className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:scale-[1.02] hover:shadow-sm hover:pl-3 focus:bg-gradient-to-r focus:from-blue-100 focus:to-indigo-100 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-100 data-[state=checked]:to-indigo-100 data-[state=checked]:text-blue-900 data-[state=checked]:font-semibold data-[state=checked]:shadow-sm data-[state=checked]:border-l-4 data-[state=checked]:border-l-blue-500 transition-all duration-150 rounded-md mx-1 my-0.5"
                >
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
                                <div key={index + ""} className="flex overflow-hidden">
                                  {file?.data ? (
                                    <div className="flex overflow-hidden">
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
