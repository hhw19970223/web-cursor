export function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64); // 解码 base64 得到二进制字符串
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

export function base64ToUint8ArrayInNode(base64String: string) {
  // 如果 base64 字符串包含 data URL 前缀（如 "data:image/png;base64,"），需要先移除
  const base64Data = base64String.includes(',') 
    ? base64String.split(',')[1] 
    : base64String;
  
  // 将 base64 字符串转换为 Buffer
  const buffer = Buffer.from(base64Data, 'base64');
  
  // 将 Buffer 转换为 Uint8Array
  const uint8Array = new Uint8Array(buffer);
  
  return uint8Array;
}

export async function fileToUint8Array(file: File) {
  // file.arrayBuffer() 是浏览器原生方法
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

export function isBase64Image(base64: string) {
  return /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml|bmp|ico);base64,/i.test(base64);
}

export async function getImageSizeFromFile(file: File) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file); // 创建临时 URL
    
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      });
      URL.revokeObjectURL(url); // 清理
    };

    img.onerror = reject;
    img.src = url;
  });
}