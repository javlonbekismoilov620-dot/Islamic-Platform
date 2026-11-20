import next from "eslint-config-next";

const config = [
  ...next,
  { ignores: [".next/**", "node_modules/**", ".data/**", "public/sw.js", "e2e/**"] },
];
export default config;
