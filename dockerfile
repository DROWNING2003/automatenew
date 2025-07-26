# 第一阶段：构建环境
FROM node:20-alpine AS builder

# 安装 PNPM 并配置缓存
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 复制依赖文件 (利用 Docker 缓存层)
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod  # 预下载所有依赖到虚拟存储

# 复制项目文件并安装
COPY . .
RUN pnpm install --frozen-lockfile --prod && \
    pnpm run build

# 第二阶段：生产环境
FROM nginx:1.25-alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]