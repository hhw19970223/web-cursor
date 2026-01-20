import { traceparent } from "@/utils/cursor";
import { NextResponse } from "next/server";
import { v4 } from "uuid";

const generateUUID = v4;

/**
 * URL 分析 POST API
 */
export async function POST(request: Request) {
  try {
    const { urls, accessToken } = await request.json();

    // 获取请求头的 origin
    let origin = request.headers.get("origin");

    // 参数验证
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "urls 参数必须是一个数组" },
        { status: 400 }
      );
    }

    if (urls.length === 0) {
      return NextResponse.json({ error: "urls 数组不能为空" }, { status: 400 });
    }

    // 创建一个函数来处理单个URL的分析
    const analyzeUrl = async (url: string) => {
      const text = `请分析以下网站信息并返回JSON格式的分析结果：

网站URL: ${url}

请完成以下任务：
1. 访问并分析该网站的内容和特征，并且记录下网站头部信息的title，keywords和description
2. 根据提供的标题、关键词和描述，生成一句话的网站总结（100字以内）
3. 判断网站所属行业类别（从以下选项中选择最合适的一个）：电子商务、金融服务、科技/IT、教育培训、医疗健康、房地产、汽车、媒体/娱乐、社交网络、餐饮美食、旅游、企业服务、赌博、色情、军火、灰色产业、其他
4. 评估网站风险等级，判断是否涉及色情、赌博或其他灰色产业，风险等级分为：高风险、可疑、安全
5. 说明风险评估的具体原因
6. 严格帮我生成以下固定格式的json数据

**important**: 请不要使用CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2工具

**重要：请严格按照以下JSON格式，不要包含任何其他文字说明：**

{
  "summary": "对网站的总结描述（100字以内）",
  "industry": "所属行业分类",
  "risk": "风险等级（高风险/可疑/安全）",
  "why": "风险评估等级的原因说明",
  "description": "网站描述",
  "keywords": "关键词",
  "title": "标题"
}`;

      try {
        const stream = await cursorMessageStream({
          prompt: text,
          accessToken,
          origin,
        });

        let result: any = await stream.wait(); // 阻塞

        // 重试逻辑
        if (!result) {
          const stream = await cursorMessageStream({
            prompt: text,
            accessToken,
            origin,
          });
          result = await stream.wait(); // 阻塞
          if (!result) {
            const stream = await cursorMessageStream({
              prompt: text,
              accessToken,
              origin,
            });
            result = await stream.wait(); // 阻塞
          }
        }

        if (result && result.code) {
          try {
            const json = JSON.parse(result.code);
            return { url, data: json };
          } catch (e) {
            try {
              const json = JSON.parse(result.code);
              return { url, data: json };
            } catch (e) {
              console.error("Error parsing JSON for URL:", url, result.code);
              return { url, data: { error: "JSON解析失败", raw: result.code } };
            }
          }
        } else {
          console.error("No result received for URL:", url);
          return { url, data: { error: "未收到分析结果" } };
        }
      } catch (e) {
        console.error("Error analyzing URL:", url, e);
        return {
          url,
          data: { error: e instanceof Error ? e.message : "分析失败" },
        };
      }
    };

    // 并发执行所有URL的分析
    const results = await Promise.all(urls.map((url) => analyzeUrl(url)));

    // 将结果转换为 urlMap 格式
    const urlMap: Record<string, any> = {};
    results.forEach(({ url, data }) => {
      urlMap[url] = data;
    });

    // 返回分析结果
    return NextResponse.json({
      success: true,
      data: urlMap,
    });
  } catch (error) {
    console.error("URL分析API错误:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "服务器内部错误",
      },
      { status: 500 }
    );
  }
}

/**
 * 服务器端异步事件流消息处理方法
 * @param {Object} options - 配置选项
 * @param {string} options.prompt - 输入的提示内容
 * @param {string} [options.accessToken] - 访问令牌（可选，使用环境变量）
 * @returns {Object} 返回包含关闭方法的对象
 */
