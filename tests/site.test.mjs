import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { PROFILE_DATA } from '../src/data/profileData.js';

const root = resolve('dist');
const pages = readdirSync(root, { recursive: true }).filter(file => file.endsWith('.html'));
const base = (process.env.SITE_BASE || '/kendi-sayfam').replace(/\/$/, '') + '/';
const read = file => readFileSync(resolve(root, file), 'utf8');
const publishedPosts = readdirSync('src/content/blog').filter(file => {
    if (!file.endsWith('.md')) return false;
    const frontmatter = readFileSync(resolve('src/content/blog', file), 'utf8').split('---')[1] || '';
    return !/^draft:\s*true\s*$/m.test(frontmatter);
});

test('all portfolio and published article pages are generated', () => {
    assert.equal(pages.length, 5 + publishedPosts.length);
});

for (const page of pages) {
    test(`${page}: landmarks, canonical and local resources`, () => {
        const html = read(page);
        assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, 'one page heading');
        assert.match(html, /<main[^>]*id="main-content"/);
        assert.match(html, /rel="canonical" href="https:\/\/auri3l\.github\.io\//);
        assert.doesNotMatch(html, /aur13l\.github/);
        for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
            if (!raw.startsWith(base)) continue;
            const target = decodeURIComponent(raw.split(/[?#]/)[0].slice(base.length));
            const file = resolve(root, target || '.');
            assert.ok(!relative(root, file).startsWith('..'), 'resource stays in output');
            assert.ok(existsSync(file), `missing ${raw}`);
        }
        for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
            assert.match(tag, /width="\d+"/);
            assert.match(tag, /height="\d+"/);
            assert.match(tag, /alt="[^"]*"/);
        }
    });
}

test('contact flow describes email handoff and exposes no passphrase hint', () => {
    const html = read('iletisim/index.html');
    assert.match(html, /E-posta Uygulamasında Aç/);
    assert.match(html, /id="contactFormStatus"[^>]*role="status"/);
    assert.match(html, /<dialog[^>]*id="passphraseModal"/);
    assert.doesNotMatch(html, /ayt2026/);
});

test('sitemap includes every published page', () => {
    const sitemap = read('sitemap.xml');
    assert.equal((sitemap.match(/<loc>/g) || []).length, pages.length);
    assert.match(sitemap, /https:\/\/auri3l\.github\.io\//);
});

test('facade filtering includes every facade project', () => {
    assert.equal((read('index.html').match(/data-discipline="facade"/g) || []).length,
        PROFILE_DATA.projects.filter(project => project.discipline === 'facade').length);
});
