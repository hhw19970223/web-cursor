import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// JSON 文件存储的根目录
const JSON_DIR = path.join(process.cwd(), "public", "generated-json");

/**
 * GET /api/json/[filename]
 * 获取指定的 JSON 文件内容
 * 
 * 路径参数:
 * - filename: 文件名（可以不带 .json 后缀）
 * 
 * 示例:
 * - GET /api/json/my-data
 * - GET /api/json/my-data.json
 */
export async function GET(
  request: Request,
  { params }: { params: { filename: string } }
) {
  try {
    let { filename } = params;

    // 验证文件名
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

    // 如果没有 .json 后缀，自动添加
    if (!filename.endsWith(".json")) {
      filename = `${filename}.json`;
    }

    const filePath = path.join(JSON_DIR, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { 
          error: "文件不存在",
          filename,
          path: `/generated-json/${filename}`
        },
        { status: 404 }
      );
    }

    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, "utf-8");
    
    // 解析 JSON 以验证格式
    let jsonData;
    try {
      jsonData = JSON.parse(fileContent);
    } catch (parseError) {
      return NextResponse.json(
        { 
          error: "JSON 格式错误",
          details: parseError instanceof Error ? parseError.message : String(parseError)
        },
        { status: 500 }
      );
    }

    // 返回 JSON 数据
    return NextResponse.json(jsonData, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600', // 缓存 1 小时
      }
    });
  } catch (error) {
    console.error("读取 JSON 文件失败:", error);
    return NextResponse.json(
      { 
        error: "读取文件失败",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

