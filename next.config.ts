/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.52.218.141",   // 🔥 current IP (must)
    "192.168.0.0/16",  // 🔥 local network
    "10.0.0.0/8"       // 🔥 wide LAN
  ],
};

module.exports = nextConfig;