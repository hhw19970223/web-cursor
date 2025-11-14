import { NextResponse } from "next/server";
import { transportStream } from "../transport";
import { reqExample } from "./request";
import { _tt } from "../service/common";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { token, traceparent,  xRequestId} = JSON.parse(searchParams.get('data')!);
  const encoder = new TextEncoder();
  
  try {
    const stream = new ReadableStream({
      async start(controller) {
        // 用于跟踪流状态和取消 gRPC 流
        let isClosed = false;
        
        // 安全关闭函数
        const safeClose = () => {
          if (!isClosed) {
            isClosed = true;
            try {
              controller.close();
            } catch (e) {
              // 忽略已关闭的流错误
              console.log('Stream already closed:', e);
            }
          }
        };

        // 客户端断开时清理
        const abortHandler = () => {
          console.log('Client disconnected, cleaning up...');
          safeClose();
          // 如果有 gRPC 流的取消方法，在这里调用
        };

        request.signal.addEventListener('abort', abortHandler);

        try {
          const cfg = {
            traceparent,
            "x-request-id": xRequestId,
            "x-amzn-trace-id": `Root=${xRequestId}`
          };
          
          const res = await transportStream(token, cfg, 'aiserver.v1.ChatService', 'streamUnifiedChatWithTools', new _tt({ request: reqExample }));
          
          // 检查是否在等待响应时已经被取消
          if (request.signal.aborted) {
            console.log('Request aborted before streaming started');
            safeClose();
            return;
          }

          for await (const chunk of res.message) {
            // 检查客户端是否已断开或流是否已关闭
            if (request.signal.aborted || isClosed) {
              console.log('Stream interrupted, stopping...');
              break;
            }

            try {
              // SSE 格式：每条消息前加 "data: "，后面两个换行
              const message = `data: ${JSON.stringify({ message: chunk })}\n\n`;
              controller.enqueue(encoder.encode(message));
            } catch (enqueueError) {
              console.error('Failed to enqueue message:', enqueueError);
              break;
            }
          }
          
          // 正常完成，关闭流
          safeClose();
        } catch (err) {
          console.error('Stream error:', err);
          if (!isClosed) {
            isClosed = true;
            try {
              // 发送错误信息给客户端
              const errorMessage = `data: ${JSON.stringify({ 
                error: err instanceof Error ? err.message : 'Unknown error' 
              })}\n\n`;
              controller.enqueue(encoder.encode(errorMessage));
              controller.close();
            } catch (e) {
              // 如果无法发送错误，使用 error 方法
              controller.error(err);
            }
          }
        } finally {
          // 清理事件监听器
          request.signal.removeEventListener('abort', abortHandler);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('GET handler error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}  

