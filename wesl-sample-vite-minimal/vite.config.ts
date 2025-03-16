import viteWesl from "wesl-plugin/vite";
import { linkBuildPlugin } from "wesl-plugin";

const config = {
  plugins: [viteWesl({ extensions: [linkBuildPlugin] })],
};

export default config;
