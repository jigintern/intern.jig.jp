import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  output: "static",
  image: {
    remotePatterns: [{ protocol: "https" }, { protocol: "http" }],
  },
  integrations: [mdx()],
  base: process.env.ASTRO_BASE || "/",
  site: "https://intern.jig.jp",
  experimental: {
    svgo: {
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              convertTransform: false,
              convertPathData: false,
            },
          },
        },
        "collapseGroups",
        "removeDimensions",
        {
          name: "removeAttrs",
          params: {
            attrs: "svg:fill:none",
          },
        },
      ],
    },
  },
});
