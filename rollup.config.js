import babel from "@rollup/plugin-babel";
import json from "@rollup/plugin-json";
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import cleanup from "rollup-plugin-cleanup";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default [
  // browser-friendly UMD build
  {
    input: "src/index.ts",
    output: {
      name: "ImageKit",
      file: pkg.browser,
      format: "umd",
      sourceMap: true,
    },
    plugins: [
      nodeResolve({ extensions: [".ts"] }),
      json(),
      babel({
        extensions: [".ts"],
      }),
      terser(),
      cleanup(),
    ],
  },
  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs", exports: "default" },
      { file: pkg.module, format: "es", exports: "default" },
    ],
    plugins: [
      nodeResolve({ extensions: [".ts"] }),
      json(),
      babel({
        extensions: [".ts"],
      }),
      cleanup(),
    ],
  },
];
