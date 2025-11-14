// @ts-nocheck

/**
 * TransportFactory 类
 * 用于创建和管理 HTTP/HTTP2 传输层的工厂类
 * 负责处理连接、认证、Cookie 管理和证书加载等功能
 */

// 导入必要的模块
const { createConnectTransport, compressionGzip } = require("@connectrpc/connect-node");
const { Cookie, CookieJar } = require("tough-cookie");
const { Agent } = require("https");
const dns = require("dns");
const { randomUUID, randomBytes } = require("crypto");
const { rootCertificates } = require("tls");

const unique_cpp_user_id = Math.random().toString(36).substring(2, 15) +
Math.random().toString(36).substring(2, 15);

const Http2Config = {
  UNSPECIFIED: 0,
  FORCE_ALL_DISABLED: 1,
  FORCE_ALL_ENABLED: 2,
  FORCE_BIDI_DISABLED: 3,
  FORCE_BIDI_ENABLED: 4,
}

function isBaseUrlHttp2(e) {
  return (
    e.includes("api3.cursor.sh") ||
    e.includes("api4.cursor.sh") ||
    e.includes("gcpp.cursor.sh")
  );
}

function replaceBaseUrlWithApi2(e) {
  return (e = (e = e.replace(
    "api3.cursor.sh",
    "api2.cursor.sh"
  )).replace("api4.cursor.sh", "api2.cursor.sh")).replace(
    /^https:\/\/.*\.gcpp\.cursor\.sh/,
    "https://api2.cursor.sh"
  );
}

function maybeGetSpoofedCppAccessToken(e, t) {
  const r = "redacted" + unique_cpp_user_id;
  return t?.includes("cursor.sh")
    ? (function (e) {
        let t = e.split("").map((e) => e.charCodeAt(0));
        for (let e = 0; e < t.length; e++)
          t[e] = (t[e] + 128 - 1) % 128;
        return String.fromCharCode(...t);
      })(r)
    : e;
}

const PBe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  IBe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
function qd({ buffer: s }, e = !0, t = !1) {
  const n = t ? IBe : PBe;
  let r = "";
  const a = s.byteLength % 3;
  let o = 0;
  for (; o < s.byteLength - a; o += 3) {
    const c = s[o + 0],
      l = s[o + 1],
      d = s[o + 2];
    (r += n[c >>> 2]),
      (r += n[((c << 4) | (l >>> 4)) & 63]),
      (r += n[((l << 2) | (d >>> 6)) & 63]),
      (r += n[d & 63]);
  }
  if (a === 1) {
    const c = s[o + 0];
    (r += n[c >>> 2]), (r += n[(c << 4) & 63]), e && (r += "==");
  } else if (a === 2) {
    const c = s[o + 0],
      l = s[o + 1];
    (r += n[c >>> 2]),
      (r += n[((c << 4) | (l >>> 4)) & 63]),
      (r += n[(l << 2) & 63]),
      e && (r += "=");
  }
  return r;
}

function CYe(s) {
  if (s === !0) return "true";
  if (s === !1) return "false";
  if (s === void 0) return "implicit-false";
  {
    let e = s;
    return (e = e), "true";
  }
}

function RYe(s) {
  let e = 165;
  for (let t = 0; t < s.length; t++)
    (s[t] = (s[t] ^ e) + (t % 256)), (e = s[t]);
  return s;
}

const getRequestHeadersExceptAccessToken = function ({
  req: e,
  machineId: n,
  macMachineId: r,
  base64Fn: s,
  cursorVersion: o,
  privacyMode: i,
  eligibleForSnippetLearning: a,
  backupRequestId: l,
  clientKey: u,
  sessionId: c,
  configVersion: m,
}) {
  try {

    e.header.set(
      "x-cursor-checksum",
      `QlBSS7DCe59a056f8338ee7614d4ef994285eedca55f551513d3423e91dea7bd06198877/36326faa1613d4c93a9db643e2bcd7a67730cf6493a8447e47c21d3643f7c0f5`
    );
  } catch (e) {
    console.error(e);
  }
  e.header.set('x-cursor-client-version', o),
    void 0 !== m &&
      "" !== m &&
      e.header.set("x-cursor-config-version", m),
    void 0 !== c && e.header.set('x-session-id', c),
    e.header.set(
      'x-new-onboarding-completed',
      a && !1 === i ? "true" : "false"
    ),
    e.header.set('x-ghost-mode', CYe(i)),
    void 0 !== u && e.header.set("x-client-key", u);
  try {
    const t = Intl.DateTimeFormat().resolvedOptions().timeZone;
    e.header.set("x-cursor-timezone", t);
  } catch (e) {}
  try {
    l &&
      (e.header.has("x-request-id") ||
        e.header.set("x-request-id", l),
      e.header.has("x-amzn-trace-id") ||
        e.header.set("x-amzn-trace-id", `Root=${l}`));
  } catch (e) {}
}

