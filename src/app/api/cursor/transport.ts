// @ts-nocheck

// 使用 CommonJS require 来导入模块（匹配 transportFactory.js 的导出方式）
const { TransportFactory } = require('./transportFactory');
import { authService } from './service/aiserver.v1.AuthService/index.ts';
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
}
export async function transport(token: string, traceparent: string, serviceName: string, methodName: string, request?: any) {

  const transportFactory = new TransportFactory(() => {
    return token;
  })
  
  const backendTransport = transportFactory.createTransport({
    baseUrl: 'https://api2.cursor.sh',
    useHttp2: false,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: false,
  })
  
  const cfg = {
    traceparent
  };

  const service = serviceMap[serviceName];
  if (!service) {
    throw new Error(`Service ${serviceName} not found`);
  }
  const method = authService.methods[methodName];
  if (!method) {
    throw new Error(`Method ${methodName} not found`);
  }

  const abortController = new AbortController();

  const str = request ? typeof request === 'object' ? JSON.stringify(request) : typeof request === 'string' ? request : request.toString() : '';
  const buf = Buffer.from(str);
  
  const data = new method.I(buf.buffer);
  
  try {
    // 执行 unary 调用并等待结果
    const result = await backendTransport.transport.unary(
      service, 
      method, 
      abortController.signal, 
      undefined, 
      cfg, 
      data
    );

    return result.message;
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