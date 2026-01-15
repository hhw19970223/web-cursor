import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// JSON 文件存储的根目录
const JSON_DIR = path.join(process.cwd(), "public", "generated-json");

/**
 * DELETE /api/json/delete
 * 删除指定的 JSON 文件
 * 
 * Body 参数:
 * {
 *   filename: string  // 要删除的文件名
 * }
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { filename } = body;

    // 验证必需参数
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

    const filePath = path.join(JSON_DIR, filename);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "文件不存在" },
        { status: 404 }
      );
    }

    // 删除文件
    fs.unlinkSync(filePath);

    return NextResponse.json(
      {
        success: true,
        message: "JSON 文件删除成功",
        filename
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("删除 JSON 文件失败:", error);
    return NextResponse.json(
      { error: "删除文件失败", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

