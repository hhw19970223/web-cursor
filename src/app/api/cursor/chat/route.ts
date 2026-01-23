import { NextResponse } from "next/server";
import { transportStream } from "../transport";
import { addConversation, composerMap, getConversation, getReqChatExample, getReqToolImgExample, getReqToolWebExample, getReqToolWebSearch } from "./request";
import { _tt, k7e, tools, Ur } from "../service/common";
import { v4 } from "uuid";
import { base64ToUint8ArrayInNode } from "@/utils/file";

const dataMap: any = {};

export async function DELETE(request: Request) { 
  const { composerId } = await request.json();
  delete composerMap[composerId];
  return NextResponse.json('', { status: 200 });
}

export async function POST(request: Request) {
  const { uuid, ...req } = await request.json();
  try {
    dataMap[uuid] = req;
    return NextResponse.json('', { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}   

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const { uuid } = JSON.parse(searchParams.get('data')!);
  
  try {

    const { token, traceparent, xRequestId, bubbleId, composerId, requestId, text, images, richText, code, ts, json, isThink } = dataMap[uuid];

    if (images?.length) {
      for (let i = 0; i < images.length; i++) {
        const image = images[i];
        if (image.dimension) {
          image.dimension = new k7e(image.dimension);
        }
        const uint8 = base64ToUint8ArrayInNode(image.data);
        image.data = uint8;
        image.taskSpecificDescription = `this The file name is ${image.filename}`
      }
    }

    const encoder = new TextEncoder();

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

          const queue = new AsyncQueue<any>();
          queue.push(new _tt({ request: getReqChatExample(bubbleId, composerId, requestId, text, images, richText, code, ts, json, isThink) }));  

          const y = async function* () {
            try {
              for await (const _ of queue) {
                if (request.signal.aborted) {
                  console.log('Request aborted before streaming started');
                  safeClose();
                  return;
                }
                yield _;
              }
            } finally {
            }
           
          };

          const doRes =  async (res: any) => {
            let web_search = false;
            for await (const chunk of res.message) {
              // 检查客户端是否已断开或流是否已关闭
              if (request.signal.aborted || isClosed) {
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
          
              if (chunk.response?.value?.partialToolCall?.tool
                ) {
                  const partialToolCall = chunk.response.value.partialToolCall;
                  const tool = tools.find(({no}) => no === partialToolCall.tool )?.name;
                
                  
                  if (tool === "CLIENT_SIDE_TOOL_V2_WEB_SEARCH") {
                    queue.push(new _tt({ request: getReqToolWebExample(partialToolCall.tool, partialToolCall.toolCallId, web_search) }));  
                  } else if (tool === 'CLIENT_SIDE_TOOL_V2_EDIT_FILE_V2') {
                    queue.push(new _tt({ request: getReqToolImgExample(partialToolCall.tool, partialToolCall.toolCallId) }));  
                  }
              } else if (chunk.response?.value?.name  === 'web_search') {
                queue.push(new _tt({ request: getReqToolWebSearch(chunk.response.value) }));  
                web_search = true;
              }

              if (chunk.response?.value?.text) {
                addConversation(composerId, getConversation(v4(), '', chunk.response.value.text, [], '', 2, '',  chunk.response.value.serverBubbleId || '', '', ''))
              }
            }
          }
          
          const res = await transportStream(token, cfg, 'aiserver.v1.ChatService', 'streamUnifiedChatWithTools', y);

          addConversation(composerId, getConversation(bubbleId, requestId, text, images, richText, 1, code, '', ts, json))

          // 检查是否在等待响应时已经被取消
          if (request.signal.aborted) {
            console.log('Request aborted before streaming started');
            safeClose();
            return;
          }

          await doRes(res);
          
          // 正常完成，关闭流
          safeClose();
        } catch (err) {
          console.error('Stream error:', err);
          if (!isClosed) {
            isClosed = true;
            try {
              // @ts-expect-error 1111
              const errorDetails = err?.details?.[0]?.debug?.details;
              console.error('errorDetails --------------->');
              console.error(errorDetails);
              // 发送 SSE 格式的错误消息
              const errorMessage = `data: ${JSON.stringify({ 
                error: true, 
                message: errorDetails || 'Stream error occurred',
                details: err
              })}\n\n`;
              controller.enqueue(encoder.encode(errorMessage));
              // 发送 SSE error 事件，触发前端 onerror
              const sseError = `event: error\ndata: ${JSON.stringify({ 
                error: errorDetails || 'Stream error occurred' 
              })}\n\n`;
              controller.enqueue(encoder.encode(sseError));
              controller.close();
            } catch (e) {
              // 如果无法发送错误，使用 error 方法强制触发前端错误
              console.error('Failed to send error message:', e);
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
  } finally {
    delete dataMap[uuid]
  }
}  

class AsyncQueue<T> {
  private values: T[] = [];
  private resolvers: ((value: IteratorResult<T>) => void)[] = [];
  private done = false;

  push(value: T) {
    if (this.done) return;
    if (this.resolvers.length > 0) {
      this.resolvers.shift()!({ value, done: false });
    } else {
      this.values.push(value);
    }
  }

  close() {
    this.done = true;
    for (const resolve of this.resolvers) resolve({ value: undefined as any, done: true });
    this.resolvers.length = 0;
  }

  [Symbol.asyncIterator]() {
    return {
      next: () =>
        new Promise<IteratorResult<T>>(resolve => {
          if (this.values.length > 0) {
            resolve({ value: this.values.shift()!, done: false });
          } else if (this.done) {
            resolve({ value: undefined as any, done: true });
          } else {
            this.resolvers.push(resolve);
          }
        }),
    };
  }
}

