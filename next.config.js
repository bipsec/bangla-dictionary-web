/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Vercel's bundler traces imports to decide what ships with each function, and ships only
  // what it traced. Two sets of files are invisible to that analysis:
  //
  //  - model/** is read at runtime through fs, not imported.
  //  - onnxruntime loads its wasm backend by dynamic path at runtime. Tracing finds
  //    ort.node.min.mjs but neither the .wasm binary nor the .mjs glue beside it, so without
  //    this the route deploys and then fails on first inference with "no available backend
  //    found". Only the plain simd-threaded variant is listed: the jsep/jspi/asyncify builds
  //    are WebGPU/JSPI paths this route never takes and would add ~65 MB to the function.
  experimental: {
    outputFileTracingIncludes: {
      "/api/ipa": [
        "./model/**",
        "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
        "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs",
      ],
    },

    // onnxruntime ships an ESM Node entry that webpack/Terser cannot process, and its .wasm
    // binaries have to stay real files on disk. Leaving the package external means the route
    // require()s it at runtime from node_modules, which is what it expects.
    serverComponentsExternalPackages: ["onnxruntime-web", "onnxruntime-common", "pg"],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
