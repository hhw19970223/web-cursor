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
 * GET /api/html/[filename]
 * 读取指定的 HTML 文件
 * 例如: /api/html/example (自动添加 .html 后缀)
 */
export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    let filename = params.filename;

    if (!filename) {
      return NextResponse.json(
        { error: "缺少文件名参数" },
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

    // 自动添加 .html 后缀（如果还没有）
    if (!filename.endsWith(".html")) {
      filename = `${filename}.html`;
    }

    const filePath = path.join(HTML_DIR, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "文件不存在" },
        { status: 404 }
      );
    }

    // 读取文件内容
    const htmlContent = fs.readFileSync(filePath, "utf-8");

    // 返回 HTML 内容
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("读取 HTML 文件失败:", error);
    return NextResponse.json(
      { error: "读取文件失败" },
      { status: 500 }
    );
  }
}

