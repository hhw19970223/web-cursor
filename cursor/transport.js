// @ts-nocheck

// 使用 CommonJS require 来导入模块（匹配 transportFactory.js 的导出方式）
import { TransportFactory } from './transportFactory.js';
import { authService } from './service/aiserver.v1.AuthService/index.js';
import { chatService } from './service/aiserver.v1.ChatService/index.js';
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

export const serviceMap = {
  'aiserver.v1.AuthService': authService,
  'aiserver.v1.ChatService': chatService,
}
export async function transportUnary(token, cfg, serviceName, methodName, request) {

  const transportFactory = new TransportFactory(() => {
    return token;
  })
  
  const backendTransport = transportFactory.createTransport({
    baseUrl: 'https://api2.cursor.sh',
    useHttp2: false,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: false,
  }, cfg)


  const service = serviceMap[serviceName];
  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }
  const method = authService.methods[methodName];
  if (!method) {
    throw new Error(`Method ${methodName} not found`);
  }

  const abortController = new AbortController();
  
  try {
    // 执行 unary 调用并等待结果
    const result = await backendTransport.transport.unary(
      service, 
      method, 
      abortController.signal, 
      undefined, 
      cfg, 
      request
    );

    return result.message;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}

//cfg = traceparent = '00-858acc5d8a4cf7adfc9a5495de2b30b1-82d011ebff8f3c63-00'  x-amzn-trace-id = 'Root=a7bf72d2-f52e-4f15-93f0-1881b4d925af' x-request-id = 'a7bf72d2-f52e-4f15-93f0-1881b4d925af'
export async function transportStream(token, cfg, serviceName, methodName, request) {

  const transportFactory = new TransportFactory(() => {
    return token;
  })

  // 双向流需要 HTTP/2 支持
  // 使用 api3.cursor.sh 因为它明确支持 HTTP/2（根据 isBaseUrlHttp2 函数）
  const transport = transportFactory.createTransport({
    baseUrl: 'https://api2.cursor.sh',
    useHttp2: true,  // 启用 HTTP/2 以支持双向流
    useHttp2FromServerConfig: 2,  // FORCE_ALL_ENABLED - 强制启用 HTTP/2
    maybeUseCppSpoofToken: false,
  }, cfg)


  const service = serviceMap[serviceName];
  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }
  const method = service.methods[methodName];
  if (!method) {
    throw new Error(`Method ${methodName} not found`);
  }

  const abortController = new AbortController();

  const y = async function* () {
    yield request;
  };
  
  try {
    // 执行流式调用
    const result = await transport.transport.stream(
      service, 
      method, 
      abortController.signal, 
      undefined, 
      cfg, 
      y()
    );

    return result;
  } catch (error) {
    console.error('请求失败:', error);
    throw error;
  }
}


// const bidiTransport = transportFactory.createTransport({
//   baseUrl: 'https://api2.cursor.sh',
//   useHttp2: false,
//   useHttp2FromServerConfig: 0,
//   maybeUseCppSpoofToken: false,
// })

// const geoCppTransport = transportFactory.createTransport({
//   baseUrl: 'https://api4.cursor.sh',
//   useHttp2: true,
//   useHttp2FromServerConfig: 0,
//   maybeUseCppSpoofToken: true,
// })

// const cppConfigTransport = transportFactory.createTransport({
//   baseUrl: 'https://api4.cursor.sh',
//   useHttp2: true,
//   useHttp2FromServerConfig: 0,
//   maybeUseCppSpoofToken: true,
// })

// const cmdkTransport = transportFactory.createTransport({
//   baseUrl: 'https://api3.cursor.sh',
//   useHttp2: true,
//   useHttp2FromServerConfig: 0,
//   maybeUseCppSpoofToken: false,
// })

// const telemTransport = transportFactory.createTransport({
//   baseUrl: 'https://api3.cursor.sh',
//   useHttp2: true,
//   useHttp2FromServerConfig: 0,
//   maybeUseCppSpoofToken: false,
// })

// const backgroundComposerProxyTransport = transportFactory.createTransport({
//   baseUrl: 'https://api2.cursor.sh',
//   useHttp2: true,
//   useHttp2FromServerConfig: 0,
//   maybeUseCppSpoofToken: false,
//   overrideAuthToken: async () => {

//   },
// })