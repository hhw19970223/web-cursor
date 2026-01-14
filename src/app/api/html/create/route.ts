import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// HTML 文件存储的根目录
const HTML_DIR = path.join(process.cwd(), "public", "generated-html");

// 确保目录存在
if (!fs.existsSync(HTML_DIR)) {
  fs.mkdirSync(HTML_DIR, { recursive: true });
}

/**
 * POST /api/html/create
 * 创建或更新 HTML 文件
 * 
 * Body 参数:
 * {
 *   filename: string,  // 文件名（必须以 .html 结尾）
 *   content: string    // HTML 内容
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, content } = body;

    // 验证必需参数
    if (!filename) {
      return NextResponse.json(
        { error: "缺少文件名参数" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "缺少内容参数" },
        { status: 400 }
      );
    }

    // 安全检查：防止路径穿越攻击
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json(
        { error: "文件名不合法" },
        { status: 400 }
      );
    }

    // 确保文件名以 .html 结尾
    if (!filename.endsWith(".html")) {
      return NextResponse.json(
        { error: "文件名必须以 .html 结尾" },
        { status: 400 }
      );
    }

    const filePath = path.join(HTML_DIR, filename);

    // 写入文件
    fs.writeFileSync(filePath, content, "utf-8");

    // 获取不带后缀的文件名用于访问路径
    const filenameWithoutExt = filename.replace(/\.html$/, "");

    return NextResponse.json(
      {
        success: true,
        message: "HTML 文件创建成功",
        filename,
        path: `/api/html/${filenameWithoutExt}`, // 通过 API 路由访问（不需要后缀）
        directPath: `/generated-html/${filename}`, // 也可以直接访问静态文件
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("创建 HTML 文件失败:", error);
    return NextResponse.json(
      { error: "创建文件失败" },
      { status: 500 }
    );
  }
}

