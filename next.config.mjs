/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        MONGO_URI: process.env.MONGO_URI,
        API_KEY: process.env.API_KEY,
        NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    },
};

export default nextConfig;
