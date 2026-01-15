import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// JSON 文件存储的根目录
const JSON_DIR = path.join(process.cwd(), "public", "generated-json");

// 确保目录存在
if (!fs.existsSync(JSON_DIR)) {
  fs.mkdirSync(JSON_DIR, { recursive: true });
}

/**
 * POST /api/json/create
 * 创建或更新 JSON 文件
 * 
 * Body 参数:
 * {
 *   filename: string,  // 文件名（必须以 .json 结尾）
 *   data: any          // JSON 数据（任意 JSON 可序列化的数据）
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filename, data } = body;

    // 验证必需参数
    if (!filename) {
      return NextResponse.json(
        { error: "缺少文件名参数" },
        { status: 400 }
      );
    }

    if (data === undefined) {
      return NextResponse.json(
        { error: "缺少数据参数" },
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

    // 确保文件名以 .json 结尾
    let finalFilename = filename;
    if (!filename.endsWith(".json")) {
      finalFilename = `${filename}.json`;
    }

    const filePath = path.join(JSON_DIR, finalFilename);

    // 将数据转换为格式化的 JSON 字符串
    const jsonContent = JSON.stringify(data, null, 2);

    // 写入文件
    fs.writeFileSync(filePath, jsonContent, "utf-8");

    return NextResponse.json(
      {
        success: true,
        message: "JSON 文件创建成功",
        filename: finalFilename,
        directPath: `/generated-json/${finalFilename}`, // 可以直接访问静态文件
        url: `${request.headers.get('origin') || ''}/generated-json/${finalFilename}`, // 完整 URL
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("创建 JSON 文件失败:", error);
    return NextResponse.json(
      { error: "创建文件失败", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}


