export default {
  buildCommand: "npm run build",
  buildOutputPath: ".next",
  dev: {
    port: 3000,
  },
  splitIntoChunks: true,
  minify: true,
  routes: {
    dynamic: "auto",
  },
};
