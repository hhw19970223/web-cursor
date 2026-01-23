/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // 禁用字体优化，避免构建时访问 Google Fonts API
    optimizeFonts: false,
    // 配置 API 路由支持大型请求体
    experimental: {
        // 增加服务器端 body 大小限制到 50MB
        serverActions: {
            bodySizeLimit: '50mb',
        },
    },
    // 配置请求体大小限制
    serverRuntimeConfig: {
        // 服务器端运行时配置
        bodySizeLimit: '200mb',
    },
};

export default nextConfig;
