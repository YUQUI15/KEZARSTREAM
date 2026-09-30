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
          // Allow iframes from ALL streaming providers (latino + subtitulado)
          {
            key: 'Content-Security-Policy',
            value: [
              // Scripts: self + inline (needed for Next.js)
              "default-src 'self'",
              // Styles: self + inline (Tailwind generates inline styles)
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              // Fonts: Google Fonts
              "font-src 'self' https://fonts.gstatic.com",
              // Scripts: self + inline + eval (needed for some video players)
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com",
              // Images: allow TMDB, BunnyCDN, any https source (for player thumbnails)
              "img-src 'self' data: blob: https:",
              // Media: allow streams from any source
              "media-src 'self' blob: https:",
              // Connect: allow API connections
              "connect-src 'self' https: wss:",
              // ============================================================
              // FRAME-SRC: ALL streaming server domains MUST be listed here
              // ============================================================
              [
                "frame-src",
                // Latino servers
                "https://play.modocine.com",
                "https://nsrplay.space",
                "https://unlimplay.com",
                "https://multiembed-clean.wptheme.site",
                "https://embed69.org",
                // Subtitulado servers
                "https://vidlink.pro",
                "https://autoembed.co",
                "https://vidsrc.pm",
                "https://vidsrc.in",
                "https://player.videasy.net",
                "https://www.2embed.cc",
                "https://multiembed.mov",
                "https://embed.smashystream.com",
                "https://vidsrc.net",
                "https://vidsrc.xyz",
                "https://vidsrc.to",
                // YouTube (for trailers)
                "https://www.youtube.com",
                "https://youtube.com",
                "https://*.youtube.com",
                // Wildcard fallback for any CDN subdomains used by the players
                "https://*.modocine.com",
                "https://*.nsrplay.space",
                "https://*.2embed.cc",
                "https://*.vidsrc.xyz",
              ].join(' '),
              // Worker: allow service workers from players
              "worker-src 'self' blob:",
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
