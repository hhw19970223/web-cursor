// 使用 CommonJS require 来导入模块（匹配 transportFactory.js 的导出方式）
const { TransportFactory } = require('./transportFactory.js');

// 使用动态 import 导入 ES6 模块
async function main() {
  const { authService } = await import('./service/aiserver.v1.AuthService/index.js');

  const transportFactory = new TransportFactory(() => {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdXRoMHx1c2VyXzAxSldHMk44M0RYOURFQUFOMzE4MzlRODUwIiwidGltZSI6IjE3NjEyNzc2MTAiLCJyYW5kb21uZXNzIjoiYzc3ZmE3ZTQtMzE1Zi00MzI5IiwiZXhwIjoxNzY2NDYxNjEwLCJpc3MiOiJodHRwczovL2F1dGhlbnRpY2F0aW9uLmN1cnNvci5zaCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgb2ZmbGluZV9hY2Nlc3MiLCJhdWQiOiJodHRwczovL2N1cnNvci5jb20iLCJ0eXBlIjoic2Vzc2lvbiJ9.T7rHzcMW5UEQ6WBlItavdmuWxKJU3NOHvbr4T5GkvT8'
  })

  const backendTransport = transportFactory.createTransport({
    baseUrl: 'https://api2.cursor.sh',
    useHttp2: false,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: false,
  })

  const bidiTransport = transportFactory.createTransport({
    baseUrl: 'https://api2.cursor.sh',
    useHttp2: false,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: false,
  })

  const geoCppTransport = transportFactory.createTransport({
    baseUrl: 'https://api4.cursor.sh',
    useHttp2: true,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: true,
  })

  const cppConfigTransport = transportFactory.createTransport({
    baseUrl: 'https://api4.cursor.sh',
    useHttp2: true,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: true,
  })

  const cmdkTransport = transportFactory.createTransport({
    baseUrl: 'https://api3.cursor.sh',
    useHttp2: true,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: false,
  })

  const telemTransport = transportFactory.createTransport({
    baseUrl: 'https://api3.cursor.sh',
    useHttp2: true,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: false,
  })

  const backgroundComposerProxyTransport = transportFactory.createTransport({
    baseUrl: 'https://api2.cursor.sh',
    useHttp2: true,
    useHttp2FromServerConfig: 0,
    maybeUseCppSpoofToken: false,
    overrideAuthToken: async () => {

    },
  })

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

  const abortController = new AbortController();

  const service = authService;
  const method = authService.methods.getEmail;
  
  // 创建空的请求数据
  const data = new method.I();
  
  const cfg = {
    traceparent: `00-${X7c()}-${Q7c()}-00`
  };

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
    
    console.log('请求成功:', result);
    console.log('Email:', result.message.email);
    console.log('Sign Up Type:', result.message.signUpType);
  } catch (error) {
    console.error('请求失败:', error);
  }
}

// 执行主函数
main().catch(console.error);
