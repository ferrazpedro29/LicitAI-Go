/** @type {import('next').NextConfig} */
const nextConfig = {
  // mammoth é um pacote Node.js pesado — não deve ser bundlado pelo webpack no servidor
  serverExternalPackages: ['mammoth'],
}

module.exports = nextConfig
