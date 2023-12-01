/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        // source: https://nextjs.org/docs/app/api-reference/next-config-js/typescript
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
