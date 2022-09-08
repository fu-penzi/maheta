module.exports = {
  resolve: {
    fallback: {
      path: false,
      os: false,
      fs: false,
      // util: require.resolve("util/"),
      // path: require.resolve("path-browserify"),
      // crypto: require.resolve("crypto-browserify"),
      // buffer: require.resolve("buffer/"),
      // https: require.resolve("https-browserify"),
      // http: require.resolve("stream-http"),
      // os: require.resolve("os-browserify/browser"),
      // vm: require.resolve("vm-browserify"),
      // stream: require.resolve("stream-browserify"),
      // constants: require.resolve("constants-browserify"),
      // assert: require.resolve("assert/"),
    },
  },
};