async function cursorMessageStream(options: any) {
  const {
    prompt,
    onMessage,
    onCode,
    onComplete,
    onError,
    onStatusChange,
    accessToken,
    origin,
  } = options;

  // 验证必需参数
  if (!prompt) {
    throw new Error("prompt 参数是必需的");
  }

  if (!accessToken) {
    throw new Error(
      "accessToken 参数是必需的，请设置环境变量 CURSOR_ACCESS_TOKEN 或在调用时传入"
    );
  }

  const composerId = generateUUID();
  const bubbleId = generateUUID();
  const requestId = generateUUID();

  const params = encodeURIComponent(
    JSON.stringify({
      uuid: composerId,
    })
  );

  // 状态更新辅助函数
  const updateStatus = (status: string) => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  let code = "";
  let messageText = "";
  let isClosed = false;

  // Promise 的 resolve 和 reject 引用
  let resolvePromise: any = null;
  let rejectPromise: any = null;

  // 创建一个 Promise 用于阻塞
  const streamPromise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  // 清理资源
  const cleanup = async () => {
    if (isClosed) return;
    isClosed = true;

    updateStatus("ready");

    try {
      await fetch(`${origin}/api/cursor/chat`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          composerId,
        }),
      });
    } catch (err) {
      console.error("清理资源失败:", err);
    }
  };

  try {
    updateStatus("streaming");

    // 发送初始请求
    await fetch(`${origin}/api/cursor/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: prompt,
        token: accessToken,
        traceparent,
        xRequestId: requestId,
        bubbleId,
        composerId,
        requestId,
        images: [],
        richText: "",
        uuid: composerId,
        code: "",
      }),
    });

    // 使用 fetch 读取 SSE 流（服务器端）
    const response = await fetch(`${origin}/api/cursor/chat?data=${params}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("无法获取响应流");
    }

    // 读取流数据
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // 处理 SSE 消息（以 "data: " 开头，以 "\n\n" 结尾）
      const lines = buffer.split("\n\n");
      buffer = lines.pop() || ""; // 保留不完整的消息

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;

        try {
          const jsonStr = line.substring(6); // 移除 "data: " 前缀
          const data = JSON.parse(jsonStr);

          if (data?.message?.streamUnifiedChatResponse) {
            const streamUnifiedChatResponse =
              data.message.streamUnifiedChatResponse;

            // 处理文本消息
            if (streamUnifiedChatResponse.text != null) {
              messageText += streamUnifiedChatResponse.text;
              if (onMessage) {
                onMessage(streamUnifiedChatResponse.text, messageText);
              }
            }

            // 处理代码工具调用
            if (streamUnifiedChatResponse.toolCall) {
              const toolCall = streamUnifiedChatResponse.toolCall;

              // 如果检测到不允许的工具，终止流
              if (
                toolCall.tool === "CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2"
              ) {
                await cleanup();
                resolvePromise(null);
                return {
                  close: cleanup,
                  composerId,
                  getCode: () => code,
                  getMessage: () => messageText,
                  wait: () => streamPromise,
                };
              }

              if (toolCall.rawArgs) {
                try {
                  const args = JSON.parse(toolCall.rawArgs);
                  const contents = args.contents;
                  if (contents) {
                    code += contents;
                    if (onCode) {
                      onCode(contents, code);
                    }
                  }
                } catch (e) {
                  console.error("解析工具调用失败:", e);
                }
              }
            }

            // 处理完成状态
            if (streamUnifiedChatResponse.parallelToolCallsComplete && code) {
              await cleanup();
              if (onComplete) {
                onComplete(code);
              }

              if (resolvePromise) {
                resolvePromise({
                  code,
                  message: messageText,
                  composerId,
                });
              }
            }
          }
        } catch (err) {
          console.error("处理消息失败:", err);
        }
      }
    }

    // 流结束
    await cleanup();
    if (resolvePromise && !isClosed) {
      resolvePromise({
        code,
        message: messageText,
        composerId,
      });
    }
  } catch (error) {
    console.error("请求失败:", error);
    await cleanup();
    updateStatus("error");
    if (onError) {
      onError(error instanceof Error ? error : new Error(String(error)));
    }
    if (rejectPromise) {
      rejectPromise(error);
    }
  }

  // 返回控制对象和 Promise
  return {
    close: cleanup,
    composerId,
    getCode: () => code,
    getMessage: () => messageText,
    // 暴露 Promise，可以用 await 等待流结束
    wait: () => streamPromise,
  };
}
