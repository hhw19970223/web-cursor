/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // 禁用字体优化，避免构建时访问 Google Fonts API
    optimizeFonts: false,
};

export default nextConfig;
