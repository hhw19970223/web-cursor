
function X7c() {
  const i = new Uint8Array(16);
  return (
    crypto.getRandomValues(i),
    Array.from(i, (e) => e.toString(16).padStart(2, "0")).join("")
  );
}
function Q7c() {
  const i = new Uint8Array(8);
  return (
    crypto.getRandomValues(i),
    Array.from(i, (e) => e.toString(16).padStart(2, "0")).join("")
  );
}

const traceparent = `00-${X7c()}-${Q7c()}-00`;

// 生成 UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 纯 JavaScript 版本的异步事件流消息处理方法
 * @param {Object} options - 配置选项
 * @param {string} options.prompt - 输入的提示内容
 * @param {string} options.accessToken - 访问令牌
 * @param {string} [options.promptTemplate] - 可选的自定义提示词模板
 * @param {Function} options.onMessage - 接收文本消息的回调 (text: string) => void
 * @param {Function} options.onCode - 接收代码内容的回调 (code: string) => void
 * @param {Function} options.onComplete - 完成时的回调 (code: string) => void
 * @param {Function} [options.onError] - 错误时的回调 (error: Error) => void
 * @param {Function} [options.onStatusChange] - 状态变化的回调 (status: string) => void
 * @returns {Object} 返回包含关闭方法的对象
 */
async function cursorMessageStream(options) {
  const {
    prompt,
    onMessage,
    onCode,
    onComplete,
    onError,
    onStatusChange
  } = options;

  // 验证必需参数
  if (!prompt) {
    throw new Error('prompt 参数是必需的');
  }

  // 从 URL 参数中获取 accessToken
  const urlParams = new URLSearchParams(window.location.search);
  const accessToken = urlParams.get('accessToken') || '';
  
  if (!accessToken) {
    alert('accessToken 参数是必需的');
    throw new Error('accessToken 参数是必需的，请在 URL 中添加 ?accessToken=你的token');
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
  const updateStatus = (status) => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  let eventSource = null;
  let code = "";
  let messageText = "";
  let isClosed = false;

  // Promise 的 resolve 和 reject 引用
  let resolvePromise = null;
  let rejectPromise = null;

  // 创建一个 Promise 用于阻塞
  const streamPromise = new Promise((resolve, reject) => {
    resolvePromise = resolve;
    rejectPromise = reject;
  });

  // 关闭连接的方法
  const close = () => {
    if (isClosed) return;
    isClosed = true;
    
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    
    updateStatus("ready");
    
    // 清理资源
    fetch("/api/cursor/chat", {
      method: "DELETE",
      body: JSON.stringify({
        composerId
      }),
    }).catch(err => {
      console.error('清理资源失败:', err);
    });
  };

  try {
    updateStatus("streaming");

    // 发送初始请求
    await fetch("/api/cursor/chat", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
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
        code: '',
      }),
    });

    // 建立 EventSource 连接
    eventSource = new EventSource(`/api/cursor/chat?data=${params}`);

    eventSource.onmessage = (event) => {
      if (isClosed) return;

      try {
        const data = JSON.parse(event.data);
        if (data?.message?.streamUnifiedChatResponse) {
          const streamUnifiedChatResponse = data.message.streamUnifiedChatResponse;
          console.log(streamUnifiedChatResponse);
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
            if ('CLIENT_SIDE_TOOL_V2_RUN_TERMINAL_COMMAND_V2' === toolCall.tool) {
              resolvePromise(null);
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
                console.error('解析工具调用失败:', e);
              }
            }
          }

          // 处理完成状态
          if (streamUnifiedChatResponse.parallelToolCallsComplete && code) {
            close();
            if (onComplete) {
              onComplete(code);
            }
            // resolve Promise，结束阻塞
           
            if (resolvePromise) {
              resolvePromise({
                code,
                message: messageText,
                composerId
              });
            }
            console.log(code)
          }
        }
      } catch (err) {
        console.error('处理消息失败:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE 错误:", err);
      close();
      updateStatus("error");
      const error = new Error('事件流连接失败');
      if (onError) {
        onError(error);
      }
      // reject Promise，结束阻塞
      if (rejectPromise) {
        resolvePromise({
          code,
          message: messageText,
          composerId,
          error: err
        });
      }
    };

  } catch (error) {
    console.error('请求失败:', error);
    close();
    updateStatus("error");
    if (onError) {
      onError(error);
    }
    // reject Promise，结束阻塞
    if (rejectPromise) {
      rejectPromise(error);
    }
  }

  // 返回控制对象和 Promise
  return {
    close,
    composerId,
    getCode: () => code,
    getMessage: () => messageText,
    // 暴露 Promise，可以用 await 等待流结束
    wait: () => streamPromise
  };
}

/**
 * 使用示例：
 * 
 * // 基础使用（非阻塞，实时处理）
 * const stream = await cursorMessageStream({
 *   prompt: '<div>你的 HTML 代码</div>',
 *   accessToken: 'your-access-token',
 *   onMessage: (text, fullText) => {
 *     console.log('收到消息片段:', text);
 *     console.log('完整消息:', fullText);
 *   },
 *   onCode: (codeChunk, fullCode) => {
 *     console.log('收到代码片段:', codeChunk);
 *     console.log('完整代码:', fullCode);
 *     // 在这里可以实时更新UI显示代码
 *   },
 *   onComplete: (finalCode) => {
 *     console.log('代码生成完成!', finalCode);
 *   },
 *   onError: (error) => {
 *     console.error('发生错误:', error);
 *   },
 *   onStatusChange: (status) => {
 *     console.log('状态变化:', status); // "streaming", "ready", "error"
 *   }
 * });
 * 
 * // 如果需要手动关闭连接
 * // stream.close();
 * 
 * // 获取当前累积的代码
 * // const currentCode = stream.getCode();
 * 
 * // 获取当前累积的消息
 * // const currentMessage = stream.getMessage();
 * 
 * 
 * // 使用自定义提示词模板
 * const customStream = await cursorMessageStream({
 *   prompt: '你的内容',
 *   accessToken: 'your-access-token',
 *   promptTemplate: '你的自定义提示词模板，使用 $' + '{prompt} 占位符',
 *   onCode: (chunk, full) => { },
 *   onComplete: (code) => { }
 * });
 * 
 * // ✨ 新增：阻塞模式，等待事件流完成
 * const stream = await cursorMessageStream({
 *   prompt: '<div>你的 HTML 代码</div>',
 *   accessToken: 'your-access-token',
 *   onCode: (codeChunk, fullCode) => {
 *     console.log('实时更新代码');
 *   }
 * });
 * 
 * // 使用 wait() 方法阻塞，直到流结束
 * const result = await stream.wait();
 * console.log('流已结束，最终结果:', result);
 * // result = { code: '完整代码', message: '完整消息', composerId: 'uuid' }
 * 
 * // 或者使用 try-catch 处理错误
 * try {
 *   const stream = await cursorMessageStream({ 
 *     prompt: 'test',
 *     accessToken: 'xxx'
 *   });
 *   const result = await stream.wait(); // 阻塞等待流完成
 *   console.log('生成成功:', result.code);
 * } catch (error) {
 *   console.error('生成失败:', error);
 * }
 */  