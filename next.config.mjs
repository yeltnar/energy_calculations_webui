/** @type {import('next').NextConfig} */

import config from 'config';

const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${config.backend_url}/:path*` // Proxy to Backend
            }
        ]
    }
};

export default nextConfig;
