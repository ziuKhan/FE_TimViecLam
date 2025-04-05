# Base image
FROM node:18-alpine

# Tạo thư mục làm việc
WORKDIR /khang/frontend-vue

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build ứng dụng
RUN npm run build

# Cài đặt serve để chạy production build
RUN npm install -g serve

# Start server
CMD ["serve", "-s", "dist", "-l", "3000"]