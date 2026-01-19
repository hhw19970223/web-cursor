import { NextResponse } from 'next/server';

// 配置常量
const MAX_HTML_SIZE = 500 * 1024; // 最大读取 500KB（需要读取body中的标题标签）
const FETCH_TIMEOUT = 10000; // 10 秒超时
const CACHE_TTL = 5 * 60 * 1000; // 缓存 5 分钟
const MAX_CACHE_SIZE = 1000; // 最大缓存条目数

// 简单的 LRU 缓存实现
interface CacheEntry {
  data: {
    title: string;
    description: string;
    image: string;
    h1: string[];
    h2: string[];
    h3: string[];
  };
  timestamp: number;
}

class LRUCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  get(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // 检查是否过期
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }

    // 移动到末尾（LRU）
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry;
  }

  set(key: string, data: CacheEntry['data']): void {
    // 如果已存在，先删除
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // 如果超过最大大小，删除最旧的条目
    else if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // 定期清理过期条目
  cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    for (const [key, entry] of entries) {
      if (now - entry.timestamp > CACHE_TTL) {
        this.cache.delete(key);
      }
    }
  }
}

const urlCache = new LRUCache(MAX_CACHE_SIZE);

// 定期清理过期缓存（在服务器启动时设置）
let cleanupInterval: NodeJS.Timeout | null = null;
if (typeof global !== 'undefined' && !cleanupInterval) {
  cleanupInterval = setInterval(
    () => {
      urlCache.cleanup();
    },
    5 * 60 * 1000,
  );
}

// 创建带 CORS 头的响应
function createCorsResponse(
  data: unknown,
  status: number,
  origin: string | null,
) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  return NextResponse.json(data, { status, headers });
}

// 限制大小的流式读取 HTML
async function fetchHtmlWithLimit(
  url: string,
  maxSize: number,
  timeout: number,
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder('utf-8', { fatal: false });
    let html = '';
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalSize += value.length;
      if (totalSize > maxSize) {
        // 读取到最大大小后停止
        html += decoder.decode(
          value.slice(0, maxSize - (totalSize - value.length)),
          {
            stream: true,
          },
        );
        break;
      }

      html += decoder.decode(value, { stream: true });
    }

    // 返回完整的HTML内容，不再截断（因为需要读取body中的标题）
    return html;
  } finally {
    clearTimeout(timeoutId);
  }
}

// 提取 meta 信息和标题标签
async function extractMetaInfo(html: string): Promise<{
  title: string;
  description: string;
  image: string;
  h1: string[];
  h2: string[];
  h3: string[];
}> {
  // 使用 linkedom 解析 HTML（动态导入）
  const { parseHTML } = await import('linkedom');
  const { document } = parseHTML(html);

  const title =
    document
      .querySelector('meta[property="og:title"]')
      ?.getAttribute('content') ||
    document.querySelector('title')?.textContent ||
    '';

  const description =
    document
      .querySelector('meta[property="og:description"]')
      ?.getAttribute('content') ||
    document
      .querySelector('meta[name="description"]')
      ?.getAttribute('content') ||
    '';

  const image =
    document
      .querySelector('meta[property="og:image"]')
      ?.getAttribute('content') || '';

  // 提取 h1、h2、h3 标签内容
  const h1Elements = document.querySelectorAll('h1');
  const h2Elements = document.querySelectorAll('h2');
  const h3Elements = document.querySelectorAll('h3');

  const h1 = Array.from(h1Elements)
    .map((el: Element) => el.textContent?.trim() || '')
    .filter((text) => text.length > 0);

  const h2 = Array.from(h2Elements)
    .map((el: Element) => el.textContent?.trim() || '')
    .filter((text) => text.length > 0);

  const h3 = Array.from(h3Elements)
    .map((el: Element) => el.textContent?.trim() || '')
    .filter((text) => text.length > 0);

  return { title, description, image, h1, h2, h3 };
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');

  try {
    // 读取请求体
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return createCorsResponse(
        { error: 'Invalid URL parameter' },
        400,
        origin,
      );
    }

    // 验证 URL 格式
    try {
      new URL(url);
    } catch {
      return createCorsResponse({ error: 'Invalid URL format' }, 400, origin);
    }

    // 检查缓存
    const cached = urlCache.get(url);
    if (cached) {
      return createCorsResponse(cached.data, 200, origin);
    }

    // 获取 HTML（限制大小和超时）
    const html = await fetchHtmlWithLimit(url, MAX_HTML_SIZE, FETCH_TIMEOUT);

    // 提取 meta 信息
    const metaInfo = await extractMetaInfo(html);

    // 存入缓存
    urlCache.set(url, metaInfo);

    return createCorsResponse(metaInfo, 200, origin);
  } catch (error) {
    console.error('Error processing URL:', error);

    // 处理特定错误类型
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return createCorsResponse({ error: 'Request timeout' }, 408, origin);
      }
      if (error.message.includes('HTTP error')) {
        return createCorsResponse(
          { error: 'Failed to fetch URL' },
          502,
          origin,
        );
      }
    }

    return createCorsResponse(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      500,
      origin,
    );
  }
}