/**
 * TransportFactory 类
 * 负责创建和管理 HTTP/HTTP2 传输连接
 */
class TransportFactory {
  /**
   * 流超时时间（毫秒）
   */
  static STREAM_TIMEOUT_MS = 1000;

  /**
   * 生成连接ID
   * @returns {string} 随机生成的连接ID（8位字符）
   */
  generateConnectionId() {
    return Math.random().toString(36).substring(2, 10);
  }

  /**
   * 构造函数
   * @param {Function} getAccessToken - 获取访问令牌的函数
   */
  constructor(getAccessToken) {
    this.cookieJar = new CookieJar();
    this.getAccessToken = getAccessToken;
    this.clientKey = randomBytes(32);
    
    // DNS 顺序缓存，用于维护 DNS 查询结果的顺序
    this.dnsOrderCache = new Map();
    
    // 活跃的 HTTP Agent 集合
    this.activeAgents = new Set();
    
    // 存储的随机值，用于 Cookie 生成
    this.storedRandomness = randomUUID();
    
    // 加载系统证书
    this.loadCertificates();
  }

  /**
   * 异步加载系统证书
   * 从系统和内置根证书列表中加载 SSL/TLS 证书
   */
  async loadCertificates() {
    try {

      // 获取内置根证书
      const builtinCerts = rootCertificates;
      
      // 合并系统证书和内置证书
      this.systemCertificates = [...(builtinCerts || [])];
    } catch (e) {
      this.systemCertificates = rootCertificates;
    }
  }

