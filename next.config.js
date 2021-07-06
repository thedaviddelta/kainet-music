const withPWA = require("next-pwa");
const defaultCache = require("next-pwa/cache");

module.exports = withPWA({
    pwa: {
        dest: "public",
        runtimeCaching: [
            {
                // eslint-disable-next-line no-restricted-globals
                urlPattern: ({ url }) => self.origin === url.origin && url.pathname.startsWith("/api/source"),
                handler: 'CacheFirst',
                options: {
                    cacheName: 'api-source-url',
                    expiration: {
                        maxEntries: 32,
                        maxAgeSeconds: 24 * 60 * 60 // 1 day
                    }
                }
            },
            {
                urlPattern: /^https:\/\/\w+\.googleusercontent\.com\/.*/i,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'youtube-assets',
                    expiration: {
                        maxEntries: 64,
                        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
                    }
                }
            },
            ...defaultCache
        ]
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Permissions-Policy",
                        value: "interest-cohort=()"
                    }
                ]
            }
        ]
    }
});
