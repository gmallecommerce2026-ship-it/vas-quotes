/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Bỏ qua lỗi TypeScript/ESLint khi build
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
    ],
  },
  
  // --- THÊM PHẦN NÀY ĐỂ TẮT CẢNH BÁO TURBOPACK ---
  // Điều này xác nhận rằng bạn vẫn muốn dùng Webpack loader cho SVG
  experimental: {
    turbo: {
      // Bạn có thể để trống hoặc cấu hình thêm nếu cần sau này
    }
  },
  // -----------------------------------------------

  webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;