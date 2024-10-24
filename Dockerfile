# Use the official Bun image as the base image
FROM oven/bun

# Set the working directory
WORKDIR /app

# Copy package.json and lockfile (if available)
COPY package.json .env bun.lockb postcss.config.mjs tailwind.config.ts ./

# Install dependencies
RUN bun install

# Copy the rest of your application files
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["bun", "dev"]
