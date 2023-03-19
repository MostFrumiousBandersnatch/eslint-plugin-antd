import ts from "rollup-plugin-ts";
import terser from '@rollup/plugin-terser';

import pkg from "./package.json" assert { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        sourcemap: false,
        assetFileNames: "[name][extname]",
      },
    ],
    watch: {
      include: "src/**",
    },
    external: [...Object.keys(pkg.dependencies || {})],
    plugins: [
      ts({
        tsconfig: "./tsconfig.json",
      }),
      terser(),
    ],
  },
];
