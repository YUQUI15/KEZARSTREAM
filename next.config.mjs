/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tmdb-image-prod.b-cdn.net',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply permissive headers to ALL pages so embedded iframes work correctly
        source: '/(.*)',
        headers: [
          // ===== CONTENT SECURITY POLICY =====
          // Allow iframes, redirects, media streams, and CDN workers from ALL streaming providers
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https: http: data: blob:",
              "style-src 'self' 'unsafe-inline' https:",
              "font-src 'self' data: https:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: blob:",
              "img-src 'self' data: blob: https: http: *",
              "media-src 'self' data: blob: https: http: *",
              "connect-src 'self' https: http: wss: ws: *",
              "frame-src 'self' https: http: data: blob: *",
              "child-src 'self' https: http: data: blob: *",
              "worker-src 'self' blob: https: *",
            ].join('; '),
          },
          // ===== PERMISSIONS POLICY =====
          // Grant ALL permissions needed by video players
          {
            key: 'Permissions-Policy',
            value: [
              'autoplay=*',
              'fullscreen=*',
              'picture-in-picture=*',
              'encrypted-media=*',
              'accelerometer=*',
              'gyroscope=*',
              'clipboard-write=*',
            ].join(', '),
          },
          // ===== CROSS-ORIGIN HEADERS =====
          // IMPORTANT: Do NOT set COEP/COOP — they break cross-origin iframes
          // Do NOT set X-Frame-Options: DENY — would block our own player page
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // ===== REFERRER POLICY =====
          // 'no-referrer-when-downgrade' sends full URL as referrer to HTTPS origins
          // This is critical — many streaming servers CHECK the referrer to allow playback
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
        ],
      },
      {
        // For the player page specifically, also allow cross-origin resource sharing
        source: '/ver/:path*',
        headers: [
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          // Explicitly allow the page itself to be loaded in a context that loads iframes
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
