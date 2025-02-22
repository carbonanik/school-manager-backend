# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install all dependencies, including dev dependencies for building
RUN npm install

# Copy the entire project
COPY . .

# Ensure Prisma Client is generated
RUN npx prisma generate
# Build the application
RUN npm run build

# Stage 2: Production Image
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies from builder
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# Ensure Prisma Client is included
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma  

# Expose the port (optional, modify as needed)
EXPOSE 3001

# Run the application
CMD ["node", "dist/index.js"]
