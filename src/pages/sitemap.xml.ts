import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '') + '/';
    const posts = await getCollection('blog', ({ data }) => !data.draft);
    const routes = ['', 'cv/', 'blog/', 'iletisim/', 'simulasyon/', ...posts.map(post => `makale/${post.id}/`)];
    const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    const urls = routes.map(route => `<url><loc>${escape(new URL(base + route, site).href)}</loc></url>`).join('');
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
        headers: { 'Content-Type': 'application/xml; charset=utf-8' }
    });
};
