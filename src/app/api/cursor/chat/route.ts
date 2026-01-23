import { NextResponse } from "next/server";
import { transportStream } from "../transport";
import { addConversation, composerMap, getConversation, getReqChatExample, getReqToolImgExample, getReqToolWebExample, getReqToolWebSearch } from "./request";
import { _tt, k7e, tools, Ur } from "../service/common";
import { v4 } from "uuid";
import { base64ToUint8ArrayInNode } from "@/utils/file";

const dataMap: any = {};

// 分段上传的临时存储
interface ChunkUpload {
  chunks: any[];  // 存储所有数据块
  totalChunks: number;  // 总块数
  receivedChunks: number;  // 已接收块数
  createdAt: number;  // 创建时间
}

const chunkUploadMap: Record<string, ChunkUpload> = {};

// 清理超过30分钟的过期上传会话
setInterval(() => {
  const now = Date.now();
  const thirtyMinutes = 30 * 60 * 1000;
  Object.keys(chunkUploadMap).forEach(key => {
    if (now - chunkUploadMap[key].createdAt > thirtyMinutes) {
      delete chunkUploadMap[key];
    }
  });
}, 5 * 60 * 1000); // 每5分钟清理一次

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

/**
 * PUT 方法：分段上传数据块
 * 请求体格式：
 * {
 *   uuid: string,           // 上传会话的唯一标识
 *   chunkIndex: number,     // 当前块的索引（从0开始）
 *   totalChunks: number,    // 总块数
 *   chunkData: any          // 当前块的数据
 * }
 */
export async function PUT(request: Request) {
  try {
    const { uuid, chunkIndex, totalChunks, chunkData } = await request.json();

    // 验证参数
    if (!uuid || chunkIndex === undefined || !totalChunks || chunkData === undefined) {
      return NextResponse.json({ 
        error: '缺少必要参数：uuid, chunkIndex, totalChunks, chunkData' 
      }, { status: 400 });
    }

    if (chunkIndex < 0 || chunkIndex >= totalChunks) {
      return NextResponse.json({ 
        error: `无效的 chunkIndex: ${chunkIndex}，应在 0 到 ${totalChunks - 1} 之间` 
      }, { status: 400 });
    }

    // 初始化或获取上传会话
    if (!chunkUploadMap[uuid]) {
      chunkUploadMap[uuid] = {
        chunks: new Array(totalChunks),
        totalChunks,
        receivedChunks: 0,
        createdAt: Date.now()
      };
    }

    const uploadSession = chunkUploadMap[uuid];

    // 验证总块数是否一致
    if (uploadSession.totalChunks !== totalChunks) {
      return NextResponse.json({ 
        error: `totalChunks 不一致：期望 ${uploadSession.totalChunks}，收到 ${totalChunks}` 
      }, { status: 400 });
    }

    // 存储数据块（允许重复上传，用于重试机制）
    if (uploadSession.chunks[chunkIndex] === undefined) {
      uploadSession.receivedChunks++;
    }
    uploadSession.chunks[chunkIndex] = chunkData;

    return NextResponse.json({
      success: true,
      receivedChunks: uploadSession.receivedChunks,
      totalChunks: uploadSession.totalChunks,
      isComplete: uploadSession.receivedChunks === uploadSession.totalChunks
    }, { status: 200 });

  } catch (error) {
    console.error('分段上传错误:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '分段上传失败' 
    }, { status: 500 });
  }
}

/**
 * PATCH 方法：完成上传并合并数据
 * 请求体格式：
 * {
 *   uuid: string            // 上传会话的唯一标识
 * }
 */
export async function PATCH(request: Request) {
  try {
    const { uuid } = await request.json();

    if (!uuid) {
      return NextResponse.json({ 
        error: '缺少必要参数：uuid' 
      }, { status: 400 });
    }

    const uploadSession = chunkUploadMap[uuid];

    if (!uploadSession) {
      return NextResponse.json({ 
        error: `未找到上传会话：${uuid}` 
      }, { status: 404 });
    }

    // 检查是否所有块都已上传
    if (uploadSession.receivedChunks !== uploadSession.totalChunks) {
      return NextResponse.json({ 
        error: `上传未完成：已收到 ${uploadSession.receivedChunks}/${uploadSession.totalChunks} 块`,
        receivedChunks: uploadSession.receivedChunks,
        totalChunks: uploadSession.totalChunks
      }, { status: 400 });
    }

    // 检查是否有缺失的块
    for (let i = 0; i < uploadSession.totalChunks; i++) {
      if (uploadSession.chunks[i] === undefined) {
        return NextResponse.json({ 
          error: `数据块 ${i} 缺失`,
          missingChunkIndex: i
        }, { status: 400 });
      }
    }

    // 合并数据块
    // 假设每个块是对象的一部分，需要合并成完整的请求对象
    let mergedData: any = {};
    
    // 如果数据块是对象片段，进行深度合并
    for (const chunk of uploadSession.chunks) {
      if (typeof chunk === 'object' && chunk !== null) {
        mergedData = { ...mergedData, ...chunk };
      }
    }

    // 如果数据块是字符串，直接拼接
    if (typeof uploadSession.chunks[0] === 'string') {
      mergedData = uploadSession.chunks.join('');
    }

    // 如果数据块是数组，合并数组
    if (Array.isArray(uploadSession.chunks[0])) {
      mergedData = uploadSession.chunks.flat();
    }

    // 存储合并后的数据到 dataMap
    dataMap[uuid] = JSON.parse(mergedData);

    // 清理上传会话
    delete chunkUploadMap[uuid];

    return NextResponse.json({
      success: true,
      message: '数据上传并合并成功',
      dataSize: JSON.stringify(mergedData).length
    }, { status: 200 });

  } catch (error) {
    console.error('合并数据错误:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : '合并数据失败' 
    }, { status: 500 });
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

