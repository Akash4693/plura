/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "uploadthing.com",
            "utfs.io",
            "img.clerk.com",
            "d1riyses1p.ufs.sh", // Correct domain
            "files.stripe.com",
        ],
    },
    reactStrictMode: false,
};

module.exports = nextConfig;