  /**
   * 创建传输层实例
   * @param {Object} options - 传输配置选项
   * @param {string} options.baseUrl - 基础 URL
   * @param {boolean} options.useHttp2 - 是否使用 HTTP/2
   * @param {boolean} options.maybeUseCppSpoofToken - 是否可能使用 C++ 伪造令牌
   * @param {Function} options.overrideAuthToken - 覆盖认证令牌的函数
   * @param {string} options.useHttp2FromServerConfig - 服务器配置的 HTTP/2 设置
   * @returns {Object} 包含 transport、isHttp2 和 usage 的对象
   */
  createTransport(options, cfg) {
    const {
      baseUrl,
      useHttp2,
      maybeUseCppSpoofToken,
      overrideAuthToken,
    } = options;
    
    // 判断是否应该禁用 HTTP/2
    // 如果服务器强制禁用，或者服务器未强制启用且用户配置中禁用了 HTTP/2
    const shouldDisableHttp2 =
      options.useHttp2FromServerConfig === Http2Config.FORCE_ALL_DISABLED ||
      options.useHttp2FromServerConfig !== Http2Config.FORCE_ALL_ENABLED

    // 创建 HTTP Agent
    let agent;
    agent =
      shouldDisableHttp2 && isBaseUrlHttp2(baseUrl)
        ? new Agent({ keepAlive: true })
        : new Agent({ keepAlive: false });
    this.activeAgents.add(agent);

    let httpOptions = { agent: agent };
    
    // 确定是否实际使用 HTTP/2
    const willUseHttp2 = useHttp2 && !shouldDisableHttp2;
    
    let processedBaseUrl = baseUrl;
    
    // 如果禁用了 HTTP/2 且基础 URL 是 HTTP/2 的，替换为 API2 URL
    if (shouldDisableHttp2 && isBaseUrlHttp2(baseUrl)) {
      processedBaseUrl = replaceBaseUrlWithApi2(baseUrl);
    }
    
    // 检查是否是本地开发环境（localhost 或 lclhst.build）
    const isLocalhost =
      null !==
        processedBaseUrl.match(/(?:[^\/]+\.)?lclhst\.build(?::\d+)?(?:\/|$)/) ||
      null !== processedBaseUrl.match(/(?:[^\/]+\.)?localhost(?::\d+)?(?:\/|$)/);

    // 创建拦截器链
    const interceptors = this.createInterceptors({
      baseUrl: processedBaseUrl,
      maybeUseCppSpoofToken,
      overrideAuthToken,
    }, this.clientKey.toString("hex"), cfg);

    // 为特定域名配置自定义 DNS 查找（用于 gcpp 和 api4.cursor.sh）
    const dnsLookup =
      processedBaseUrl.includes("gcpp") || processedBaseUrl.includes("api4.cursor.sh")
        ? {
            lookup: (hostname, options, callback) => {
              dns.lookup(hostname, { ...options, all: true }, (err, addresses, family) => {
                // 如果返回的是字符串（单个地址），直接返回
                if (typeof addresses === "string") {
                  return callback(err, addresses, family);
                }
                
                // 缓存首次查询的 DNS 结果顺序
                if (!this.dnsOrderCache.has(hostname)) {
                  this.dnsOrderCache.set(hostname, addresses);
                }
                
                // 获取缓存的 DNS 顺序
                const cachedOrder = this.dnsOrderCache.get(hostname);
                
                // 检查新查询结果是否与缓存结果相同（仅顺序可能不同）
                const isSameSet =
                  addresses.length === cachedOrder.length &&
                  addresses.every((addr) =>
                    cachedOrder.some((cached) => cached.address === addr.address)
                  );
                
                // 如果地址相同但顺序可能不同，使用缓存的顺序以保持一致性
                callback(err, isSameSet ? cachedOrder : addresses, family);
              });
            },
          }
        : undefined;

    // 本地开发环境的 TLS 选项
    const tlsOptions = isLocalhost
        ? {
            rejectUnauthorized: false, // 允许自签名证书
            ALPNProtocols: [willUseHttp2 ? "h2" : "http/1.1"], // ALPN 协议协商
          }
        : {};

    // 传输层基础配置
    const transportConfig = {
      baseUrl: processedBaseUrl,
      useBinaryFormat: true, // 使用二进制格式
      interceptors: interceptors, // 拦截器链
      sendCompression: compressionGzip, // 发送压缩
      acceptCompression: [compressionGzip], // 接受的压缩格式
    };

    // 根据是否使用 HTTP/2 创建相应的传输层
    return {
      transport: willUseHttp2
        ? createConnectTransport({
            ...transportConfig,
            httpVersion: "2", // HTTP/2
            nodeOptions: {
              ...dnsLookup,
              ...tlsOptions,
              ca: this.systemCertificates ?? undefined, // 证书颁发机构
              minVersion: "TLSv1.2", // 最小 TLS 版本
            },
          })
        : createConnectTransport({
            ...transportConfig,
            httpVersion: "1.1", // HTTP/1.1
            ...httpOptions,
            nodeOptions: { ...dnsLookup, ...tlsOptions },
          }),
      isHttp2: willUseHttp2,
      usage: 0, // 使用计数
    };
  }

