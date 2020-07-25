module.exports = function override(config, env) {
  // fix for tensortflow - https://github.com/tensorflow/tfjs/issues/3384
  if (process.env.NODE_ENV === "production") {
    config.resolve.mainFields = ["main"];
  }
  return config;
};
