export function base64ToUint8Array(base64: string) {
  const binaryString = atob(base64); // 解码 base64 得到二进制字符串
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
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