  /**
   * 创建拦截器链
   * @param {Object} options - 拦截器配置选项
   * @param {string} options.baseUrl - 基础 URL
   * @param {boolean} options.maybeUseCppSpoofToken - 是否可能使用 C++ 伪造令牌
   * @param {Function} options.overrideAuthToken - 覆盖认证令牌的函数
   * @returns {Array} 拦截器数组
   */
  createInterceptors({
    baseUrl,
    maybeUseCppSpoofToken,
    overrideAuthToken,
  }, clientKey, cfg) {
    const interceptors = [];

    // 拦截器 3: 认证令牌拦截器
    interceptors.push((next) => async (request) => {

      if (cfg['x-request-id']) {
        getRequestHeadersExceptAccessToken({
          req: request,
          machineId: 'e59a056f8338ee7614d4ef994285eedca55f551513d3423e91dea7bd06198877',
          macMachineId: '36326faa1613d4c93a9db643e2bcd7a67730cf6493a8447e47c21d3643f7c0f5',
          base64Fn: (k) => qd(wrap(k), !1, !0),
          cursorVersion: '1.5.5',
          privacyMode: true,
          eligibleForSnippetLearning: true,
          sessionId: 'db18da73-e8bb-4513-91c4-c248196848ea',
          backupRequestId: cfg['x-request-id'],
          clientKey: clientKey,
          configVersion: 'b057550d-1277-4726-b190-7ec7450b17a6',
        })
      }
      

      // 如果提供了覆盖令牌函数，优先使用
      if (overrideAuthToken) {
        const token = await overrideAuthToken();
        if (token) {
          request.header.set("Authorization", `Bearer ${token}`);
          return await next(request);
        }
      }

      // 获取访问令牌
      const accessToken = this.getAccessToken();
      
      // 如果没有令牌，直接继续
      if (accessToken === undefined) {
        return await next(request);
      }

      // 根据是否需要 C++ 伪造令牌来设置认证头
      if (maybeUseCppSpoofToken) {
        request.header.set(
          "Authorization",
          `Bearer ${maybeGetSpoofedCppAccessToken(
            accessToken,
            baseUrl
          )}`
        );
      } else {
        request.header.set("Authorization", `Bearer ${accessToken}`);
      }

      return await next(request);
    });

    // 拦截器 4: 请求头拦截器
    interceptors.push(
      (next) => async (request) => {
        // 设置流式传输标志
        request.header.set("x-cursor-streaming", "true");

        return await next(request);
      }
    );

    // 拦截器 5: Cookie 管理拦截器
    interceptors.push((next) => async (request) => {
      const accessToken = this.getAccessToken();

      try {
        // 尝试获取现有的 Cookie
        const cookieString = await this.cookieJar.getCookieString(baseUrl);
        
        if (cookieString.length > 0) {
          // 如果有 Cookie，设置到请求头
          request.header.set("Cookie", cookieString);
        } else {
          // 如果没有 Cookie，创建一个新的
          await this.createCookie(
            baseUrl,
            request.url,
            accessToken?.slice(0, 15) ?? this.storedRandomness
          );
          
          // 获取新创建的 Cookie
          const newCookieString = await this.cookieJar.getCookieString(baseUrl);
          request.header.set("Cookie", newCookieString);
        }
      } catch (e) {
        console.error(e);
      }

      // 执行请求
      const response = await next(request);

      try {
        // 如果响应包含 Set-Cookie 头，保存到 Cookie 容器
        if (response.header.has("Set-Cookie")) {
          const setCookies = response.header.getSetCookie();
          for (const cookie of setCookies) {
            await this.cookieJar.setCookie(cookie, baseUrl).catch(() => {});
          }
        }
      } catch (e) {

      }

      return response;
    });

    return interceptors;
  }

  /**
   * 创建 Cookie
   * @param {string} baseUrl - 基础 URL
   * @param {string} requestUrl - 请求 URL
   * @param {string} randomness - 随机值（用于 Cookie 值）
   */
  async createCookie(baseUrl, requestUrl, randomness) {
    const cookie = new Cookie({
      key: "CursorCookie",
      value: "Cookie-" + randomness,
      domain: new URL(baseUrl).hostname,
      path: requestUrl.replace(baseUrl, ""),
      expires: new Date(Date.now() + 864e5), // 24小时后过期
      httpOnly: true, // 仅 HTTP 访问
      secure: true, // 仅 HTTPS
      sameSite: "Strict", // 严格同站策略
    });

    await this.cookieJar.setCookie(cookie, baseUrl).catch(() => {});
  }

  /**
   * 销毁所有活跃的 HTTP Agent
   * 清理资源，包括 DNS 缓存
   */
  destroyAllAgents() {
    // 销毁所有 Agent
    for (const agent of this.activeAgents) {
      agent.destroy();
    }
    
    // 清空集合和缓存
    this.activeAgents.clear();
    this.dnsOrderCache.clear();
  }
}

/**
 * 将 Uint8Array 或其他类型化数组包装成 Buffer
 * 替代 proto3.util.wrap 方法
 */
function wrap(data){
  // 如果已经是 Buffer，直接返回
  if (Buffer.isBuffer(data)) {
    return data;
  }
  
  // 如果是 Uint8Array 或其他 TypedArray，转换为 Buffer
  if (ArrayBuffer.isView(data)) {
    return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  }
  
  // 兜底：尝试直接转换
  return Buffer.from(data);
}

// 导出 TransportFactory 类
module.exports = { TransportFactory, wrap };

