import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";
import ogs from "open-graph-scraper";

const internships = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/internships" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      status: z.enum(["open", "closed", "hidden"]),
      hasSelection: z.boolean(),
      shortSummary: z.string().optional(),
      summary: z.string(),
      target: z.string(),
      image: image(),
      order: z.number(),
    }),
});

export type JsonPastLog = {
  tabName: string;
  items: { title: string; href: string; image?: string }[];
};

const pastLogs = defineCollection({
  loader: file("./src/content/pastLogs/pastLogs.json", {
    parser: async (text) => {
      const pastLogs = JSON.parse(text) as JsonPastLog[];
      const allHrefs = pastLogs.flatMap((log) =>
        log.items
          .filter((item) => item.href && !item.image) // image がないものだけ ogp の画像を取ってくる
          .map((item) => item.href),
      );
      const uniqueHrefs = [...new Set(allHrefs)].filter(Boolean);
      const ogpImageMap: Record<string, string> = {};

      await Promise.all(
        uniqueHrefs.map(async (href) => {
          try {
            if (import.meta.env.DEV) return;
            const { error, result } = await ogs({ url: href, timeout: 15 });
            const url =
              !error && result.success ? result.ogImage?.[0]?.url : undefined;

            // 下記の画像だけ 403 になってしまうためスキップ
            if (
              url ===
              "https://cdn.image.st-hatena.com/image/scale/2f878b3ba0bf86adc636925200354bc3aa83ea9f/backend=imagemagick;version=1;width=1300/https%3A%2F%2Fcdn-ak.f.st-hatena.com%2Fimages%2Ffotolife%2Fj%2Fjigintern2020%2F20200821%2F20200821224521.png"
            ) {
              return;
            }
            if (url) ogpImageMap[href] = url;
          } catch {
            // フォールバックは item.image が使われる
          }
        }),
      );

      return pastLogs.map((log, i) => ({
        id: i, // ContentsCollection には id が必要なのと、並び替えのために配列のindexをidとして持たせる
        ...log,
        items: log.items.map((item) => ({
          ...item,
          image: item.href ? ogpImageMap[item.href] || item.image : item.image,
        })),
      }));
    },
  }),
  schema: ({ image }) =>
    z.object({
      tabName: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          href: z.union([z.url(), z.literal("")]),
          image: image().optional(),
        }),
      ),
    }),
});

export const collections = { internships, pastLogs };
