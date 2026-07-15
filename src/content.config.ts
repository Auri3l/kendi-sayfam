import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    date: z.string(),
    imageUrl: z.string().optional(),
    draft: z.boolean().default(false),
    excerpt: z.string()
  })
});

export const collections = {
  'blog': blogCollection
};
