import viteWesl from "wesl-plugin/vite";
import { linkBuildExtension } from "wesl-plugin";

const config = {
  plugins: [
    viteWesl({ extensions: [linkBuildExtension], weslToml: "./wesl.toml" }),
  ],
};

export default config;
