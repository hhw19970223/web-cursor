import { NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

// JSON 文件存储的根目录
const JSON_DIR = path.join(process.cwd(), "public", "generated-json");

/**
 * GET /api/json/list
 * 列出所有已保存的 JSON 文件
 */
export async function GET(request: Request) {
  try {
    // 确保目录存在
    if (!fs.existsSync(JSON_DIR)) {
      return NextResponse.json(
        {
          success: true,
          files: [],
          message: "JSON 目录不存在或为空"
        },
        { status: 200 }
      );
    }

    // 读取目录中的所有文件
    const files = fs.readdirSync(JSON_DIR);
    
    // 只返回 .json 文件
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    // 获取文件详细信息
    const fileDetails = jsonFiles.map(filename => {
      const filePath = path.join(JSON_DIR, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        directPath: `/generated-json/${filename}`,
        url: `${request.headers.get('origin') || ''}/generated-json/${filename}`,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    });

    return NextResponse.json(
      {
        success: true,
        files: fileDetails,
        count: fileDetails.length
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("列出 JSON 文件失败:", error);
    return NextResponse.json(
      { error: "列出文件失败", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

