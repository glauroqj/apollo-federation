import run from "@rollup/plugin-run";
import gql from "rollup-plugin-graphql-tag";
import alias from "@rollup/plugin-alias";
// import { babel } from "@rollup/plugin-babel";
import cleaner from "rollup-plugin-cleaner";

const dev = process.env.NODE_ENV !== "production";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    cleaner({
      targets: ["./dist/"],
    }),
    dev && run(),
    gql(),
    alias({
      entries: [
        { find: "datasources", replacement: "./src/datasources" },
        { find: "typedefs", replacement: "./src/typedefs" },
        { find: "schema", replacement: "./src/schema" },
      ],
    }),
    // babel({ babelHelpers: "bundled", babelrc: false }),
  ],
};
