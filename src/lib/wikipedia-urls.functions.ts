import { createServerFn } from "@tanstack/react-start";
import { listWikipediaCategories } from "@/lib/wikipedia-urls.server";

export const getWikiCategories = createServerFn({ method: "GET" })
  .handler(async () => {
    const cats = await listWikipediaCategories();
    return { categories: cats };
  });
